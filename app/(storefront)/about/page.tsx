import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      {/* HEADER */}
      <section className="mb-28 text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.45em] text-black/50">
          About
        </p>

        <h1 className="mb-8 font-display text-5xl text-ink sm:text-6xl">
          Antiquarium & Co.
        </h1>

        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-black/70">
          The Antiquarian Book Company has been a buyer and seller of rare books,
          antique furniture, prints, fine art, and more for over 40 years. We have
          attended antiquarian book fairs and antique shows across the world,
          including New York, London, and San Francisco.
        </p>

        <div className="mx-auto mt-12 h-px w-24 bg-black/20" />
      </section>

      {/* OUR COLLECTION */}
      <section className="mx-auto max-w-3xl text-center">
        <h2 className="mb-8 font-display text-3xl text-ink">
          Our Collection
        </h2>

        <div className="space-y-6">
          <p className="leading-relaxed text-black/70">
            Antiquarium offers a carefully curated selection of unique and
            collectible items spanning multiple eras and interests. Our
            inventory includes antiquarian and rare books, fine art, vintage
            and antique prints, antiquarian music, historical autographs, as
            well as anime, gaming, and other modern collectibles.
          </p>

          <p className="leading-relaxed text-black/70">
            Each item is thoughtfully sourced, accurately described, and
            presented with careful attention to condition and authenticity. We
            invite you to explore our additional listings through our AbeBooks
            storefront and our Lunacane Collectibles eBay store.
          </p>

          <p className="leading-relaxed text-black/70">
            For questions or inquiries, feel free to contact us at{" "}
            <a
              href="mailto:info@antiquarianbookco.com"
              className="font-medium underline underline-offset-4 transition hover:text-ink"
            >
              info@antiquarianbookco.com
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
