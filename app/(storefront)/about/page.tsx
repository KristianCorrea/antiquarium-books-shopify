import Link from 'next/link';


export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-20">

      {/* HEADER */}
      <section className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-black/50">About</p>
        <h1 className="font-display text-5xl text-ink">Antiquarium & Co.</h1>
        <p className="mx-auto max-w-2xl text-lg text-black/70">
          A modern sanctuary for collectors of rare books, maps, prints, and
          antiquities — meticulously curated with academic rigor and presented
          with contemporary elegance.
        </p>
      </section>

      {/* OUR PURPOSE */}
      <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <h2 className="font-display text-3xl text-ink">Our Purpose</h2>
          <p className="text-black/70 leading-relaxed">
            Antiquarium exists to bridge the worlds of scholarship and design.
            We steward culturally significant works — from Renaissance folios to
            19th-century cartography — ensuring each piece remains preserved,
            documented, and accessible to the next generation of collectors.
          </p>
          <p className="text-black/70 leading-relaxed">
            Every acquisition is authenticated, conserved by specialists, and
            accompanied by provenance notes crafted to museum standards. Our
            mission is simple: elevate the collecting experience with
            transparency, beauty, and historical depth.
          </p>
        </div>

        <div className="rounded-3xl bg-white/70 p-8 shadow-lg space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-black/40">
            Collector’s Ethos
          </p>
          <p className="font-display text-2xl text-ink">
            “We believe that each artifact is a story — and every collection is
            an autobiography.”
          </p>
          <p className="text-sm text-black/70">
            Our curatorial team evaluates historical context, rarity, condition,
            and artistic merit before an item enters our catalog.
          </p>
        </div>
      </section>

      {/* PROVENANCE & CONSERVATION */}
      <section className="space-y-6">
        <h2 className="font-display text-3xl text-ink">Provenance & Conservation</h2>
        <p className="max-w-3xl text-black/70 leading-relaxed">
          We collaborate with archivists, conservators, and academic partners to
          ensure every piece is represented with accuracy and integrity. From
          custom restorations to archival-grade enclosures, we honor the
          material history of each object while preparing it for long-term
          preservation.
        </p>
        <p className="max-w-3xl text-black/70 leading-relaxed">
          Our documentation includes condition reports, historical notes, and
          verified provenance — essential for collectors, institutions, and
          appraisers alike.
        </p>
      </section>

      {/* THE TEAM */}
      <section className="space-y-6">
        <h2 className="font-display text-3xl text-ink">The Team</h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "Isabella Moreau",
              role: "Lead Curator",
              bio: "Specialist in antiquarian books and early French printing.",
            },
            {
              name: "James Hartwell",
              role: "Conservation Director",
              bio: "Oversees restoration and preservation services for rare folios and maps.",
            },
            {
              name: "Elena Strauss",
              role: "Provenance Researcher",
              bio: "Collaborates with institutions to trace historical ownership records.",
            },
          ].map((member) => (
            <div
              key={member.name}
              className="rounded-3xl bg-white/60 p-6 shadow-md"
            >
              <p className="font-display text-xl text-ink">{member.name}</p>
              <p className="text-sm uppercase tracking-[0.3em] text-black/50 mt-1">
                {member.role}
              </p>
              <p className="mt-3 text-black/70 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-6">
        <h2 className="font-display text-3xl text-ink">Visit the Collection</h2>
        <p className="mx-auto max-w-xl text-black/70 text-lg">
          Explore folios, prints, maps, and antiquities sourced from private
          estates, academic libraries, and historic dealers worldwide.
        </p>
        <Link
          href="/collections"
          className="button-glow inline-flex items-center rounded-full bg-ink px-8 py-3 
          text-sm font-semibold uppercase tracking-[0.3em] text-white"
        >
          Browse Collections
        </Link>
      </section>

    </div>
  );
}
