"use client";

import { useState, useMemo, useEffect } from "react";
import { getProducts } from "@/data/products";
import type { Product } from "@/types/product";

import ProductCard from "@/components/ProductCard";
import Link from "next/link";

/* ================= FILTER LOGIC ================= */

const MEN_FILTERS: Record<string, string[]> = {
    All: [],
    "T-Shirts": ["tshirts"],
    Shirts: ["shirts"],
    Jeans: ["jeans"],
    Watches: ["watches"],
    Shoes: ["shoes"],
};

export default function MenPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    useEffect(() => {
        let mounted = true;
        void getProducts().then((data) => {
            if (mounted) setAllProducts(data ?? []);
        });
        return () => { mounted = false; };
    }, []);

    /* ================= FILTERED PRODUCTS (OPTIMIZED) ================= */

    const menProducts = useMemo(() => {
        return allProducts.filter((p) => {
            if (p.category !== "men") return false;
            if (activeFilter === "All") return true;

            return MEN_FILTERS[activeFilter]?.includes(p.subCategory);
        });
    }, [activeFilter, allProducts]);

    return (
        <main className="bg-gray-50 text-gray-900">

            {/* ================= HERO ================= */}
            <section className="relative min-h-[70vh] sm:min-h-[90vh] flex items-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center scale-105"
                    style={{ backgroundImage: "url('/manHome.jpg')" }}
                />
                <div className="absolute inset-0 bg-black/55" />

                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 ml-auto text-right">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white">
                        Men Collection
                    </h1>

                    <p className="mt-3 sm:mt-6 text-sm sm:text-base text-gray-200 max-w-xl ml-auto">
                        Bold fashion • Premium essentials • Built for everyday confidence
                    </p>

                    <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-6 justify-end">
                        <Link
                            href="/cart"
                            className="px-6 sm:px-10 py-3 sm:py-4 rounded-full bg-white text-black font-semibold text-sm sm:text-base hover:scale-105 transition"
                        >
                            View Cart
                        </Link>

                        <Link
                            href="/"
                            className="px-6 sm:px-10 py-3 sm:py-4 rounded-full border border-white text-white hover:bg-white hover:text-black transition text-sm sm:text-base"
                        >
                            Explore More
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================= FILTER BAR ================= */}
            <section className="relative z-10 bg-white/90 backdrop-blur border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
                    {Object.keys(MEN_FILTERS).map(label => (
                        <FilterBadge
                            key={label}
                            label={label}
                            active={activeFilter === label}
                            onClick={() => setActiveFilter(label)}
                        />
                    ))}
                </div>
            </section>

            {/* ================= PRODUCTS GRID ================= */}
            <section className="py-12 sm:py-24 px-3 sm:px-6">
                <div className="max-w-7xl mx-auto">

                    <h2 className="text-xl sm:text-3xl font-bold mb-6 sm:mb-10">
                        {activeFilter === "All" ? "All Men's Products" : activeFilter}
                    </h2>

                    {menProducts.length === 0 ? (
                        <p className="text-center text-gray-500">
                            No products found in this category
                        </p>
                    ) : (
                        <div
                            className="
                                grid
                                grid-cols-2
                                sm:grid-cols-2
                                md:grid-cols-3
                                lg:grid-cols-4
                                gap-4
                                sm:gap-8
                                lg:gap-12
                            "
                        >
                            {menProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ================= CTA ================= */}
            <section className="pb-14 sm:pb-24 text-center px-4">
                <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-5 sm:mb-6">
                    Ready to Upgrade Your Style?
                </h2>

                <Link
                    href="/cart"
                    className="
                        inline-block
                        px-8 sm:px-12 py-3 sm:py-5
                        rounded-full
                        bg-gradient-to-r from-blue-600 to-indigo-600
                        text-white font-semibold
                        shadow-xl hover:scale-105 transition
                        text-sm sm:text-base
                    "
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
            className={`
                px-4 sm:px-5 py-1.5 sm:py-2
                rounded-full text-xs sm:text-sm
                font-medium whitespace-nowrap transition
                ${active
                    ? "bg-black text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"}
            `}
        >
            {label}
        </button>
    );
}
