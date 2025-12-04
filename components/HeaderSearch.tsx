"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface ProductResult {
  id: string;
  title: string;
  handle: string;
  imageUrl: string;
}

export default function HeaderSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [results, setResults] = useState<ProductResult[]>([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce timer
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Fetch search results with debounce
  useEffect(() => {
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const controller = new AbortController();

      fetch(`/api/search?q=${encodeURIComponent(value)}`, { signal: controller.signal })
        .then(res => res.json())
        .then(data => {
          setResults(data.products || []);
          setOpen(true);
        })
        .catch(() => {});

      return () => controller.abort();
    }, 300); // 300ms debounce
  }, [value]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    router.push(`/search?q=${encodeURIComponent(value)}`);
    setOpen(false);
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xs">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search books..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-full border border-black/20 bg-white px-4 py-2 text-sm text-black/80 shadow-sm placeholder:text-black/40 focus:border-black focus:outline-none"
        />
      </form>

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-80 overflow-auto rounded-xl border border-black/10 bg-white shadow-lg">
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => router.push(`/products/${p.handle}`)}
              className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-black/5"
            >
              <img
                src={p.imageUrl}
                alt={p.title}
                className="h-10 w-10 rounded object-cover"
              />
              <span className="text-sm text-black/80">{p.title}</span>
            </button>
          ))}
        </div>
      )}

      {open && results.length === 0 && value.length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-xl border border-black/10 bg-white p-3 text-sm text-black/50 shadow-lg">
          No results found
        </div>
      )}
    </div>
  );
}
