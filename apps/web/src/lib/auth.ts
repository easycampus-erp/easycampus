import type { Role } from "@easycampus/types";

const validRoles: Role[] = ["admin", "faculty", "mentor", "student"];

export function getUserRole(user: { app_metadata?: Record<string, unknown>; user_metadata?: Record<string, unknown> }) {
  const role = user.app_metadata?.role ?? user.user_metadata?.role;
  return typeof role === "string" && validRoles.includes(role as Role) ? (role as Role) : null;
}

export function roleMatchesPath(pathname: string, role: Role) {
  if (pathname.startsWith("/admin")) return role === "admin";
  if (pathname.startsWith("/faculty")) return role === "faculty";
  if (pathname.startsWith("/mentor")) return role === "mentor";
  if (pathname.startsWith("/student")) return role === "student";
  return true;
}
