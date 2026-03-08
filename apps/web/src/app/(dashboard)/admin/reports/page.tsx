export default function AdminReportsPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Reports and Exports</h1>
        <p className="mt-2 text-mist">Download CSV-based operational reports for attendance, grade sheets, and transcript-ready academic exports.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { href: "/api/reports?type=attendance", title: "Attendance Report", helper: "Session-level attendance export" },
          { href: "/api/reports?type=grade-sheet", title: "Grade Sheet", helper: "Marks and grade export" },
          { href: "/api/reports?type=transcript", title: "Transcript Export", helper: "Transcript-ready marks dataset" }
        ].map((item) => (
          <a key={item.href} href={item.href} className="glass rounded-[32px] p-6">
            <h2 className="text-xl font-semibold text-ink">{item.title}</h2>
            <p className="mt-2 text-sm text-mist">{item.helper}</p>
            <p className="mt-4 text-sm font-semibold text-brand">Download CSV</p>
          </a>
        ))}
      </div>
      <div className="glass rounded-[32px] p-6 text-mist">
        PDF rendering is not wired yet; these exports are structured so a later PDF layer can build on top without changing the underlying report queries.
      </div>
    </section>
  );
}

