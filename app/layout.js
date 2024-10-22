import localFont from "next/font/local";
import "./globals.css";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "ロボのブログ(r-portal)",
  description: "その辺の大学生が日々学んだことやその他日常を投稿するブログです。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className={inter.className}>
	  <div className='flex min-h-screen flex-col justify-between'>
	  	<header className='bg-teal-300 text-center py-8'>
	  		<h1> ロボのブログ</h1>
	  	</header>
	  	{children}
	  	<footer className='bg-teal-300 text-center py-1'>
	  		<p>©2024 robo_power All rights reserved</p>
	  	</footer>
	  </div>
      </body>
    </html>
  );
}
