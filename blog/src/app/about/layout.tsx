// src/app/about/layout.tsx
import React from "react";
import Head from "next/head";
export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Head>
        <meta name="keywords" content="about, company, info" />
      </Head>
      <div style={{ display: "flex" }}>
        <nav className="m-auto ">
          {/* Sidebar or additional menu */}
          <ul className="flex flex-row px-4 gap-4 justify-between">
            <li><a href="/about">About Page</a></li>
            <li><a href="/about/team">Our Team</a></li>
            <li><a href="/about/mission">Our Mission</a></li>
          </ul>
        </nav>
        <main style={{ padding: "20px", }}>
          {children}
        </main>
      </div>
    </div>
  );
}
