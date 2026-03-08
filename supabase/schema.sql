create extension if not exists pgcrypto;

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

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'session_type'
      and n.nspname = 'public'
  ) then
    create type public.session_type as enum ('lecture', 'lab');
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'attendance_status'
      and n.nspname = 'public'
  ) then
    create type public.attendance_status as enum ('present', 'absent', 'late', 'excused');
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'exam_type'
      and n.nspname = 'public'
  ) then
    create type public.exam_type as enum ('internal', 'external', 'practical', 'assignment');
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique not null,
  institution_type text not null,
  status text not null default 'active',
  timezone text not null default 'Asia/Kolkata',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  phone text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (institution_id, profile_id, role)
);

create table if not exists public.user_invites (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  email text not null,
  full_name text,
  role public.app_role not null,
  department_id uuid,
  course_id uuid,
  section text,
  admission_year integer,
  enrollment_no text,
  employee_code text,
  designation text,
  capacity integer,
  guardian_name text,
  guardian_phone text,
  invited_by uuid references public.profiles(id) on delete set null,
  accepted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  name text not null,
  code text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (institution_id, code)
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  department_id uuid not null references public.departments(id) on delete cascade,
  name text not null,
  code text not null,
  duration_semesters integer not null default 8,
  total_credits integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (institution_id, code)
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  department_id uuid not null references public.departments(id) on delete cascade,
  name text not null,
  code text not null,
  semester_no integer not null,
  credits numeric(4,1) not null default 0,
  subject_type text not null default 'theory',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (institution_id, code)
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  profile_id uuid unique references public.profiles(id) on delete set null,
  department_id uuid not null references public.departments(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrollment_no text not null,
  admission_year integer not null,
  current_semester integer not null default 1,
  section text,
  guardian_name text,
  guardian_phone text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (institution_id, enrollment_no)
);

create table if not exists public.faculty (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  profile_id uuid unique references public.profiles(id) on delete set null,
  department_id uuid not null references public.departments(id) on delete cascade,
  employee_code text not null,
  designation text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (institution_id, employee_code)
);

create table if not exists public.mentors (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  profile_id uuid unique references public.profiles(id) on delete set null,
  department_id uuid not null references public.departments(id) on delete cascade,
  employee_code text not null,
  capacity integer not null default 30,
  designation text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (institution_id, employee_code)
);

create table if not exists public.mentor_groups (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  mentor_id uuid not null references public.mentors(id) on delete cascade,
  department_id uuid not null references public.departments(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  group_name text not null,
  academic_year text not null,
  section text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.mentor_group_members (
  id uuid primary key default gen_random_uuid(),
  mentor_group_id uuid not null references public.mentor_groups(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (mentor_group_id, student_id)
);

create table if not exists public.mentor_meetings (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  mentor_id uuid not null references public.mentors(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  meeting_date date not null default current_date,
  notes text not null default '',
  risk_level text not null default 'low',
  intervention_plan text,
  follow_up_date date,
  outcome_notes text,
  follow_up_completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  faculty_id uuid not null references public.faculty(id) on delete cascade,
  session_type public.session_type not null,
  session_date date not null,
  section text,
  start_time time,
  end_time time,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  attendance_session_id uuid not null references public.attendance_sessions(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  status public.attendance_status not null,
  remarks text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (attendance_session_id, student_id)
);

create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  semester_no integer not null,
  name text not null,
  exam_type public.exam_type not null default 'internal',
  max_marks numeric(6,2) not null default 100,
  exam_date date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.marks (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  exam_id uuid not null references public.exams(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  faculty_id uuid references public.faculty(id) on delete set null,
  marks_obtained numeric(6,2) not null default 0,
  grade text,
  remarks text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (exam_id, student_id, subject_id)
);

create table if not exists public.timetable_entries (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  faculty_id uuid references public.faculty(id) on delete set null,
  semester_no integer not null,
  section text,
  day_of_week integer not null check (day_of_week between 1 and 7),
  start_time time not null,
  end_time time not null,
  room_code text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  title text not null,
  body text not null,
  audience text not null default 'all',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  title text not null,
  body text not null,
  audience text not null default 'all',
  recipient_role public.app_role,
  recipient_profile_id uuid references public.profiles(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  scheduled_for timestamptz,
  delivered_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.course_materials (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  faculty_id uuid references public.faculty(id) on delete set null,
  title text not null,
  description text,
  material_type text not null default 'material',
  file_path text not null,
  file_url text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  faculty_id uuid references public.faculty(id) on delete set null,
  title text not null,
  description text,
  due_date date,
  file_path text,
  file_url text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.attendance_rules (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  minimum_percentage numeric(5,2) not null default 75,
  late_weight numeric(5,2) not null default 0.5,
  alert_threshold numeric(5,2) not null default 70,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (institution_id)
);

create table if not exists public.grading_rules (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  passing_marks numeric(6,2) not null default 40,
  grade_scale jsonb not null default '[
    {"min": 90, "grade": "O", "points": 10},
    {"min": 80, "grade": "A+", "points": 9},
    {"min": 70, "grade": "A", "points": 8},
    {"min": 60, "grade": "B+", "points": 7},
    {"min": 50, "grade": "B", "points": 6},
    {"min": 40, "grade": "C", "points": 5}
  ]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (institution_id)
);

create table if not exists public.institution_settings (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  support_email text,
  support_phone text,
  report_footer text,
  attendance_bucket text default 'attendance-reports',
  material_bucket text default 'faculty-materials',
  assignment_bucket text default 'assignments',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (institution_id)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid references public.institutions(id) on delete cascade,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.scheduled_reports (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  report_type text not null,
  format text not null default 'pdf',
  schedule_label text not null,
  active boolean not null default true,
  last_generated_at timestamptz,
  next_run_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.device_push_tokens (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  token text not null unique,
  platform text not null default 'expo',
  active boolean not null default true,
  last_seen_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.onboarding_progress (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null,
  checklist jsonb not null default '{
    "profile": false,
    "welcome": false,
    "role_setup": false
  }'::jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (institution_id, profile_id, role)
);

do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'institutions'
      and column_name = 'status'
  ) then
    alter table public.institutions add column status text not null default 'active';
  end if;
end
$$;

create table if not exists public.request_demo_leads (
  id uuid primary key default gen_random_uuid(),
  institution_name text not null,
  contact_name text not null,
  work_email text not null,
  phone text not null,
  campus_type text not null,
  student_count text not null,
  required_modules text not null,
  timeline text not null,
  notes text not null default '',
  created_at timestamptz not null default timezone('utc', now())
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_invites_department_fk'
  ) then
    alter table public.user_invites
      add constraint user_invites_department_fk
      foreign key (department_id) references public.departments(id) on delete set null;
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_invites_course_fk'
  ) then
    alter table public.user_invites
      add constraint user_invites_course_fk
      foreign key (course_id) references public.courses(id) on delete set null;
  end if;
end
$$;

create trigger institutions_set_updated_at
before update on public.institutions
for each row execute procedure public.set_updated_at();

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

create trigger departments_set_updated_at
before update on public.departments
for each row execute procedure public.set_updated_at();

create trigger courses_set_updated_at
before update on public.courses
for each row execute procedure public.set_updated_at();

create trigger subjects_set_updated_at
before update on public.subjects
for each row execute procedure public.set_updated_at();

create trigger students_set_updated_at
before update on public.students
for each row execute procedure public.set_updated_at();

create trigger faculty_set_updated_at
before update on public.faculty
for each row execute procedure public.set_updated_at();

create trigger mentors_set_updated_at
before update on public.mentors
for each row execute procedure public.set_updated_at();

create trigger mentor_groups_set_updated_at
before update on public.mentor_groups
for each row execute procedure public.set_updated_at();

create trigger announcements_set_updated_at
before update on public.announcements
for each row execute procedure public.set_updated_at();

create trigger exams_set_updated_at
before update on public.exams
for each row execute procedure public.set_updated_at();

create trigger marks_set_updated_at
before update on public.marks
for each row execute procedure public.set_updated_at();

create trigger timetable_entries_set_updated_at
before update on public.timetable_entries
for each row execute procedure public.set_updated_at();

create trigger attendance_rules_set_updated_at
before update on public.attendance_rules
for each row execute procedure public.set_updated_at();

create trigger grading_rules_set_updated_at
before update on public.grading_rules
for each row execute procedure public.set_updated_at();

create trigger institution_settings_set_updated_at
before update on public.institution_settings
for each row execute procedure public.set_updated_at();

create trigger scheduled_reports_set_updated_at
before update on public.scheduled_reports
for each row execute procedure public.set_updated_at();

create trigger onboarding_progress_set_updated_at
before update on public.onboarding_progress
for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.announcements enable row level security;

create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id);

create policy "Users can read own memberships"
on public.memberships
for select
to authenticated
using (profile_id = auth.uid());

create policy "Authenticated users can read announcements"
on public.announcements
for select
to authenticated
using (true);

drop policy if exists "Relevant users can read notifications" on public.notifications;
create policy "Relevant users can read notifications"
on public.notifications
for select
to authenticated
using (
  public.is_same_institution(institution_id)
  and (
    audience = 'all'
    or recipient_profile_id = auth.uid()
    or (recipient_role = 'admin' and public.has_role('admin'))
    or (recipient_role = 'faculty' and public.has_role('faculty'))
    or (recipient_role = 'mentor' and public.has_role('mentor'))
    or (recipient_role = 'student' and public.has_role('student'))
    or public.has_role('owner')
    or public.has_role('admin')
  )
);

drop policy if exists "Admins manage notifications" on public.notifications;
create policy "Admins manage notifications"
on public.notifications
for all
to authenticated
using (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')))
with check (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')));

create or replace function public.current_institution_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select institution_id
  from public.memberships
  where profile_id = auth.uid()
  order by case
    when role = 'owner' then 1
    when role = 'admin' then 2
    else 3
  end
  limit 1;
$$;

create or replace function public.has_role(target_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.memberships
    where profile_id = auth.uid()
      and institution_id = public.current_institution_id()
      and role = target_role
  );
$$;

create or replace function public.is_same_institution(target_institution_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select target_institution_id = public.current_institution_id();
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  matched_invite public.user_invites%rowtype;
  resolved_name text;
begin
  resolved_name := coalesce(new.raw_user_meta_data ->> 'full_name', new.email);

  insert into public.profiles (id, full_name, email)
  values (new.id, resolved_name, new.email)
  on conflict (id) do update
  set full_name = excluded.full_name,
      email = excluded.email,
      updated_at = timezone('utc', now());

  select *
  into matched_invite
  from public.user_invites
  where lower(email) = lower(new.email)
    and accepted_at is null
  order by created_at asc
  limit 1;

  if found then
    insert into public.memberships (institution_id, profile_id, role)
    values (matched_invite.institution_id, new.id, matched_invite.role)
    on conflict do nothing;

    insert into public.onboarding_progress (institution_id, profile_id, role)
    values (matched_invite.institution_id, new.id, matched_invite.role)
    on conflict do nothing;

    if matched_invite.role = 'faculty' then
      insert into public.faculty (
        institution_id,
        profile_id,
        department_id,
        employee_code,
        designation
      )
      values (
        matched_invite.institution_id,
        new.id,
        matched_invite.department_id,
        coalesce(matched_invite.employee_code, concat('FAC-', substr(new.id::text, 1, 8))),
        matched_invite.designation
      )
      on conflict (profile_id) do nothing;
    elsif matched_invite.role = 'mentor' then
      insert into public.mentors (
        institution_id,
        profile_id,
        department_id,
        employee_code,
        capacity,
        designation
      )
      values (
        matched_invite.institution_id,
        new.id,
        matched_invite.department_id,
        coalesce(matched_invite.employee_code, concat('MEN-', substr(new.id::text, 1, 8))),
        coalesce(matched_invite.capacity, 30),
        matched_invite.designation
      )
      on conflict (profile_id) do nothing;
    elsif matched_invite.role = 'student' then
      insert into public.students (
        institution_id,
        profile_id,
        department_id,
        course_id,
        enrollment_no,
        admission_year,
        section,
        guardian_name,
        guardian_phone
      )
      values (
        matched_invite.institution_id,
        new.id,
        matched_invite.department_id,
        matched_invite.course_id,
        coalesce(matched_invite.enrollment_no, concat('STU-', substr(new.id::text, 1, 8))),
        coalesce(matched_invite.admission_year, extract(year from now())::int),
        matched_invite.section,
        matched_invite.guardian_name,
        matched_invite.guardian_phone
      )
      on conflict (profile_id) do nothing;
    end if;

    update public.user_invites
    set accepted_at = timezone('utc', now())
    where id = matched_invite.id;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.institutions enable row level security;
alter table public.departments enable row level security;
alter table public.courses enable row level security;
alter table public.subjects enable row level security;
alter table public.students enable row level security;
alter table public.faculty enable row level security;
alter table public.mentors enable row level security;
alter table public.mentor_groups enable row level security;
alter table public.mentor_group_members enable row level security;
alter table public.mentor_meetings enable row level security;
alter table public.attendance_sessions enable row level security;
alter table public.attendance_records enable row level security;
alter table public.exams enable row level security;
alter table public.marks enable row level security;
alter table public.timetable_entries enable row level security;
alter table public.user_invites enable row level security;
alter table public.notifications enable row level security;
alter table public.course_materials enable row level security;
alter table public.assignments enable row level security;
alter table public.attendance_rules enable row level security;
alter table public.grading_rules enable row level security;
alter table public.institution_settings enable row level security;
alter table public.audit_logs enable row level security;
alter table public.scheduled_reports enable row level security;
alter table public.device_push_tokens enable row level security;
alter table public.onboarding_progress enable row level security;

drop policy if exists "Members can read own institution" on public.institutions;
create policy "Members can read own institution"
on public.institutions
for select
to authenticated
using (id = public.current_institution_id());

drop policy if exists "Admins can update institution" on public.institutions;
create policy "Admins can update institution"
on public.institutions
for update
to authenticated
using (public.has_role('owner') or public.has_role('admin'));

drop policy if exists "Members can read departments in institution" on public.departments;
create policy "Members can read departments in institution"
on public.departments
for select
to authenticated
using (public.is_same_institution(institution_id));

drop policy if exists "Admins manage departments" on public.departments;
create policy "Admins manage departments"
on public.departments
for all
to authenticated
using (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')))
with check (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')));

drop policy if exists "Members can read courses" on public.courses;
create policy "Members can read courses"
on public.courses
for select
to authenticated
using (public.is_same_institution(institution_id));

drop policy if exists "Admins manage courses" on public.courses;
create policy "Admins manage courses"
on public.courses
for all
to authenticated
using (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')))
with check (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')));

drop policy if exists "Members can read subjects" on public.subjects;
create policy "Members can read subjects"
on public.subjects
for select
to authenticated
using (public.is_same_institution(institution_id));

drop policy if exists "Admins and faculty manage subjects" on public.subjects;
create policy "Admins and faculty manage subjects"
on public.subjects
for all
to authenticated
using (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin') or public.has_role('faculty')))
with check (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin') or public.has_role('faculty')));

drop policy if exists "Admins faculty mentors can read students" on public.students;
create policy "Admins faculty mentors can read students"
on public.students
for select
to authenticated
using (
  public.is_same_institution(institution_id)
  and (
    public.has_role('owner')
    or public.has_role('admin')
    or public.has_role('faculty')
    or public.has_role('mentor')
    or profile_id = auth.uid()
  )
);

drop policy if exists "Admins manage students" on public.students;
create policy "Admins manage students"
on public.students
for all
to authenticated
using (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')))
with check (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')));

drop policy if exists "Members can read faculty" on public.faculty;
create policy "Members can read faculty"
on public.faculty
for select
to authenticated
using (
  public.is_same_institution(institution_id)
  and (
    public.has_role('owner')
    or public.has_role('admin')
    or public.has_role('faculty')
    or profile_id = auth.uid()
  )
);

drop policy if exists "Admins manage faculty" on public.faculty;
create policy "Admins manage faculty"
on public.faculty
for all
to authenticated
using (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')))
with check (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')));

drop policy if exists "Members can read mentors" on public.mentors;
create policy "Members can read mentors"
on public.mentors
for select
to authenticated
using (
  public.is_same_institution(institution_id)
  and (
    public.has_role('owner')
    or public.has_role('admin')
    or public.has_role('mentor')
    or profile_id = auth.uid()
  )
);

drop policy if exists "Admins manage mentors" on public.mentors;
create policy "Admins manage mentors"
on public.mentors
for all
to authenticated
using (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')))
with check (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')));

drop policy if exists "Mentors and admins can read mentor groups" on public.mentor_groups;
create policy "Mentors and admins can read mentor groups"
on public.mentor_groups
for select
to authenticated
using (
  public.is_same_institution(institution_id)
  and (
    public.has_role('owner')
    or public.has_role('admin')
    or public.has_role('mentor')
  )
);

drop policy if exists "Mentors and admins manage mentor groups" on public.mentor_groups;
create policy "Mentors and admins manage mentor groups"
on public.mentor_groups
for all
to authenticated
using (
  public.is_same_institution(institution_id)
  and (
    public.has_role('owner')
    or public.has_role('admin')
    or public.has_role('mentor')
  )
)
with check (
  public.is_same_institution(institution_id)
  and (
    public.has_role('owner')
    or public.has_role('admin')
    or public.has_role('mentor')
  )
);

drop policy if exists "Mentors admins and students can read mentor group members" on public.mentor_group_members;
create policy "Mentors admins and students can read mentor group members"
on public.mentor_group_members
for select
to authenticated
using (
  public.has_role('owner')
  or public.has_role('admin')
  or public.has_role('mentor')
  or exists (
    select 1
    from public.students s
    where s.id = mentor_group_members.student_id
      and s.profile_id = auth.uid()
  )
);

drop policy if exists "Mentors admins manage mentor group members" on public.mentor_group_members;
create policy "Mentors admins manage mentor group members"
on public.mentor_group_members
for all
to authenticated
using (public.has_role('owner') or public.has_role('admin') or public.has_role('mentor'))
with check (public.has_role('owner') or public.has_role('admin') or public.has_role('mentor'));

drop policy if exists "Mentors admins and students can read mentor meetings" on public.mentor_meetings;
create policy "Mentors admins and students can read mentor meetings"
on public.mentor_meetings
for select
to authenticated
using (
  public.has_role('owner')
  or public.has_role('admin')
  or public.has_role('mentor')
  or exists (
    select 1
    from public.students s
    where s.id = mentor_meetings.student_id
      and s.profile_id = auth.uid()
  )
);

drop policy if exists "Mentors admins manage mentor meetings" on public.mentor_meetings;
create policy "Mentors admins manage mentor meetings"
on public.mentor_meetings
for all
to authenticated
using (public.has_role('owner') or public.has_role('admin') or public.has_role('mentor'))
with check (public.has_role('owner') or public.has_role('admin') or public.has_role('mentor'));

drop policy if exists "Institution members can read attendance sessions" on public.attendance_sessions;
create policy "Institution members can read attendance sessions"
on public.attendance_sessions
for select
to authenticated
using (public.is_same_institution(institution_id));

drop policy if exists "Faculty and admins manage attendance sessions" on public.attendance_sessions;
create policy "Faculty and admins manage attendance sessions"
on public.attendance_sessions
for all
to authenticated
using (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin') or public.has_role('faculty')))
with check (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin') or public.has_role('faculty')));

drop policy if exists "Users can read relevant attendance records" on public.attendance_records;
create policy "Users can read relevant attendance records"
on public.attendance_records
for select
to authenticated
using (
  public.has_role('owner')
  or public.has_role('admin')
  or public.has_role('faculty')
  or public.has_role('mentor')
  or exists (
    select 1
    from public.students s
    where s.id = attendance_records.student_id
      and s.profile_id = auth.uid()
  )
);

drop policy if exists "Faculty and admins manage attendance records" on public.attendance_records;
create policy "Faculty and admins manage attendance records"
on public.attendance_records
for all
to authenticated
using (public.has_role('owner') or public.has_role('admin') or public.has_role('faculty'))
with check (public.has_role('owner') or public.has_role('admin') or public.has_role('faculty'));

drop policy if exists "Admins can read invites" on public.user_invites;
create policy "Admins can read invites"
on public.user_invites
for select
to authenticated
using (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')));

drop policy if exists "Admins can create invites" on public.user_invites;
create policy "Admins can create invites"
on public.user_invites
for insert
to authenticated
with check (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')));

drop policy if exists "Institution members can read exams" on public.exams;
create policy "Institution members can read exams"
on public.exams
for select
to authenticated
using (public.is_same_institution(institution_id));

drop policy if exists "Admins and faculty manage exams" on public.exams;
create policy "Admins and faculty manage exams"
on public.exams
for all
to authenticated
using (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin') or public.has_role('faculty')))
with check (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin') or public.has_role('faculty')));

drop policy if exists "Relevant users can read marks" on public.marks;
create policy "Relevant users can read marks"
on public.marks
for select
to authenticated
using (
  public.is_same_institution(institution_id)
  and (
    public.has_role('owner')
    or public.has_role('admin')
    or public.has_role('faculty')
    or public.has_role('mentor')
    or exists (
      select 1
      from public.students s
      where s.id = marks.student_id
        and s.profile_id = auth.uid()
    )
  )
);

drop policy if exists "Admins and faculty manage marks" on public.marks;
create policy "Admins and faculty manage marks"
on public.marks
for all
to authenticated
using (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin') or public.has_role('faculty')))
with check (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin') or public.has_role('faculty')));

drop policy if exists "Institution members can read timetable" on public.timetable_entries;
create policy "Institution members can read timetable"
on public.timetable_entries
for select
to authenticated
using (public.is_same_institution(institution_id));

drop policy if exists "Admins and faculty manage timetable" on public.timetable_entries;
create policy "Admins and faculty manage timetable"
on public.timetable_entries
for all
to authenticated
using (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin') or public.has_role('faculty')))
with check (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin') or public.has_role('faculty')));

drop policy if exists "Institution members can read course materials" on public.course_materials;
create policy "Institution members can read course materials"
on public.course_materials
for select
to authenticated
using (public.is_same_institution(institution_id));

drop policy if exists "Admins faculty manage course materials" on public.course_materials;
create policy "Admins faculty manage course materials"
on public.course_materials
for all
to authenticated
using (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin') or public.has_role('faculty')))
with check (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin') or public.has_role('faculty')));

drop policy if exists "Institution members can read assignments" on public.assignments;
create policy "Institution members can read assignments"
on public.assignments
for select
to authenticated
using (public.is_same_institution(institution_id));

drop policy if exists "Admins faculty manage assignments" on public.assignments;
create policy "Admins faculty manage assignments"
on public.assignments
for all
to authenticated
using (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin') or public.has_role('faculty')))
with check (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin') or public.has_role('faculty')));

drop policy if exists "Members can read attendance rules" on public.attendance_rules;
create policy "Members can read attendance rules"
on public.attendance_rules
for select
to authenticated
using (public.is_same_institution(institution_id));

drop policy if exists "Admins manage attendance rules" on public.attendance_rules;
create policy "Admins manage attendance rules"
on public.attendance_rules
for all
to authenticated
using (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')))
with check (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')));

drop policy if exists "Members can read grading rules" on public.grading_rules;
create policy "Members can read grading rules"
on public.grading_rules
for select
to authenticated
using (public.is_same_institution(institution_id));

drop policy if exists "Admins manage grading rules" on public.grading_rules;
create policy "Admins manage grading rules"
on public.grading_rules
for all
to authenticated
using (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')))
with check (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')));

drop policy if exists "Members can read institution settings" on public.institution_settings;
create policy "Members can read institution settings"
on public.institution_settings
for select
to authenticated
using (public.is_same_institution(institution_id));

drop policy if exists "Admins manage institution settings" on public.institution_settings;
create policy "Admins manage institution settings"
on public.institution_settings
for all
to authenticated
using (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')))
with check (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')));

drop policy if exists "Admins can read audit logs" on public.audit_logs;
create policy "Admins can read audit logs"
on public.audit_logs
for select
to authenticated
using (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')));

drop policy if exists "System can insert audit logs" on public.audit_logs;
create policy "System can insert audit logs"
on public.audit_logs
for insert
to authenticated
with check (public.is_same_institution(institution_id));

drop policy if exists "Admins read scheduled reports" on public.scheduled_reports;
create policy "Admins read scheduled reports"
on public.scheduled_reports
for select
to authenticated
using (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')));

drop policy if exists "Admins manage scheduled reports" on public.scheduled_reports;
create policy "Admins manage scheduled reports"
on public.scheduled_reports
for all
to authenticated
using (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')))
with check (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')));

drop policy if exists "Users read own push tokens" on public.device_push_tokens;
create policy "Users read own push tokens"
on public.device_push_tokens
for select
to authenticated
using (profile_id = auth.uid());

drop policy if exists "Users manage own push tokens" on public.device_push_tokens;
create policy "Users manage own push tokens"
on public.device_push_tokens
for all
to authenticated
using (profile_id = auth.uid() and public.is_same_institution(institution_id))
with check (profile_id = auth.uid() and public.is_same_institution(institution_id));

drop policy if exists "Admins read push tokens" on public.device_push_tokens;
create policy "Admins read push tokens"
on public.device_push_tokens
for select
to authenticated
using (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')));

drop policy if exists "Users read own onboarding" on public.onboarding_progress;
create policy "Users read own onboarding"
on public.onboarding_progress
for select
to authenticated
using (profile_id = auth.uid());

drop policy if exists "Users update own onboarding" on public.onboarding_progress;
create policy "Users update own onboarding"
on public.onboarding_progress
for update
to authenticated
using (profile_id = auth.uid())
with check (profile_id = auth.uid());

drop policy if exists "Admins read onboarding" on public.onboarding_progress;
create policy "Admins read onboarding"
on public.onboarding_progress
for select
to authenticated
using (public.is_same_institution(institution_id) and (public.has_role('owner') or public.has_role('admin')));

insert into storage.buckets (id, name, public)
values
  ('profile-assets', 'profile-assets', true),
  ('faculty-materials', 'faculty-materials', true),
  ('assignments', 'assignments', true),
  ('report-files', 'report-files', true)
on conflict (id) do nothing;

drop policy if exists "Authenticated users can view campus storage" on storage.objects;
create policy "Authenticated users can view campus storage"
on storage.objects
for select
to authenticated
using (bucket_id in ('profile-assets', 'faculty-materials', 'assignments', 'report-files'));

drop policy if exists "Authenticated users manage profile assets" on storage.objects;
create policy "Authenticated users manage profile assets"
on storage.objects
for all
to authenticated
using (bucket_id = 'profile-assets')
with check (bucket_id = 'profile-assets');

drop policy if exists "Faculty admins manage academic files" on storage.objects;
create policy "Faculty admins manage academic files"
on storage.objects
for all
to authenticated
using (
  bucket_id in ('faculty-materials', 'assignments', 'report-files')
  and (public.has_role('owner') or public.has_role('admin') or public.has_role('faculty'))
)
with check (
  bucket_id in ('faculty-materials', 'assignments', 'report-files')
  and (public.has_role('owner') or public.has_role('admin') or public.has_role('faculty'))
);





