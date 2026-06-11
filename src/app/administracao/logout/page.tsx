import { logoutAction } from "./actions";

export default function LogoutPage() {
  return (
    <form action={logoutAction}>
      <button type="submit">Sair</button>
    </form>
  );
}