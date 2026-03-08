# 9. System Architecture

## Product Architecture Overview

EasyMentor ERP is a multi-tenant SaaS platform made of five coordinated experience layers:

- Marketing website for acquisition and lead capture
- Admin web dashboard for institution setup and governance
- Faculty web dashboard for teaching operations
- Mentor web dashboard for student support and intervention
- Student web dashboard and mobile app for self-service access

## Core Application Domains

- Identity and access
- Institution and department management
- Student lifecycle management
- Faculty and course operations
- Mentor management and counseling workflows
- Attendance capture and analysis
- Examinations, marks, and result generation
- Communication and notifications
- Analytics and reporting

## Role-Based Dashboards

### Admin Dashboard

Primary goals:
- Configure the institution
- Monitor operational health
- Assign mentors and govern policies
- Generate executive and compliance reports

Key widgets:
- Total students
- Attendance percentage
- Defaulters
- Mentor groups
- Department analytics
- Performance insights

Primary actions:
- Create departments
- Create mentors
- Create courses
- Upload student master
- Generate reports
- Assign mentors
- Configure rules

### Faculty Dashboard

Primary goals:
- Deliver courses efficiently
- Mark attendance quickly
- Upload marks and materials
- Identify student performance gaps

Primary actions:
- Mark attendance
- Upload marks
- Upload course materials
- View student analytics

### Mentor Dashboard

Primary goals:
- Track assigned students
- Log mentor meetings
- Detect attendance or academic risk
- Communicate and escalate concerns

Primary actions:
- View assigned students
- Record mentor meetings
- View attendance alerts
- Track student performance
- Send messages

### Student Dashboard

Primary goals:
- View academic standing
- Stay informed and accountable
- Access timetable, marks, and alerts
- Communicate with mentors

Primary sections:
- Attendance
- Marks
- Timetable
- Announcements
- Mentor messages

## Student Mobile App Architecture

### Screens

- Dashboard
- Attendance
- Marks
- Timetable
- Assignments
- Mentor messages
- Notifications

### Mobile design principles

- Minimal and student-friendly
- Prioritize cards over dense tables
- Show action items first
- Keep primary academic metrics above the fold

## AI Layer Opportunities

- Student risk scoring from attendance and marks trends
- Mentor intervention recommendations
- Attendance anomaly detection
- Summary generation for mentor meetings
- Executive insights for department performance

## Service Architecture

- Web frontend consumes Express APIs
- Mobile app consumes the same secured APIs
- Background workers handle reports, reminders, and notifications
- Analytics aggregates data into dashboard-ready summaries
- Notification engine sends in-app, email, push, and SMS alerts

## Security and Governance

- Multi-tenant row-level isolation at the application layer
- Role-based access control for every route and module
- Audit logs for attendance, marks, announcements, and admin changes
- PII protection for student records
- Encrypted password storage and secure session handling
