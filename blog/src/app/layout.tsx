// src/app/layout.tsx
import React from 'react';
import Link from 'next/link';
import './globals.css'; // Global styles for your app

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className=''>
        <header className='p-4 bg-gray-400'>
          <nav>
            <ul className='flex flex-col items-center md:flex-row '>
              <li style={{ margin: '0 10px' }}>
                <Link href="/" style={{ color: 'white' }}>Home</Link>
              </li>
              <li style={{ margin: '0 10px' }}>
                <Link href="/about" style={{ color: 'white' }}>About</Link>
              </li>
              <li style={{ margin: '0 10px' }}>
                <Link href="/blog" style={{ color: 'white' }}>Blog</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main className='p-4'>
          <div className='flex flex-col flex-grow min-h-[100vh]'>
          {children}
        </div>
        </main>
        <footer style={{ padding: '10px', background: '#333', color: 'white', textAlign: 'center' }}>
          <p>&copy; 2025 My Next.js Blog</p>
        </footer>
      </body>
    </html>
  );
}
