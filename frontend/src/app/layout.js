import "./globals.css"; // Подключение Tailwind CSS
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={spaceGrotesk.variable}>
      <body className="font-sans bg-black text-white">{children}</body>
    </html>
  );
}
