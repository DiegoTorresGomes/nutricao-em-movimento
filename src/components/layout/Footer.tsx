import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-[#111111] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#E9DCC9]">
            Nutrição em Movimento
          </p>

          <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
            {siteConfig.slogan} Um espaço para construir constância, clareza e uma
            relação mais leve com a alimentação.
          </p>

          <p className="mt-6 max-w-xl text-xs leading-6 text-white/50">
            {siteConfig.disclaimer}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">
            Navegação
          </h3>

          <div className="mt-5 flex flex-col gap-3 text-sm text-white/65">
            <Link href="/pt" className="transition hover:text-[#E9DCC9]">
              Início
            </Link>
            <Link href="/pt/artigos" className="transition hover:text-[#E9DCC9]">
              Artigos
            </Link>
            <Link href="/pt/sobre" className="transition hover:text-[#E9DCC9]">
              Sobre
            </Link>
            <Link href="/pt/contato" className="transition hover:text-[#E9DCC9]">
              Contato
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">
            Institucional
          </h3>

          <div className="mt-5 flex flex-col gap-3 text-sm text-white/65">
            <Link
              href="/pt/politica-de-privacidade"
              className="transition hover:text-[#E9DCC9]"
            >
              Política de Privacidade
            </Link>
            <Link href="/pt/termos-de-uso" className="transition hover:text-[#E9DCC9]">
              Termos de Uso
            </Link>
            <Link href="/pt/disclaimer" className="transition hover:text-[#E9DCC9]">
              Disclaimer Nutricional
            </Link>

            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 transition hover:text-[#E9DCC9]"
            >
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Nutrição em Movimento. Todos os direitos reservados.
      </div>
    </footer>
  );
}
