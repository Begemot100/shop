"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // Импортируем Framer Motion

export default function NewCollection() {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  // Анимации для карточек
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 }, // Начальное состояние (невидимо, смещено вниз и уменьшено)
    visible: { opacity: 1, y: 0, scale: 1 }, // Конечное состояние (видимо, на месте и нормального размера)
  };

  // Анимация для кнопки
  const buttonVariants = {
    hover: { scale: 1.05, backgroundColor: "#dc2626" }, // Эффект при наведении
    tap: { scale: 0.95 }, // Эффект при нажатии
  };

  // Анимация для заголовка
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  useEffect(() => {
    async function fetchProducts() {
      const data = await fetchNewCollection();
      if (data) setProducts(data);
    }
    fetchProducts();
  }, []);

  // Функция для загрузки новых продуктов
  const fetchNewCollection = async () => {
    try {
      const response = await fetch("https://shop-production-3be1.up.railway.app/api/products/new", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        console.error("Ошибка на сервере:", response.status, response.statusText);
        return;
      }

      const data = await response.json();
      console.log("Данные с сервера:", data);
      return data;
    } catch (error) {
      console.error("Ошибка сети:", error);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      {/* Анимация заголовка */}
      <motion.h1
        className="text-4xl font-bold text-center mb-10"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        New Collection
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product, index) => (
            <motion.div
              key={product.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1, duration: 0.5 }} // Задержка и длительность анимации
              className="bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.05 }} // Эффект при наведении на карточку
            >
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={500}
                className="object-cover w-full h-64 rounded-md"
              />
              <h2 className="text-xl font-semibold mt-4">{product.name}</h2>
              <p className="text-gray-400">€{product.price}</p>
              <motion.button
                className="mt-4 bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition w-full"
                onClick={() => router.push(`/product/${product.id}`)}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Подробнее
              </motion.button>
            </motion.div>
          ))
        ) : (
          <motion.p
            className="text-center text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Загрузка товаров...
          </motion.p>
        )}
      </div>
    </div>
  );
}