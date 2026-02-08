"use client";

import { useState, useMemo, useEffect } from "react";
import { getProducts } from "@/data/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

type KidsFilter =
    | "all"
    | "boys"
    | "girls"
    | "winter"
    | "party";

export default function KidsPage() {
    const [filter, setFilter] = useState<KidsFilter>("all");

    const [allProducts, setAllProducts] = useState<Product[]>([]);

    useEffect(() => {
        let mounted = true;
        void getProducts().then((data) => {
            if (mounted) setAllProducts(data ?? []);
        });
        return () => { mounted = false; };
    }, []);

    /* ================= BASE KIDS PRODUCTS ================= */
    const kidsProducts = useMemo(() => {
        return allProducts.filter((p) => p.category === "kids");
    }, [allProducts]);

    /* ================= CORRECT + STRICT SEPARATION =================
       RULE (FINAL, NO CONFUSION):
       - Boys section:
            - filter = all / boys  → tshirts + boys
            - filter = winter      → ONLY winter
       - Girls section:
            - filter = all / girls → ONLY girls
            - filter = party       → ONLY party
    ================================================================= */

    const boysProducts = kidsProducts.filter(p => {
        if (filter === "winter") return p.subCategory === "winter";
        if (filter === "boys") return p.subCategory === "tshirts" || p.subCategory === "boys";
        if (filter === "all") return p.subCategory === "tshirts" || p.subCategory === "boys";
        return false;
    });

    const girlsProducts = kidsProducts.filter(p => {
        if (filter === "party") return p.subCategory === "party";
        if (filter === "girls") return p.subCategory === "girls";
        if (filter === "all") return p.subCategory === "girls";
        return false;
    });

    return (
        <main className="bg-gradient-to-b from-sky-50 via-white to-pink-50 text-gray-900">

            {/* ================= HERO ================= */}
            <section className="relative min-h-[75vh] flex items-center">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/kidsHome.jpg')" }}
                />
                <div className="absolute inset-0 bg-white/40" />

                <div className="relative z-10 max-w-6xl mx-auto px-6 ml-auto text-right">
                    <h1 className="text-4xl md:text-6xl font-extrabold">
                        Kids Collection
                    </h1>
                    <p className="mt-4 text-lg text-gray-700">
                        Boys & Girls clearly separated 👦👧
                    </p>
                </div>
            </section>

            {/* ================= FILTER BAR ================= */}
            <section className="bg-white/90 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex gap-3 overflow-x-auto">
                    <FilterBadge label="All" active={filter === "all"} onClick={() => setFilter("all")} />
                    <FilterBadge label="Boys" active={filter === "boys"} onClick={() => setFilter("boys")} />
                    <FilterBadge label="Girls" active={filter === "girls"} onClick={() => setFilter("girls")} />
                    <FilterBadge label="Winter" active={filter === "winter"} onClick={() => setFilter("winter")} />
                    <FilterBadge label="Party" active={filter === "party"} onClick={() => setFilter("party")} />
                </div>
            </section>

            {/* ================= BOYS SECTION ================= */}
            {boysProducts.length > 0 && (
                <section className="py-16 px-6">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold mb-8">
                            👦 Boys Items
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {boysProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ================= GIRLS SECTION ================= */}
            {girlsProducts.length > 0 && (
                <section className="py-16 px-6 bg-pink-50">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold mb-8">
                            👧 Girls Items
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {girlsProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ================= CTA ================= */}
            <section className="py-20 text-center">
                <h2 className="text-3xl font-bold mb-4">
                    Perfect Styles for Little Ones ✨
                </h2>
                <p className="text-gray-600 mb-8">
                    Order easily via WhatsApp
                </p>
                <Link
                    href="/cart"
                    className="px-12 py-5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold"
                >
                    Order Now 💬
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
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
        >
            {label}
        </button>
    );
}
