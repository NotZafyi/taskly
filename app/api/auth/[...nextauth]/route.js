import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug mode
  callbacks: {
    async signIn(user, account, profile) {
      console.log("SIGN IN ATTEMPT:", user, account, profile);
      return true;
    },
  },
});