// pages/products.js
import ProductCard from "../components/ProductCard";

export default function ProductsPage() {
  const products = [
    {
      id: 1,
      name: "Продукт 1",
      price: 1000,
      image1: "nastya4.jpeg",  // Указываем имя файла без public/
      image2: "nastya5.jpeg",
      image3: "nastya6.jpeg",
    },
    {
      id: 2,
      name: "Продукт 2",
      price: 2000,
      image1: "nastya7.jpeg",
      image2: "nastya8.jpeg",
      image3: "nastya9.jpeg",
    },
  ];

  return (
    <div>
      <h1>Продукты</h1>
      <div className="product-list">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}