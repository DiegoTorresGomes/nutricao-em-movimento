import Link from "next/link";

type ButtonVariant = "dark" | "light" | "outline" | "olive";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  external?: boolean;
  className?: string;
};

const baseClasses =
  "inline-flex min-h-12 items-center justify-center rounded-full px-7 py-3 text-sm font-bold no-underline transition";

const variants: Record<ButtonVariant, string> = {
  dark: "bg-[#111111] !text-white hover:bg-[#556B2F]",
  light: "bg-white !text-[#111111] hover:bg-[#E9DCC9]",
  outline:
    "border border-current bg-transparent text-current hover:border-[#556B2F] hover:text-[#556B2F]",
  olive: "bg-[#556B2F] !text-white hover:bg-[#465a28]",
};

export function Button({
  href,
  children,
  variant = "dark",
  external = false,
  className = "",
}: ButtonProps) {
  const classes = `${baseClasses} ${variants[variant]} ${className}`;

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