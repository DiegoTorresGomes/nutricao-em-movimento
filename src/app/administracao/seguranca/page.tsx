import { AdminLayout } from "@/components/admin/AdminLayout";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  generateQRCodeDataUrl,
  generateTwoFactorSecret,
} from "@/lib/two-factor";
import {
  disableTwoFactorAction,
  enableTwoFactorAction,
} from "./actions";

type PageProps = {
  searchParams?: Promise<{
    erro?: string;
    sucesso?: string;
  }>;
};

export default async function AdminSecurityPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const session = await getSession();

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: session.userId,
    },
  });

  const setup = generateTwoFactorSecret(user.email);
  const qrCodeDataUrl = await generateQRCodeDataUrl(setup.otpauthUrl);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Segurança</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Configure a autenticação em duas etapas com Google Authenticator.
        </p>
      </div>

      {params?.erro === "token" && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
          Código inválido. Verifique o Google Authenticator e tente novamente.
        </div>
      )}

      {params?.sucesso === "ativado" && (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700">
          Autenticação em duas etapas ativada com sucesso.
        </div>
      )}

      {params?.sucesso === "desativado" && (
        <div className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm font-bold text-yellow-700">
          Autenticação em duas etapas desativada.
        </div>
      )}

      <section className="rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-xl font-semibold">
              Google Authenticator
            </h2>

            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Ao ativar essa proteção, além do e-mail e senha, será necessário
              informar um código de 6 dígitos gerado no celular.
            </p>

            <div className="mt-6 rounded-2xl bg-[#FAF8F4] p-4 text-sm">
              Status:{" "}
              <strong className={user.twoFactorEnabled ? "text-green-700" : "text-red-700"}>
                {user.twoFactorEnabled ? "Ativado" : "Desativado"}
              </strong>
            </div>
          </div>

          {user.twoFactorEnabled ? (
            <form action={disableTwoFactorAction}>
              <button
                type="submit"
                className="cursor-pointer rounded-full bg-red-600 px-6 py-3 text-sm font-bold !text-white transition hover:bg-red-700"
              >
                Desativar 2FA
              </button>
            </form>
          ) : (
            <div className="w-full max-w-sm rounded-[2rem] border border-black/10 p-5">
              <p className="text-sm font-bold">
                1. Escaneie o QR Code
              </p>

              <div className="mt-4 overflow-hidden rounded-2xl border border-black/10 bg-white p-4">
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code do Google Authenticator"
                  className="h-auto w-full"
                />
              </div>

              <p className="mt-5 text-sm font-bold">
                2. Digite o código de 6 dígitos
              </p>

              <form action={enableTwoFactorAction} className="mt-4 grid gap-4">
                <input type="hidden" name="secret" value={setup.secret} />

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
                  Ativar 2FA
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </AdminLayout>
  );
}