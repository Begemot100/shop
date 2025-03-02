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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    // Prevent multiple submissions
    const url = isLogin ? "/api/login" : "/api/register";
    const userData = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch("https://shop-production-3be1.up.railway.app/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        timeout: 10000,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Успешно!");

        // Store user data securely (avoid raw passwords)
        localStorage.setItem("user", JSON.stringify({ name, email }));

        setTimeout(() => {
          onClose(); // Close modal
          router.push("/dashboard"); // Redirect to user dashboard
        }, 1000);
      } else {
        setMessage(`❌ Ошибка: ${data.error || "Попробуйте снова"}`);
      }
    } catch (error) {
      setMessage("❌ Ошибка сервера");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-md z-50"
      onClick={onClose}
    >
      <motion.div
        className="relative bg-gradient-to-r from-red-900 via-black to-cyan-700 p-8 rounded-xl shadow-xl w-[400px] border border-gray-600"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-white text-xl hover:text-gray-400"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="flex justify-center space-x-6 mb-6">
          <button
            className={`text-lg font-semibold ${
              !isLogin ? "text-white border-b-2 border-white" : "text-gray-400"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Registration
          </button>
          <button
            className={`text-lg font-semibold ${
              isLogin ? "text-white border-b-2 border-white" : "text-gray-400"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300">Имя</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-transparent text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Введите имя"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-600 bg-transparent text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Введите email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-600 bg-transparent text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Введите пароль"
              required
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-white text-black font-semibold px-6 py-2 rounded-md hover:bg-gray-300 transition-all"
              disabled={isSubmitting}
            >
              {isLogin ? "Войти" : "Зарегистрироваться"}
            </button>
          </div>
        </form>

        {message && (
          <p className="text-center text-white mt-4 font-medium">{message}</p>
        )}
      </motion.div>
    </div>
  );
}