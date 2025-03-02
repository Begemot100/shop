import NextAuth from "next-auth"
import Providers from "next-auth/providers"

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Другие провайдеры
  ],
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session(session, token) {
      session.user.id = token.id
      session.user.email = token.email
      return session
    }
  },
  pages: {
    signIn: '/auth/signin', // Убедитесь, что этот путь правильный
  }
})