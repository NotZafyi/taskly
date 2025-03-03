import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'



 export const authOptions=NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
  ],
})


export {authOptions as POST, authOptions as GET}