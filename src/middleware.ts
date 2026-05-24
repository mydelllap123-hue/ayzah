import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role as string;
    const isAdmin = role === "admin" || role === "superadmin";

    console.log("Middleware Check - Path:", path, "| Role:", role, "| IsAdmin:", isAdmin);

    if (path.startsWith("/admin") && !isAdmin) {
      console.log("Unauthorized admin access attempt - Redirecting to home");
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log("Authorized Check - Token Present:", !!token);
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
