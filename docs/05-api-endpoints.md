# 5. API Endpoints

Base path: `/api/v1`

## Auth

- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /auth/me`

## Institutions

- `GET /institutions/:institutionId`
- `PATCH /institutions/:institutionId`
- `GET /institutions/:institutionId/settings`
- `PATCH /institutions/:institutionId/settings`

## Users and Roles

- `GET /roles`
- `GET /users`
- `POST /users`
- `GET /users/:userId`
- `PATCH /users/:userId`
- `DELETE /users/:userId`

## Departments

- `GET /departments`
- `POST /departments`
- `GET /departments/:departmentId`
- `PATCH /departments/:departmentId`
- `GET /departments/:departmentId/analytics`

## Courses and Subjects

- `GET /courses`
- `POST /courses`
- `GET /courses/:courseId`
- `PATCH /courses/:courseId`
- `GET /subjects`
- `POST /subjects`
- `GET /subjects/:subjectId`
- `PATCH /subjects/:subjectId`

## Students

- `GET /students`
- `POST /students`
- `POST /students/import`
- `GET /students/:studentId`
- `PATCH /students/:studentId`
- `GET /students/:studentId/attendance`
- `GET /students/:studentId/marks`
- `GET /students/:studentId/timetable`
- `GET /students/:studentId/mentor`
- `GET /students/:studentId/notifications`

## Mentors

- `GET /mentors`
- `POST /mentors`
- `GET /mentors/:mentorId`
- `PATCH /mentors/:mentorId`
- `POST /mentors/:mentorId/groups`
- `GET /mentors/:mentorId/groups`
- `GET /mentors/:mentorId/students`
- `GET /mentors/:mentorId/analytics`

## Mentor Meetings

- `GET /mentor-meetings`
- `POST /mentor-meetings`
- `GET /mentor-meetings/:meetingId`
- `PATCH /mentor-meetings/:meetingId`

## Faculty

- `GET /faculty`
- `POST /faculty`
- `GET /faculty/:facultyId`
- `PATCH /faculty/:facultyId`
- `GET /faculty/:facultyId/courses`
- `GET /faculty/:facultyId/analytics`

## Enrollments

- `GET /enrollments`
- `POST /enrollments`
- `GET /enrollments/:enrollmentId`
- `PATCH /enrollments/:enrollmentId`

## Attendance

- `GET /attendance/sessions`
- `POST /attendance/sessions`
- `GET /attendance/sessions/:sessionId`
- `POST /attendance/sessions/:sessionId/mark`
- `PATCH /attendance/:attendanceId`
- `GET /attendance/reports/defaulters`
- `GET /attendance/reports/summary`

## Examinations and Marks

- `GET /exams`
- `POST /exams`
- `GET /exams/:examId`
- `PATCH /exams/:examId`
- `POST /marks`
- `POST /marks/bulk-upload`
- `GET /marks`
- `GET /marks/student/:studentId`
- `GET /marks/subject/:subjectId`
- `GET /results/student/:studentId`

## Announcements and Notifications

- `GET /announcements`
- `POST /announcements`
- `GET /announcements/:announcementId`
- `PATCH /announcements/:announcementId`
- `GET /notifications`
- `POST /notifications/send`
- `PATCH /notifications/:notificationId/read`

## Analytics

- `GET /analytics/overview`
- `GET /analytics/attendance`
- `GET /analytics/performance`
- `GET /analytics/mentorship`
- `GET /analytics/department/:departmentId`
- `GET /analytics/student-risk`

## Reports

- `POST /reports/generate`
- `GET /reports`
- `GET /reports/:reportId`
- `GET /reports/:reportId/download`

## API Architecture Notes

- Authentication: JWT access token + refresh token
- Authorization: role-based middleware plus tenant isolation
- Request validation: Zod or Joi schemas
- Response shape:

```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "uuid",
    "pagination": null
  },
  "error": null
}
```

- Recommended service layers:
  - auth
  - institutions
  - academics
  - students
  - mentors
  - attendance
  - exams
  - communications
  - analytics
  - reporting
