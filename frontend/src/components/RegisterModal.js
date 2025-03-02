"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const url = isLogin ? "/api/login" : "/api/register";
    const userData = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
     if (response.ok) {
  setMessage("✅ Успешно!");

  console.log("Сервер ответил успешно:", data); // Отладка

  // Проверяем, есть ли name и email перед сохранением
  if (name && email) {
    localStorage.setItem("user", JSON.stringify({ name, email }));
    console.log("Пользователь сохранен в localStorage:", { name, email });
  } else {
    console.error("Ошибка: нет данных name или email");
  }

  setTimeout(() => {
    onClose();
    router.push("/profile");
  }, 1000);
} else {
        setMessage(`❌ Ошибка: ${data.error || "Попробуйте снова"}`);
      }
    } catch (error) {
      setMessage("❌ Ошибка сервера");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-md z-50"
      onClick={onClose}
    >
      <motion.div
        className="relative bg-gray-100 p-8 rounded-xl shadow-xl w-[400px] border border-gray-300"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-black text-xl hover:text-gray-500"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="flex justify-center space-x-6 mb-6">
          <button
            className={`text-lg font-semibold ${
              !isLogin ? "text-black border-b-2 border-black" : "text-gray-400"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Регистрация
          </button>
          <button
            className={`text-lg font-semibold ${
              isLogin ? "text-black border-b-2 border-black" : "text-gray-400"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Вход
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-600">Имя</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-400 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Введите имя"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-400 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Введите email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-400 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Введите пароль"
              required
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="text-lg font-medium tracking-wide text-black hover:underline"
            >
              {isLogin ? "Войти" : "Зарегистрироваться"}
            </button>
          </div>
        </form>

        {message && (
          <p className="text-center text-black mt-4 font-medium">{message}</p>
        )}
      </motion.div>
    </div>
  );
}