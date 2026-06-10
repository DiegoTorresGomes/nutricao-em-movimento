import Link from "next/link";

type ButtonVariant = "dark" | "light" | "outline" | "olive";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  external?: boolean;
  className?: string;
};

const variants: Record<ButtonVariant, string> = {
  dark:
    "bg-[#111111] text-white hover:bg-[#556B2F]",
  light:
    "bg-white text-[#111111] hover:bg-[#E9DCC9]",
  outline:
    "border border-current bg-transparent text-current hover:border-[#E9DCC9] hover:text-[#E9DCC9]",
  olive:
    "bg-[#556B2F] text-white hover:bg-[#465a28]",
};

export function ButtonLink({
  href,
  children,
  variant = "dark",
  external = false,
  className = "",
}: ButtonLinkProps) {
  const classes = `inline-flex min-h-12 items-center justify-center rounded-full px-7 py-3 text-sm font-bold no-underline transition ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}