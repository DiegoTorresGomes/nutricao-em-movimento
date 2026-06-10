"use client";

type DeletePostButtonProps = {
  postId: string;
};

export function DeletePostButton({ postId }: DeletePostButtonProps) {
  return (
    <form action={`/api/admin/posts/${postId}/delete`} method="post">
      <button
        type="submit"
        onClick={(event) => {
          if (!confirm("Deseja realmente excluir este artigo?")) {
            event.preventDefault();
          }
        }}
        className="cursor-pointer text-sm font-bold text-red-600"
      >
        Excluir
      </button>
    </form>
  );
}