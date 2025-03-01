"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/"); // Если нет данных — редирект на главную
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">My account</h1>
      {user ? (
        <div className="mt-4">
          <p>Добро пожаловать, <span className="font-bold">{user.name}</span>!</p>
          <p>Email: {user.email}</p>
          <button
            className="mt-4 bg-red-600 px-4 py-2 rounded-md"
            onClick={() => {
              localStorage.removeItem("user");
              router.push("/");
            }}
          >
            Выйти
          </button>
        </div>
      ) : (
        <p className="text-gray-400">Загрузка...</p>
      )}
    </div>
  );
}