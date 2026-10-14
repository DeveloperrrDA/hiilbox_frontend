import { Footer } from "@/app/components/front-pages/layout/Footer";
import Header from "@/app/components/front-pages/layout/Header";

export default function ThemeShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-[#111c2d]">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
