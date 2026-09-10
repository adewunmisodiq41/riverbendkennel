import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-pine text-paper hover:bg-ink transition-colors duration-200",
  secondary:
    "bg-transparent text-ink border border-ink/30 hover:border-brass hover:text-brass transition-colors duration-200",
  ghost:
    "bg-transparent text-brass hover:text-brasslight transition-colors duration-200 underline underline-offset-4"
};

export default function Button({
  href,
  children,
  variant = "primary",
  type,
  onClick
}: {
  href?: string;
  children: React.ReactNode;
  variant?: Variant;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  const classes = `inline-flex items-center justify-center px-6 py-3 text-sm font-medium tracking-wide ${variantClasses[variant]}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
