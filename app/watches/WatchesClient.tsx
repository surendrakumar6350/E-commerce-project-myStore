"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getProducts } from "@/data/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

/* ================= FILTER CONFIG ================= */

const WATCH_FILTERS: Record<string, string> = {
    All: "all",
    Luxury: "luxury",
    "Smart Watches": "smart",
    Analog: "analog",
    Digital: "digital",
    Sports: "sports",
};

export default function WatchesClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [activeType, setActiveType] = useState(
        searchParams.get("type") || "All"
    );
    const [priceRange, setPriceRange] = useState(
        Number(searchParams.get("price")) || 20000
    );
    const [sort, setSort] = useState(
        searchParams.get("sort") || "none"
    );

    const [allProducts, setAllProducts] = useState<Product[]>([]);

    useEffect(() => {
        let mounted = true;
        void getProducts().then((data) => {
            if (mounted) setAllProducts(data ?? []);
        });
        return () => { mounted = false; };
    }, []);

    /* ================= FILTERED PRODUCTS (FAST) ================= */

    const filteredProducts = useMemo(() => {
        let data = allProducts.filter((p) => p.category === "watches");

        if (activeType !== "All") {
            const typeValue = WATCH_FILTERS[activeType];
            data = data.filter((p) => p.watchType === typeValue);
        }

        data = data.filter((p) => p.price <= priceRange);

        if (sort === "low") {
            data = [...data].sort((a, b) => a.price - b.price);
        }
        if (sort === "high") {
            data = [...data].sort((a, b) => b.price - a.price);
        }

        return data;
    }, [activeType, priceRange, sort, allProducts]);

    /* ================= URL SYNC (NO DELAY) ================= */

    useEffect(() => {
        const params = new URLSearchParams();

        if (activeType !== "All") params.set("type", activeType);
        if (priceRange !== 20000) params.set("price", String(priceRange));
        if (sort !== "none") params.set("sort", sort);

        router.replace(`?${params.toString()}`, { scroll: false });
    }, [activeType, priceRange, sort, router]);

    return (
        <main className="relative bg-[#f6f7f9] text-gray-900">

            {/* ================= HERO ================= */}
            <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#f9fafb] via-[#eef1f5] to-[#e5e7eb]">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                        Watch Collection
                    </h1>
                    <p className="mt-4 text-gray-600">
                        Precision • Luxury • Smart Technology
                    </p>

                    <div className="mt-10 flex justify-center gap-4">
                        <Link
                            href="/cart"
                            className="px-10 py-4 rounded-full bg-black text-white"
                        >
                            View Cart
                        </Link>
                        <Link
                            href="/"
                            className="px-10 py-4 rounded-full border border-gray-400"
                        >
                            Home
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================= FILTER BAR ================= */}
            <section className="relative z-10 bg-white/70 backdrop-blur border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">

                    <div className="flex flex-wrap gap-3">
                        {Object.keys(WATCH_FILTERS).map(label => (
                            <FilterBadge
                                key={label}
                                label={label}
                                active={activeType === label}
                                onClick={() => setActiveType(label)}
                            />
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">
                                Max ₹{priceRange}
                            </span>
                            <input
                                type="range"
                                min={1000}
                                max={20000}
                                step={500}
                                value={priceRange}
                                onChange={e => setPriceRange(+e.target.value)}
                                className="w-[160px] sm:w-[200px]"
                            />
                        </div>

                        <select
                            value={sort}
                            onChange={e => setSort(e.target.value)}
                            className="px-4 py-2 rounded-lg bg-gray-100 border border-gray-300"
                        >
                            <option value="none">Sort</option>
                            <option value="low">Price: Low → High</option>
                            <option value="high">Price: High → Low</option>
                        </select>

                        <span className="text-sm text-gray-600">
                            {filteredProducts.length} Products
                        </span>
                    </div>
                </div>
            </section>

            {/* ================= PRODUCTS GRID ================= */}
            <section className="py-20 px-6 bg-[#f3f4f6]">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredProducts.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <p className="text-center text-gray-500 mt-16">
                        No watches found
                    </p>
                )}
            </section>

            {/* ================= CTA ================= */}
            <section className="pb-24 text-center bg-[#f6f7f9]">
                <Link
                    href="/cart"
                    className="inline-block px-14 py-6 rounded-full bg-gradient-to-r from-cyan-600 to-indigo-600 text-white text-xl font-semibold"
                >
                    Order Now ⌚
                </Link>
            </section>
        </main>
    );
}

/* ================= FILTER BADGE ================= */

function FilterBadge({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`px-5 py-2 rounded-full text-sm font-medium transition
            ${active
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
            `}
        >
            {label}
        </button>
    );
}
