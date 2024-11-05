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
	  	<header className='text-center py-8'>
	  		<a href="/"><h1> ロボのブログ</h1></a>
	  	</header>
	  	{children}
	  	<footer className='text-center py-1'>
	  		<a href="https://x.com/robo_power"><p>@robo_power</p></a>
	  	</footer>
	  </div>
      </body>
    </html>
  );
}
