import localFont from "next/font/local";
import "./globals.css";
import { Inter } from 'next/font/google';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faXTwitter } from "@fortawesome/free-brands-svg-icons";

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
	  	<header className='text-left py-4 px-4 shadow-orange-500 shadow'>
	  		<a href="/"><h1 className="my-0"> ロボのブログ</h1></a>
	  	</header>
	  	{children}
	  	<footer className='py-1'>
			<div className='px-10 mx-auto max-w-screen-md'>
				<div className='flex justify-center items-center gap-8'>
					<div className='flex flex-row items-center gap-1'><FontAwesomeIcon icon={ faXTwitter } className="h-[20px]"/><a href="https://x.com/robo_power">@robo_power</a></div>
					<div className='flex flex-row items-center gap-1'><FontAwesomeIcon icon={ faGithub } className="h-[20px]"/><a href="https://github.com/robo-power">@robo-power</a></div>
					<a href="https://github.com/robo-power/blog">ブログのソース: robo-power/blog</a>
				</div>
				<p className='text-center'>©2024 robo_power</p>
			</div>
	  	</footer>
	  </div>
      </body>
    </html>
  );
}
