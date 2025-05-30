import NextAuth from "next-auth";
import authOptions from "../../../../auth"; // Import the auth options from auth.ts

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };