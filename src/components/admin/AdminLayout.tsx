import Link from "next/link";
import { redirect } from "next/navigation";
import { destroySession, getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/admin/LogoutButton";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const menuItems = [
  { label: "Dashboard", href: "/administracao" },
  { label: "Home", href: "/administracao/home" },
  { label: "Artigos", href: "/administracao/artigos" },
  { label: "Novo artigo", href: "/administracao/artigos/novo" },
  { label: "Categorias", href: "/administracao/categorias" },
  { label: "Nutricionista", href: "/administracao/nutricionista" },
  { label: "Segurança", href: "/administracao/seguranca" },
  { label: "Newsletter", href: "/administracao/newsletter" },

];

export async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }
  return (
    <div className="min-h-screen bg-[#F6F2EA] text-[#111111]">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-black/5 bg-[#111111] p-6 text-white lg:block">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#E9DCC9]">
            Admin
          </p>
          <h1 className="mt-3 text-2xl font-semibold">Nutrição em Movimento</h1>
        </div>

        <nav className="mt-10 flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl px-4 py-3 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-6 left-6 right-6">
          <LogoutButton />
        </div>
      </aside>

      <main className="lg:pl-72">
        <header className="border-b border-black/5 bg-white px-6 py-5">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#556B2F]">
                Painel administrativo
              </p>
              <h2 className="mt-1 text-2xl font-semibold">Gestão do blog</h2>
            </div>

            <Link
              href="/pt"
              className="rounded-full bg-[#111111] px-5 py-3 text-sm font-bold !text-white transition hover:bg-[#556B2F]"
            >
              Ver site
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}