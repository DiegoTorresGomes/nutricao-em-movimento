import { Footer } from "./Footer";
import { Header } from "./Header";

type PublicLayoutProps = {
  children: React.ReactNode;
};

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <Header />
      {children}
      <Footer />
    </div>
  );
}