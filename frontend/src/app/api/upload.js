import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Отключаем встроенный парсер, чтобы обрабатывать файлы
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const chunks = [];
    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      const buffer = Buffer.concat(chunks);
      const fileName = `uploaded-${Date.now()}.jpeg`; // Генерируем уникальное имя файла
      const filePath = path.join(process.cwd(), "public", "images", fileName);

      // Сохраняем файл на сервере
      fs.writeFileSync(filePath, buffer);

      // Возвращаем путь к файлу
      res.status(200).json({ filePath: `/images/${fileName}` });
    });
  } else {
    res.status(405).json({ message: "Метод не разрешен" });
  }
}