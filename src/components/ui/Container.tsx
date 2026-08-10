import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12", className)}>
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-10 max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
          {eyebrow}
        </p>
      )}
      <h2 className="text-balance text-3xl font-semibold text-maroon-900 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-brown-700/70">{description}</p>
      )}
    </div>
  );
}
