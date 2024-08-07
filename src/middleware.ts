import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    console.log(req.nextauth.token);
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return (
          token?.sub === "102926335316336979769" ||
          token?.sub === "110783970093134449990" ||
          token?.sub === "111758644225543792927"
        );
      },
      },
  },
);

// match /register path and if it has params, also match
export const config = {
  matcher: "/admin/:path*", // Matches /register and any subpaths
};
