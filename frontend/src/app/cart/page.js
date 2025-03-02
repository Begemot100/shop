"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0).toFixed(2);

  return (
    <div className="min-h-screen bg-white text-black p-10 relative font-[Space Grotesk]">
      <motion.h1
        className="text-6xl font-bold text-left mb-16 tracking-tight"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Cart
      </motion.h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Ваша корзина пуста</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {cart.map((product, index) => (
            <motion.div
              key={product.id}
              className="relative flex flex-col items-start gap-4 bg-gray-100 p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="relative w-full h-80 overflow-hidden">
                <Image
                  src={`/images/${product.images[0]}`}
                  alt={product.name}
                  width={400}
                  height={500}
                  className="object-cover rounded-md"
                />
              </div>
              <h2 className="text-2xl font-semibold">{product.name}</h2>
              <p className="text-lg text-gray-600">€{product.price}</p>
              <motion.button
                className="border border-black-500 px-6 py-2 text-lg font-medium tracking-wide hover:bg-red-500 hover:text-white transition-all"
                onClick={() => removeFromCart(product.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Удалить
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="text-center mt-16">
          <h2 className="text-4xl font-bold">Total: €{totalPrice}</h2>
          <div className="flex justify-center gap-10 mt-6">
            <motion.button
              className="text-lg font-medium tracking-wide text-black-600 hover:underline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert("Оплата пока не реализована 😅")}
            >
              Перейти к оплате
            </motion.button>
            <motion.button
              className="text-lg font-medium tracking-wide text-black-600 hover:underline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/")}
            >
              Вернуться к покупкам
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
