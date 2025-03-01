"use client"; // Указываем, что это клиентский компонент
import { useSession, signOut } from "next-auth/react";

export default function AdminPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Загрузка...</p>;
  }

  if (!session) {
    return <p>Доступ запрещен. Пожалуйста, войдите в систему.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Админ-панель</h1>
      <p>Добро пожаловать, {session.user.name}!</p>
      <button
        onClick={() => signOut()}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Выйти
      </button>
    </div>
  );
}