type SectionLabelProps = {
  children: React.ReactNode;
  dark?: boolean;
};

export function SectionLabel({ children, dark = false }: SectionLabelProps) {
  return (
    <p
      className={`text-xs font-bold uppercase tracking-[0.3em] sm:text-sm ${
        dark ? "text-[#E9DCC9]" : "text-[#556B2F]"
      }`}
    >
      {children}
    </p>
  );
}