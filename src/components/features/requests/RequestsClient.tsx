"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { RequestCard } from "@/components/features/requests/RequestCard";
import type { UserRole, WasteCategory, WasteRequest } from "@/types/waste-request";

interface RequestsClientProps {
  initialRequests: WasteRequest[];
  categories: WasteCategory[];
  currentRole?: UserRole;
}

export function RequestsClient({
  initialRequests,
  categories,
  currentRole = "guest",
}: RequestsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return initialRequests.filter((req) => {
      const matchesCategory =
        selectedCategory === "all" || req.categoryId === selectedCategory;
      const matchesSearch =
        !query ||
        req.title.toLowerCase().includes(query) ||
        req.description?.toLowerCase().includes(query) ||
        req.address?.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [initialRequests, searchQuery, selectedCategory]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center justify-between">
          <h1 className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-[#171717] sm:text-2xl">
            Permintaan Baru Pengepul
          </h1>

          {currentRole === "buyer" && (
            <Link
              href="/requests/create"
              className="flex h-9 items-center justify-center rounded-full bg-[#171717] px-4 text-[12px] font-semibold text-white md:hidden"
            >
              + Post Baru
            </Link>
          )}
        </div>

        <div className="flex flex-1 items-center gap-3 md:max-w-2xl md:justify-end">
          <div className="relative w-full flex-1 md:max-w-md">
            <label htmlFor="request-search" className="sr-only">
              Cari permintaan sampah
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8778]"
            />
            <input
              id="request-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ampas kopi, kardus..."
              className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-[13px] text-[#171717] transition-all placeholder:text-[#A8A594] hover:border-black/20 focus:border-[#171717] focus:ring-1 focus:ring-[#171717] focus-visible:outline-none"
            />
          </div>

          {currentRole === "buyer" && (
            <Link
              href="/requests/create"
              className="hidden shrink-0 items-center gap-2 rounded-full bg-[#171717] py-2.5 pl-4 pr-1.5 text-white transition-all hover:bg-[#2B2B26] md:flex"
            >
              <span className="text-[13px] font-semibold tracking-wide">
                Post Permintaan
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7A8F5C]">
                <Plus className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          )}
        </div>
      </header>

      <div className="-mx-4 border-b border-black/5 px-4 pb-3 sm:mx-0 sm:px-0">
        <div
          role="group"
          aria-label="Filter kategori"
          className="scrollbar-hide flex items-center gap-2 overflow-x-auto"
        >
          <CategoryPill
            label="Semua"
            active={selectedCategory === "all"}
            onClick={() => setSelectedCategory("all")}
          />
          {categories.map((cat) => (
            <CategoryPill
              key={cat.id}
              label={cat.name}
              active={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(cat.id)}
            />
          ))}
        </div>
      </div>

      <div>
        {filteredRequests.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
            {filteredRequests.map((req) => (
              <RequestCard key={req.id} request={req} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

interface CategoryPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function CategoryPill({ label, active, onClick }: CategoryPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2.5 text-[12.5px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]",
        active
          ? "border-[#171717] bg-[#171717] text-white"
          : "border-black/5 bg-white text-[#3F3D38] hover:border-black/15"
      )}
    >
      {label}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[28px] border border-black/5 bg-white px-8 py-16 text-center">
      <p className="font-[family-name:var(--font-display)] text-[17px] font-bold text-[#171717]">
        Belum ada permintaan yang cocok
      </p>
      <p className="mx-auto mt-1.5 max-w-sm text-[13px] text-[#78766B]">
        Coba ubah kata kunci pencarian atau pilih kategori lain.
      </p>
    </div>
  );
}