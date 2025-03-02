// /pages/auth/signin.js

import { signIn } from "next-auth/react";
import { useRouter } from "next/router"; // Для навигации

export default function SignIn() {
  const router = useRouter(); // Используем useRouter для навигации

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      alert("Ошибка входа");
    } else {
      router.push("/products"); // Перенаправление на страницу товаров
    }
  };

  return (
    <div>
      <h1>Вход</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div>
          <label htmlFor="password">Пароль</label>
          <input id="password" name="password" type="password" required />
        </div>
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}