import Image from "next/image";
import { categoryHero } from "@/lib/data/images";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-140px)] lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image src={categoryHero("varalakshmi-vratham")} alt="A decorated kalash with coconut and mango leaves for a traditional pooja" fill sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brown-700/85 via-brown-700/20 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-ivory">
          <p className="font-serif text-2xl leading-snug">
            &ldquo;Every gift carries a little warmth of home.&rdquo;
          </p>
          <p className="mt-2 text-sm text-ivory/70">— Samprada Gifts</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-3xl font-semibold text-maroon-900">{title}</h1>
          <p className="mt-2 text-sm text-brown-700/60">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
