import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 space-y-6 border-r border-black/10 pr-6 pt-6 md:block">
      <h2 className="text-sm uppercase tracking-[0.3em] text-black/50">
        Categories
      </h2>

      <nav className="space-y-3 text-sm">
        <Link href="/collections/antiquarian-books" className="block text-black/70 hover:text-ink">
          Antiquarian Books
        </Link>
        <Link href="/collections/antiquarian-music" className="block text-black/70 hover:text-ink">
          Antiquarian Music
        </Link>
        <Link href="/collections/autographs" className="block text-black/70 hover:text-ink">
          Autographs
        </Link>
        <Link href="/collections/art-and-prints" className="block text-black/70 hover:text-ink">
          Art and Prints
        </Link>
        <Link href="/collections/anime-figurines-merchandise" className="block text-black/70 hover:text-ink">
          Anime Figurines & Merchandise
        </Link>
         <Link href="/collections/jewelry" className="block text-black/70 hover:text-ink">
          Jewelry
        </Link>
        <Link href="/collections/furniture" className="block text-black/70 hover:text-ink">
         Furniture
        </Link>
        <Link href="/collections/others" className="block text-black/70 hover:text-ink">
          Others
        </Link>
      </nav>
    </aside>
  );
}
