"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

type MobileMenuProps = {
  items: { label: string; href: string }[];
};

// Isolated client component for the mobile navigation. It only owns the
// hamburger button and the drawer, so the rest of the Header stays a Server
// Component with its original markup, styles and accessibility untouched.
export function MobileMenu({ items }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-[#111111] md:hidden"
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {isOpen && (
        <div className="md:hidden">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Fechar menu"
            tabIndex={-1}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 top-16 z-40 bg-black/30 backdrop-blur-sm lg:top-20"
          />

          {/* Panel */}
          <nav
            id="mobile-menu"
            className="fixed inset-x-0 top-16 z-50 border-b border-black/5 bg-white shadow-lg lg:top-20"
          >
            <div className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-2xl px-4 py-3 text-base font-bold text-neutral-800 transition hover:bg-[#FAF8F4] hover:text-[#556B2F]"
                >
                  {item.label}
                </Link>
              ))}

              <a
                href="/pt#newsletter"
                onClick={() => setIsOpen(false)}
                className="mt-2 rounded-full bg-[#111111] px-5 py-3 text-center text-sm font-bold !text-white transition hover:bg-[#556B2F]"
              >
                Newsletter
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
