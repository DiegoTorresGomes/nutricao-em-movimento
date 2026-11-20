import { loginAction } from "./actions";

type PageProps = {
  searchParams?: Promise<{
    erro?: string;
  }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F2EA] px-4">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#556B2F]">
          Admin
        </p>

        <h1 className="mt-4 text-3xl font-semibold">
          Acessar painel
        </h1>

        <p className="mt-3 text-sm leading-6 text-neutral-600">
          Entre com seu e-mail e senha para gerenciar o blog.
        </p>

        {params?.erro && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
            E-mail ou senha inválidos.
          </div>
        )}

        <form action={loginAction} className="mt-8 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-bold">E-mail</label>
            <input
              name="email"
              type="email"
              required
              className="h-12 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[#556B2F]"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-bold">Senha</label>
            <input
              name="password"
              type="password"
              required
              className="h-12 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[#556B2F]"
            />
          </div>

          <button
            type="submit"
            className="mt-2 cursor-pointer rounded-full bg-[#111111] px-6 py-3 text-sm font-bold !text-white transition hover:bg-[#556B2F]"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}