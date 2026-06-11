import { verifyTwoFactorAction } from "./actions";

type PageProps = {
  searchParams?: Promise<{
    erro?: string;
  }>;
};

export default async function TwoFactorLoginPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F2EA] px-4">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#556B2F]">
          Segurança
        </p>

        <h1 className="mt-4 text-3xl font-semibold">
          Código de verificação
        </h1>

        <p className="mt-3 text-sm leading-6 text-neutral-600">
          Abra o Google Authenticator e digite o código de 6 dígitos.
        </p>

        {params?.erro && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
            Código inválido. Tente novamente.
          </div>
        )}

        <form action={verifyTwoFactorAction} className="mt-8 grid gap-4">
          <input
            name="token"
            required
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            className="h-14 rounded-2xl border border-black/10 px-4 text-center text-2xl font-bold tracking-[0.4em] outline-none focus:border-[#556B2F]"
          />

          <button
            type="submit"
            className="cursor-pointer rounded-full bg-[#111111] px-6 py-3 text-sm font-bold !text-white transition hover:bg-[#556B2F]"
          >
            Verificar código
          </button>
        </form>
      </div>
    </main>
  );
}