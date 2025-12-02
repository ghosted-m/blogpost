// src/app/layout.tsx
import React from 'react';
import Link from 'next/link';
import NewsScript from '../components/NewsScript';
import Tag from '../components/Tag';
import './globals.css'; // Global styles for your app

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SOCIAL NEWS</title>
        <meta name="description" content="tech news" />
        <meta name="author" content="YOUTUBE AMRENDRA" />
        <meta name="author" content="social news" />
        <meta name="keywords" content="news, tech, social, blog" />
        <NewsScript />
        <Tag />
      </head>
      <body className="">
        <header className="sticky relative top-0 p-4 bg-gray-400 flex">
          <nav className=" ">
            <ul className="flex flex-col items-center md:flex-row ">
              <li style={{ margin: "0 10px" }}>
                <Link href="/" style={{ color: "white" }}>
                  Home
                </Link>
              </li>
              <li style={{ margin: "0 10px" }}>
                <Link href="/about" style={{ color: "white" }}>
                  About
                </Link>
              </li>
              <li style={{ margin: "0 10px" }}>
                <Link href="/blog" style={{ color: "white" }}>
                  Blog
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <div className="pagelayout flex flex-col md:flex-row">
          <div className="p-4 mx-8 my-28 bg-zinc-100 md:w-1/5 md:min-h-[100vh]">
            <h2 className="text-lg font-bold mb-4 flex justify-end">
              NAVIGATION{" "}
            </h2>
            <ul className="flex flex-col gap-4 items-end">
              <li>
                <Link href="/category/technology" style={{ color: "black" }}>
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/category/politics" style={{ color: "black" }}>
                  Politics
                </Link>
              </li>
              <li>
                <Link href="/category/entertainment" style={{ color: "black" }}>
                  Entertainment
                </Link>
              </li>
              <li>
                <Link href="/category/sports" style={{ color: "black" }}>
                  Sports
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex-grow">
            <main className="p-4">
              <div className="flex flex-col flex-grow min-h-[100vh]">
                {children}
              </div>
            </main>
          </div>
          <div className="hidden md:block right-side-bar w-1/5 mx-4 my-16 sticky absolute top-16 p-8 min-h-[50vh] max-h-[80vh]">
            <ul className="p-8 space-y-4">
              <li>
                <div className="relative text-center my-10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white px-4">
                      <h2 className="text-lg font-bold mb-4 flex justify-end">
                        ARCHIVE{" "}
                      </h2>
                    </span>
                  </div>
                  <hr className="border-t-2 border-gray-300" />
                </div>
              </li>
              <li>SOCIAL</li>
              <li>TECHNOLOGY</li>
              <li>SCIENCE</li>
              <li>POLITICS</li>
              <li>ENTERTAINMENT</li>
            </ul>
          </div>
        </div>
        <footer
          style={{
            padding: "10px",
            background: "#333",
            color: "white",
            textAlign: "center",
          }}
        >
          <p>&copy; 2025 My Next.js Blog</p>
        </footer>
      </body>
    </html>
  );
}
