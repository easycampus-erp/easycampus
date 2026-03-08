import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getUserRole, roleMatchesPath } from "@/lib/auth";

type CookieMutation = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieMutation[]) {
          response = NextResponse.next({
            request
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options as never);
          });
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isDashboardRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/faculty") ||
    pathname.startsWith("/mentor") ||
    pathname.startsWith("/student") ||
    pathname.startsWith("/onboarding");

  if (!isDashboardRoute) {
    return response;
  }

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    if (request.cookies.getAll().some((cookie) => cookie.name.includes("sb-"))) {
      url.searchParams.set("error", "session_expired");
    }
    return NextResponse.redirect(url);
  }

  const role = getUserRole(user);

  if (!role || !roleMatchesPath(pathname, role)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(url);
  }

  const { data: onboarding } = await supabase
    .from("onboarding_progress")
    .select("completed_at")
    .eq("profile_id", user.id)
    .eq("role", role)
    .single();

  if (!onboarding?.completed_at && pathname !== "/onboarding") {
    const url = request.nextUrl.clone();
    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/faculty/:path*", "/mentor/:path*", "/student/:path*", "/onboarding"]
};
