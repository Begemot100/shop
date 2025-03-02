// /pages/auth/signin.js

import { signIn } from "next-auth/react";

export default function SignIn() {
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
      window.location.href = "/dashboard";  // Перенаправление после успешного входа
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