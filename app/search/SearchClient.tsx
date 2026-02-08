"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { getProducts } from "@/data/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import { useEffect, useMemo, useState } from "react";

const CATEGORIES = ["all", "men", "women", "shoes", "watches"];

export default function SearchClient() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialQuery = searchParams.get("q") || "";

    const [query, setQuery] = useState(initialQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
    const [category, setCategory] = useState("all");

    /* ================= DEBOUNCE ================= */
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

        return () => clearTimeout(t);
    }, [query]);

    /* ================= URL → STATE SYNC ================= */
    useEffect(() => {
        setQuery(initialQuery);
        setDebouncedQuery(initialQuery);
    }, [initialQuery]);

    const [allProducts, setAllProducts] = useState<Product[]>([]);

    useEffect(() => {
        let mounted = true;
        void getProducts().then((data) => {
            if (mounted) setAllProducts(data ?? []);
        });
        return () => { mounted = false; };
    }, []);

    /* ================= FILTER PRODUCTS ================= */
    const results = useMemo(() => {
        const q = debouncedQuery.trim().toLowerCase();

        if (!q && category === "all") return [];

        return allProducts.filter((p) => {
            const matchName = q
                ? p.name.toLowerCase().includes(q)
                : true;

            const matchCategory =
                category === "all" || p.category === category;

            return matchName && matchCategory;
        });
    }, [debouncedQuery, category, allProducts]);

    return (
        <main className="min-h-screen bg-[#f6f7f9] text-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-10">

                {/* ================= TITLE ================= */}
                <h1 className="text-2xl font-bold mb-6">
                    {debouncedQuery
                        ? `Results for “${debouncedQuery}”`
                        : "Search Products"}
                </h1>

                {/* ================= SEARCH INPUT ================= */}
                <div className="mb-8 max-w-xl">
                    <input
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            router.replace(
                                `/search?q=${encodeURIComponent(e.target.value)}`
                            );
                        }}
                        placeholder="Search products, brands, categories…"
                        className="
              w-full
              rounded-lg
              px-4 py-3
              border border-gray-300
              bg-white
              text-sm
              outline-none
              focus:border-black
            "
                    />
                </div>

                {/* ================= CATEGORY FILTER ================= */}
                {debouncedQuery && (
                    <div className="flex gap-3 mb-8 flex-wrap">
                        {CATEGORIES.map((c) => (
                            <button
                                key={c}
                                onClick={() => setCategory(c)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition
                  ${category === c
                                        ? "bg-black text-white"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                                {c.toUpperCase()}
                            </button>
                        ))}
                    </div>
                )}

                {/* ================= RESULTS ================= */}
                {debouncedQuery && (
                    <>
                        {results.length === 0 ? (
                            <p className="text-gray-500 mt-10">
                                No products found.
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {results.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {!debouncedQuery && (
                    <p className="text-gray-500 mt-10">
                        Start typing to search for products.
                    </p>
                )}
            </div>
        </main>
    );
}
