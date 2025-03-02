"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ShoppingCart } from "lucide-react";

export default function NewCollection() {
  const [newProducts, setNewProducts] = useState([
    {
      id: 1,
      name: "Куртка белая",
      price: 99.99,
      images: ["nastya1.jpeg", "nastya2.jpeg", "nastya3.jpeg"],
    },
    {
      id: 2,
      name: "Куртка черная",
      price: 89.99,
      images: ["nastya4.jpeg", "nastya5.jpeg", "nastya6.jpeg"],
    },
    {
      id: 3,
      name: "Куртка зеленая",
      price: 79.99,
      images: ["nastya7.jpeg", "nastya8.jpeg", "nastya9.jpeg"],
    },
    {
      id: 4,
      name: "Куртка синяя",
      price: 69.99,
      images: ["nastya10.jpeg", "nastya11.jpeg", "nastya12.jpeg"],
    },
    {
      id: 5,
      name: "Куртка бежевая",
      price: 119.99,
      images: ["nastya13.jpeg", "nastya14.jpeg", "nastya15.jpeg"],
    },
    {
      id: 6,
      name: "Куртка красная",
      price: 109.99,
      images: ["nastya16.jpeg", "nastya17.jpeg", "nastya18.jpeg"],
    },
    {
      id: 7,
      name: "Куртка серая",
      price: 59.99,
      images: ["nastya19.jpeg", "nastya20.jpeg", "nastya5.jpeg"],
    },
    {
      id: 8,
      name: "Куртка фиолетовая",
      price: 89.99,
      images: ["nastya7.jpeg", "nastya8.jpeg", "nastya3.jpeg"],
    },
  ]);

  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart, product];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  return (
    <div className="min-h-screen bg-white text-black p-10 relative font-[Space Grotesk]">
      <div className="fixed inset-0 flex justify-between items-start sm:flex-col md:flex-row p-6 pointer-events-none">
        <a
          href="/new"
          className="fixed top-5 left-5 sm:top-1 sm:left-1 text-black text-xl font-bold uppercase tracking-widest hover:underline pointer-events-auto"
        >
          NEW
        </a>
        <a
          href="#"
          className="fixed top-5 right-5 sm:top-1 sm:right-1 text-black text-xl font-bold uppercase tracking-widest hover:underline pointer-events-auto"
        >
          BIO
        </a>
        <a
          href="#"
          className="fixed bottom-5 right-5 sm:bottom-1 sm:right-1 text-black text-xl font-bold uppercase tracking-widest hover:underline pointer-events-auto"
        >
          SALE
        </a>
        <a
          href="/profile"
          className="fixed bottom-5 left-5 sm:bottom-1 sm:left-1 text-black text-xl font-bold uppercase tracking-widest hover:underline pointer-events-auto"
        >
          MY ACCOUNT
        </a>
      </div>

      <motion.h1
        className="text-6xl font-bold text-left mb-16 tracking-tight mt-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        New Collection
      </motion.h1>

      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 flex items-center cursor-pointer" onClick={() => router.push('/cart')}>
        <ShoppingCart size={32} className="text-black" />
        {cart.length > 0 && (
          <span className="ml-2 bg-red-600 text-white px-2 py-1 rounded-full text-sm font-bold">
            {cart.length}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {newProducts.map((product, index) => (
          <motion.div
            key={product.id}
            className="relative flex flex-col items-start gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Carousel showThumbs={false} showStatus={false} infiniteLoop={true} className="w-full aspect-[4/5]">
              {product.images.map((img, i) => (
                <div key={i} className="relative w-full h-full overflow-hidden">
                  <Image
                    src={`/images/${img}`}
                    alt={product.name}
                    width={400}
                    height={500}
                    className="object-cover"
                  />
                </div>
              ))}
            </Carousel>
            <h2 className="text-2xl font-semibold">{product.name}</h2>
            <p className="text-lg text-gray-600">€{product.price}</p>
            <div className="flex gap-4 mt-2">
              <motion.button
                className="border border-black px-6 py-2 text-lg font-medium tracking-wide hover:bg-black hover:text-white transition-all"
                onClick={() => router.push(`/product/${product.id}`)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Подробнее
              </motion.button>
              <motion.button
                className="border border-gray-500 px-6 py-2 text-lg text-gray-600 font-medium tracking-wide hover:bg-gray-800 hover:text-white transition-all"
                onClick={() => addToCart(product)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                В корзину
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
