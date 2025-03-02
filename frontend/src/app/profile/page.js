"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      router.push("/");
    } else {
      setUser(storedUser);
    }

    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);

    const savedHistory = JSON.parse(localStorage.getItem("purchaseHistory")) || [];
    setPurchaseHistory(savedHistory);

    const savedAddress = localStorage.getItem("address") || "";
    setAddress(savedAddress);
  }, []);

  const handleSaveAddress = () => {
    localStorage.setItem("address", address);
    alert("Адрес сохранён!");
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-black p-10 font-[Space Grotesk] flex flex-col items-center">
      <motion.h1
        className="text-5xl font-bold tracking-tight mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Личный кабинет
      </motion.h1>

      {user && (
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold">{user.name[0]}</span>
          </div>
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      )}

      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold">Адрес доставки</h2>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Введите ваш адрес"
          className="w-full p-3 border border-gray-300 bg-white text-black rounded-md mt-2"
        />
        <button
          onClick={handleSaveAddress}
          className="mt-4 text-lg font-medium tracking-wide text-blue-600 hover:underline"
        >
          Сохранить адрес
        </button>
      </div>

      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Ваша корзина</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">Корзина пуста</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {cart.map((product, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-4 bg-gray-100 p-4 rounded-md"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Image
                  src={`/images/${product.images[0]}`}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="object-cover rounded-md"
                />
                <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">€{product.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center gap-6 mt-10">
        <motion.button
          className="text-lg font-medium tracking-wide text-blue-600 hover:underline"
          onClick={() => router.push("/")}
        >
          Продолжить покупки
        </motion.button>
        <motion.button
          className="text-lg font-medium tracking-wide text-red-600 hover:underline"
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/");
          }}
        >
          Выйти
        </motion.button>
      </div>
    </div>
  );
}
