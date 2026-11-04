"use client";


import FrontHeader from "../components/front-pages/layout/Header";
import { Footer } from "../components/front-pages/layout/Footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="frontend-page bg-white dark:bg-dark">
      {/* Header */}
    <FrontHeader />
      {/* Content */}
      <section>{children}</section>
      {/* Footer */}
      <Footer />
    </div>
  );
}
