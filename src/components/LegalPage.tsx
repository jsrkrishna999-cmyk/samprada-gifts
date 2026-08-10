import { Container } from "@/components/ui/Container";

export interface LegalSection {
  title: string;
  body: string[];
}

export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <Container className="py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-4xl font-semibold text-maroon-900">{title}</h1>
        <p className="mt-2 text-sm text-brown-700/50">Last updated: {updated}</p>

        <div className="mt-10 space-y-9">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="mb-3 font-serif text-xl text-maroon-900">{s.title}</h2>
              <div className="space-y-3 text-sm leading-relaxed text-brown-700/75">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-12 rounded-xl border border-dashed border-sandalwood-light bg-ivory px-5 py-4 text-xs text-brown-700/60">
          This is placeholder legal content for prototyping purposes — have
          it reviewed by legal counsel before publishing on a live store.
        </p>
      </div>
    </Container>
  );
}
