import type { Role } from "../../types/src";

export const marketingNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/university-erp", label: "University ERP" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
];

export const dashboardRoles: { href: string; label: string; role: Role }[] = [
  { href: "/admin", label: "Admin", role: "admin" },
  { href: "/faculty", label: "Faculty", role: "faculty" },
  { href: "/mentor", label: "Mentor", role: "mentor" },
  { href: "/student", label: "Student", role: "student" }
];


