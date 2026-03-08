insert into public.institutions (id, name, code, institution_type, timezone)
values
  ('11111111-1111-1111-1111-111111111111', 'EasyCampus Demo University', 'ECDU', 'university', 'Asia/Kolkata')
on conflict (id) do nothing;

insert into public.departments (id, institution_id, name, code)
values
  ('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 'Computer Science', 'CSE'),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Business Administration', 'MBA')
on conflict (id) do nothing;

insert into public.courses (id, institution_id, department_id, name, code, duration_semesters, total_credits)
values
  ('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'B.Tech Computer Science', 'BTECH-CSE', 8, 160),
  ('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'MBA', 'MBA-GEN', 4, 96)
on conflict (id) do nothing;

insert into public.subjects (id, institution_id, course_id, department_id, name, code, semester_no, credits, subject_type)
values
  ('44444444-4444-4444-4444-444444444441', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222221', 'Database Management Systems', 'CSE401', 4, 4, 'theory'),
  ('44444444-4444-4444-4444-444444444442', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222221', 'Operating Systems', 'CSE402', 4, 4, 'theory'),
  ('44444444-4444-4444-4444-444444444443', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', '22222222-2222-2222-2222-222222222222', 'Marketing Strategy', 'MBA201', 2, 3, 'theory')
on conflict (id) do nothing;

insert into public.faculty (id, institution_id, department_id, employee_code, designation)
values
  ('55555555-5555-5555-5555-555555555551', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'FAC-CSE-01', 'Assistant Professor'),
  ('55555555-5555-5555-5555-555555555552', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'FAC-MBA-01', 'Associate Professor')
on conflict (id) do nothing;

insert into public.mentors (id, institution_id, department_id, employee_code, designation, capacity)
values
  ('66666666-6666-6666-6666-666666666661', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'MEN-CSE-01', 'Faculty Mentor', 40)
on conflict (id) do nothing;

insert into public.students (id, institution_id, department_id, course_id, enrollment_no, admission_year, current_semester, section, guardian_name, guardian_phone)
values
  ('77777777-7777-7777-7777-777777777771', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', '33333333-3333-3333-3333-333333333331', 'ECDU-CSE-2023-001', 2023, 4, 'A', 'Ramesh Patel', '9999999901'),
  ('77777777-7777-7777-7777-777777777772', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', '33333333-3333-3333-3333-333333333331', 'ECDU-CSE-2023-002', 2023, 4, 'A', 'Sonal Shah', '9999999902')
on conflict (id) do nothing;

insert into public.mentor_groups (id, institution_id, mentor_id, department_id, course_id, group_name, academic_year, section)
values
  ('88888888-8888-8888-8888-888888888881', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666661', '22222222-2222-2222-2222-222222222221', '33333333-3333-3333-3333-333333333331', 'CSE Mentor Group A', '2025-26', 'A')
on conflict (id) do nothing;

insert into public.mentor_group_members (mentor_group_id, student_id)
values
  ('88888888-8888-8888-8888-888888888881', '77777777-7777-7777-7777-777777777771'),
  ('88888888-8888-8888-8888-888888888881', '77777777-7777-7777-7777-777777777772')
on conflict do nothing;

insert into public.attendance_sessions (id, institution_id, subject_id, faculty_id, session_type, session_date, section, start_time, end_time)
values
  ('99999999-9999-9999-9999-999999999991', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', '55555555-5555-5555-5555-555555555551', 'lecture', current_date - 1, 'A', '09:00', '10:00'),
  ('99999999-9999-9999-9999-999999999992', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444442', '55555555-5555-5555-5555-555555555551', 'lecture', current_date, 'A', '10:00', '11:00')
on conflict (id) do nothing;

insert into public.attendance_records (attendance_session_id, student_id, status)
values
  ('99999999-9999-9999-9999-999999999991', '77777777-7777-7777-7777-777777777771', 'present'),
  ('99999999-9999-9999-9999-999999999991', '77777777-7777-7777-7777-777777777772', 'late'),
  ('99999999-9999-9999-9999-999999999992', '77777777-7777-7777-7777-777777777771', 'present'),
  ('99999999-9999-9999-9999-999999999992', '77777777-7777-7777-7777-777777777772', 'absent')
on conflict do nothing;

insert into public.exams (id, institution_id, course_id, semester_no, name, exam_type, max_marks, exam_date)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', 4, 'Internal Assessment 1', 'internal', 30, current_date - 7),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', 4, 'Internal Assessment 2', 'internal', 50, current_date - 3)
on conflict (id) do nothing;

insert into public.marks (institution_id, exam_id, student_id, subject_id, faculty_id, marks_obtained, grade, remarks)
values
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '77777777-7777-7777-7777-777777777771', '44444444-4444-4444-4444-444444444441', '55555555-5555-5555-5555-555555555551', 26, 'A', 'Strong conceptual performance'),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '77777777-7777-7777-7777-777777777772', '44444444-4444-4444-4444-444444444441', '55555555-5555-5555-5555-555555555551', 18, 'B', 'Needs revision in normalization'),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '77777777-7777-7777-7777-777777777771', '44444444-4444-4444-4444-444444444442', '55555555-5555-5555-5555-555555555551', 39, 'A+', 'Consistent systems-level reasoning'),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '77777777-7777-7777-7777-777777777772', '44444444-4444-4444-4444-444444444442', '55555555-5555-5555-5555-555555555551', 28, 'B+', 'Steady improvement after first assessment')
on conflict do nothing;

insert into public.timetable_entries (id, institution_id, course_id, subject_id, faculty_id, semester_no, section, day_of_week, start_time, end_time, room_code)
values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444441', '55555555-5555-5555-5555-555555555551', 4, 'A', 1, '09:00', '10:00', 'LAB-201'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444442', '55555555-5555-5555-5555-555555555551', 4, 'A', 1, '10:00', '11:00', 'CR-402'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444441', '55555555-5555-5555-5555-555555555551', 4, 'A', 3, '11:00', '12:00', 'LAB-201')
on conflict (id) do nothing;

insert into public.mentor_meetings (institution_id, mentor_id, student_id, meeting_date, notes, risk_level, intervention_plan, follow_up_date, outcome_notes)
values
  ('11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666661', '77777777-7777-7777-7777-777777777772', current_date - 2, 'Discussed attendance improvement and study planning.', 'medium', 'Weekly mentor check-ins and attendance recovery plan', current_date + 7, 'Student agreed to weekly progress updates')
on conflict do nothing;

insert into public.announcements (institution_id, title, body, audience)
values
  ('11111111-1111-1111-1111-111111111111', 'Semester Review Week', 'Faculty and mentors should review student risk status before Friday.', 'all'),
  ('11111111-1111-1111-1111-111111111111', 'Internal Marks Published', 'Students can review Internal Assessment 1 results in the portal.', 'students')
on conflict do nothing;

insert into public.notifications (institution_id, title, body, audience, recipient_role, scheduled_for, delivered_at)
values
  ('11111111-1111-1111-1111-111111111111', 'Attendance Alert', 'Students with attendance below threshold should meet their mentor this week.', 'role', 'student', timezone('utc', now()) - interval '2 hour', timezone('utc', now()) - interval '2 hour'),
  ('11111111-1111-1111-1111-111111111111', 'Faculty Action Required', 'Please publish pending internal marks before the end of day.', 'role', 'faculty', timezone('utc', now()) + interval '1 day', null)
on conflict do nothing;

insert into public.attendance_rules (institution_id, minimum_percentage, late_weight, alert_threshold)
values
  ('11111111-1111-1111-1111-111111111111', 75, 0.5, 70)
on conflict (institution_id) do nothing;

insert into public.grading_rules (institution_id, passing_marks)
values
  ('11111111-1111-1111-1111-111111111111', 40)
on conflict (institution_id) do nothing;

insert into public.institution_settings (institution_id, support_email, support_phone, report_footer)
values
  ('11111111-1111-1111-1111-111111111111', 'support@easycampus.demo', '+91-9876543210', 'Generated by EasyCampus EasyMentor ERP')
on conflict (institution_id) do nothing;

insert into public.scheduled_reports (institution_id, report_type, format, schedule_label, active, next_run_at)
values
  ('11111111-1111-1111-1111-111111111111', 'attendance', 'pdf', 'Every Monday 9:00 AM', true, timezone('utc', now()) + interval '7 day'),
  ('11111111-1111-1111-1111-111111111111', 'grade-sheet', 'csv', 'Month End', true, timezone('utc', now()) + interval '30 day')
on conflict do nothing;
