"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Option = {
  label: string;
  value: string;
};

type FieldConfig = {
  name: string;
  label: string;
  type?: "text" | "number" | "select";
  placeholder?: string;
  options?: Option[];
};

type EntityItem = {
  id: string;
  title: string;
  subtitle?: string;
  values: Record<string, string>;
};

export function AdminEntityManager({
  title,
  description,
  endpoint,
  fields,
  items
}: {
  title: string;
  description: string;
  endpoint: string;
  fields: FieldConfig[];
  items: EntityItem[];
}) {
  const router = useRouter();
  const initialForm = useMemo(
    () =>
      fields.reduce<Record<string, string>>((acc, field) => {
        acc[field.name] = "";
        return acc;
      }, {}),
    [fields]
  );

  const [createForm, setCreateForm] = useState(initialForm);
  const [editing, setEditing] = useState<Record<string, Record<string, string>>>({});
  const [message, setMessage] = useState("");

  async function createEntity() {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createForm)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "Unable to create record.");
    setCreateForm(initialForm);
    setMessage(result.message ?? "Created successfully.");
    router.refresh();
  }

  async function updateEntity(id: string) {
    const payload = editing[id];
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...payload })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "Unable to update record.");
    setMessage(result.message ?? "Updated successfully.");
    router.refresh();
  }

  async function deleteEntity(id: string) {
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "Unable to delete record.");
    setMessage(result.message ?? "Deleted successfully.");
    router.refresh();
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-ink">{title}</h2>
        <p className="mt-2 text-mist">{description}</p>
      </div>

      <div className="glass rounded-[32px] p-6">
        <h3 className="text-xl font-semibold text-ink">Create new</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {fields.map((field) => (
            <Field
              key={field.name}
              field={field}
              value={createForm[field.name] ?? ""}
              onChange={(value) => setCreateForm((current) => ({ ...current, [field.name]: value }))}
            />
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={async () => {
              try {
                await createEntity();
              } catch (error) {
                setMessage(error instanceof Error ? error.message : "Unable to create record.");
              }
            }}
            className="rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-soft"
          >
            Create
          </button>
          <span className="text-sm text-mist">{message || "Create a new record for this institution."}</span>
        </div>
      </div>

      <div className="grid gap-5">
        {items.length === 0 ? (
          <div className="glass rounded-[32px] p-6 text-mist">No records found yet.</div>
        ) : (
          items.map((item) => {
            const values = editing[item.id] ?? item.values;
            return (
              <article key={item.id} className="glass rounded-[32px] p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-ink">{item.title}</h3>
                    {item.subtitle ? <p className="mt-1 text-sm text-mist">{item.subtitle}</p> : null}
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await updateEntity(item.id);
                        } catch (error) {
                          setMessage(error instanceof Error ? error.message : "Unable to update record.");
                        }
                      }}
                      className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await deleteEntity(item.id);
                        } catch (error) {
                          setMessage(error instanceof Error ? error.message : "Unable to delete record.");
                        }
                      }}
                      className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {fields.map((field) => (
                    <Field
                      key={`${item.id}-${field.name}`}
                      field={field}
                      value={values[field.name] ?? ""}
                      onChange={(value) =>
                        setEditing((current) => ({
                          ...current,
                          [item.id]: {
                            ...values,
                            [field.name]: value
                          }
                        }))
                      }
                    />
                  ))}
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

function Field({
  field,
  value,
  onChange
}: {
  field: FieldConfig;
  value: string;
  onChange: (value: string) => void;
}) {
  if (field.type === "select") {
    return (
      <label className="block text-sm font-medium text-ink">
        {field.label}
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
        >
          <option value="">Select</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="block text-sm font-medium text-ink">
      {field.label}
      <input
        type={field.type ?? "text"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
      />
    </label>
  );
}
