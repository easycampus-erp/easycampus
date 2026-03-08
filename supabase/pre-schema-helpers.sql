do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'app_role'
      and n.nspname = 'public'
  ) then
    create type public.app_role as enum ('owner', 'admin', 'faculty', 'mentor', 'student');
  end if;
end
$$;

create or replace function public.current_institution_id()
returns uuid
language plpgsql
stable
set search_path = public
as $$
declare
  resolved_institution_id uuid;
begin
  select institution_id
  into resolved_institution_id
  from public.memberships
  where profile_id = auth.uid()
  order by created_at asc
  limit 1;

  return resolved_institution_id;
exception
  when undefined_table then
    return null;
end;
$$;

create or replace function public.has_role(target_role public.app_role)
returns boolean
language plpgsql
stable
set search_path = public
as $$
declare
  role_exists boolean;
begin
  select exists (
    select 1
    from public.memberships
    where profile_id = auth.uid()
      and institution_id = public.current_institution_id()
      and role = target_role
  )
  into role_exists;

  return coalesce(role_exists, false);
exception
  when undefined_table then
    return false;
end;
$$;

create or replace function public.is_same_institution(target_institution_id uuid)
returns boolean
language plpgsql
stable
set search_path = public
as $$
begin
  return target_institution_id = public.current_institution_id();
end;
$$;
