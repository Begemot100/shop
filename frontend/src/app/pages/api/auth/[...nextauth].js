import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Другие провайдеры
  ],
  pages: {
    signIn: "/auth/signin",  // Указываем правильный путь для страницы входа
    error: "/auth/error",    // Страница для обработки ошибок
  },
});