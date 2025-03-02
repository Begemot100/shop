// components/ProductCard.js
import Image from "next/image";

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <h2>{product.name}</h2>
      <p>{product.price} ₽</p>
      <div className="product-images">
        {product.image1 && (
          <Image
            src={`/images/${nastya1.jpeg}`}  // путь к изображению в папке public
            alt={product.name}
            width={400}
            height={400}
          />
        )}
        {product.image2 && (
          <Image
            src={`/images/${nastya2.jpeg}`} // Путь к второму изображению
            alt={product.name}
            width={400}
            height={400}
          />
        )}
        {product.image3 && (
          <Image
            src={`/images/${nastya3.jpeg}`} // Путь к третьему изображению
            alt={product.name}
            width={400}
            height={400}
          />
        )}
      </div>
    </div>
  );
}