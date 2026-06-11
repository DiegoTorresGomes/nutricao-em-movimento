import { logoutAction } from "@/app/administracao/logout/actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="w-full cursor-pointer rounded-2xl px-4 py-3 text-left text-sm font-bold text-white/70 transition hover:bg-red-500/10 hover:text-red-300"
      >
        Sair
      </button>
    </form>
  );
}