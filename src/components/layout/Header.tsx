import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { siteConfig } from "@/config/site";

const menuItems = [
  { label: "Início", href: "/pt" },
  { label: "Artigos", href: "/pt/artigos" },
  { label: "Sobre", href: "/pt/sobre" },
  { label: "Contato", href: "/pt/contato" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20">
        <Link href="/pt" className="shrink-0">
          <div className="text-xs font-black uppercase tracking-[0.24em] text-[#111111] sm:text-sm">
            Nutrição
          </div>
          <div className="-mt-1 text-xs font-black uppercase tracking-[0.24em] text-[#556B2F] sm:text-sm">
            em Movimento
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-bold text-neutral-700 transition hover:text-[#556B2F]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Buscar artigos"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-[#111111] transition hover:border-[#556B2F] hover:text-[#556B2F]"
          >
            <Search size={18} />
          </button>

          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-black/10 text-[#111111] transition hover:border-[#D67A5A] hover:text-[#D67A5A] sm:flex"
          >
            <FaInstagram size={18} />
          </a>

          <a
            href="/pt#newsletter"
            className="hidden rounded-full bg-[#111111] px-5 py-2.5 text-sm font-bold !text-white transition hover:bg-[#556B2F] lg:inline-flex"
          >
            Newsletter
          </a>

          <button
            type="button"
            aria-label="Abrir menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-[#111111] md:hidden"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
