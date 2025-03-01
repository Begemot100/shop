"use client";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import RegisterModal from "../components/RegisterModal"; // Подключаем форму регистрации

const images = [
  "/images/nastya10.jpeg",
  "/images/nastya20.jpeg",
  "/images/nastya3.jpeg",
  "/images/nastya4.jpeg",
  "/images/nastya5.jpeg",
  "/images/nastya6.jpeg",
  "/images/nastya7.jpeg",
  "/images/nastya8.jpeg",
  "/images/nastya9.jpeg",
  "/images/nastya10.jpeg",
  "/images/nastya11.jpeg",
  "/images/nastya12.jpeg",
  "/images/nastya13.jpeg",
  "/images/nastya14.jpeg",
  "/images/nastya15.jpeg",
  "/images/nastya16.jpeg",
  "/images/nastya17.jpeg",
  "/images/nastya1.jpeg",
  "/images/nastya19.jpeg",
  "/images/nastya2.jpeg",
];

export default function Home() {
  const { scrollY } = useScroll();
  const [imageData, setImageData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Стейт для модального окна

  useEffect(() => {
    const generatedData = images.map(() => ({
      left: Math.random() * 20 + 10, // Увеличьте разброс по горизонтали
      size: Math.random() * (500 - 100) + 300, // Уменьшите размер фото
      yStart: 100 + Math.random() * 100, // Начальная позиция фото
    }));
    setImageData(generatedData);
  }, []);

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden bg-black"
      style={{
        backgroundImage: "url('/images/m.jpg')",
        backgroundSize: "cover", // Для десктопа
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // Для десктопа
      }}
    >
      {/* Логотип */}
      <motion.h1
        className="fixed top-1/3 left-1/2 transform -translate-x-1/2 text-[10vw] sm:text-[12vw] md:text-[8vw] lg:text-[6vw] text-white font-thin tracking-wider mix-blend-difference"
        style={{ opacity: useTransform(scrollY, [0, 300], [1, 0]) }}
      >
        TRENDFORU
      </motion.h1>

      {/* Контейнер для анимации изображений */}
      <div className="relative w-full h-[1500vh]">
        {imageData.length > 0 &&
          images.map((src, index) => (
            <motion.div
              key={index}
              className="absolute rounded-lg overflow-hidden shadow-lg"
              style={{
                top: `${index * 150 + 100}vh`, // Уменьшите расстояние между фото
                left: `${imageData[index].left}vw`,
                width: `${imageData[index].size}px`,
                height: `${imageData[index].size}px`,
              }}
              initial={{ opacity: 0, y: imageData[index].yStart }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 3.5, delay: index * 0.3 }} // Уменьшите задержку
            >
              <Image
                src={src}
                alt={`Fashion ${index + 1}`}
                width={imageData[index].size}
                height={imageData[index].size}
                className="object-cover w-full h-full"
              />
            </motion.div>
          ))}
      </div>

      {/* Фиксированные кнопки навигации */}
      <div className="fixed inset-0 flex justify-between items-start sm:flex-col md:flex-row p-6 pointer-events-none">
        <a href="/new" className="fixed top-5 left-5 sm:top-1 sm:left-1 text-white text-xl font-bold uppercase tracking-widest hover:underline pointer-events-auto">
          NEW
        </a>
        <a href="#" className="fixed top-5 right-5 sm:top-1 sm:right-1 text-white text-xl font-bold uppercase tracking-widest hover:underline pointer-events-auto">
          BIO
        </a>
        <a
          href="#"
          className="fixed bottom-5 left-5 sm:bottom-1 sm:left-1 text-white text-xl font-bold uppercase tracking-widest hover:underline pointer-events-auto"
          onClick={(e) => {
            e.preventDefault();
            setIsModalOpen(true);
          }}
        >
          MY ACCOUNT
        </a>
        <a href="#" className="fixed bottom-5 right-5 sm:bottom-1 sm:right-1 text-white text-xl font-bold uppercase tracking-widest hover:underline pointer-events-auto">
          SALE
        </a>
      </div>

      {/* Модальное окно регистрации */}
      <RegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
//1