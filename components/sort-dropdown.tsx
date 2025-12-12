"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "featured";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    params.delete("cursor"); 

    router.push(`?${params.toString()}`);
  }

  return (
    <select
      className="border border-black/20 px-3 py-2 rounded-md"
      defaultValue={currentSort}
      onChange={handleChange}
    >
      <option value="featured">Sort: Most Popular</option> 
      <option value="price-asc">Sort: Price: lowest first</option>
      <option value="price-desc">Sort: Price: highest first</option>
      <option value="title-asc">Sort: Alphabetical: A → Z</option>
      <option value="title-desc">Sort: Alphabetical: Z → A</option>
    </select>
  );
}