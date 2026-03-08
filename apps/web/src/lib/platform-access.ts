export function getSuperAdminEmails() {
  return (process.env.SUPER_ADMIN_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function canAccessPlatform(email: string) {
  return getSuperAdminEmails().includes(email.toLowerCase());
}
