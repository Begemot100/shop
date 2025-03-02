"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from './NewCollection.module.css';

export default function NewCollection() {
  const [newProducts, setNewProducts] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const response = await fetch("https://shop-production-3be1.up.railway.app/api/products/new");

        if (!response.ok) {
          console.error("Ошибка на сервере:", response.status, response.statusText);
          throw new Error('Ошибка при загрузке данных с сервера');
        }

        const data = await response.json();
        setNewProducts(data); // Сохраняем данные продуктов в состояние
      } catch (err) {
        console.error("Ошибка при запросе данных:", err);
        setError("Не удалось загрузить новые продукты.");
      }
    };

    fetchNewProducts(); // Вызываем функцию при монтировании компонента
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 }, // Начальное состояние (невидимо, смещено вниз и уменьшено)
    visible: { opacity: 1, y: 0, scale: 1 }, // Конечное состояние (видимо, на месте и нормального размера)
  };

  const buttonVariants = {
    hover: { scale: 1.05, backgroundColor: "#dc2626" }, // Эффект при наведении
    tap: { scale: 0.95 }, // Эффект при нажатии
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <motion.h1
        className="text-4xl font-bold text-center mb-10"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        New Collection
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {error && <p className="text-center text-red-500">{error}</p>}
        {newProducts.length > 0 ? (
          newProducts.map((product, index) => (
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