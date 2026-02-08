"use client";

import { getProducts } from "@/data/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

/* ================= FILTER MAP ================= */

const WOMEN_FILTERS: Record<string, (p: any) => boolean> = {
    All: (p) =>
        p.category === "women",

    Kurti: (p) =>
        p.category === "women" &&
        p.subCategory?.toLowerCase() === "kurti",

    Dress: (p) =>
        p.category === "women" &&
        p.subCategory?.toLowerCase() === "dress",

    Top: (p) =>
        p.category === "women" &&
        p.subCategory?.toLowerCase() === "tops",

    Ethnic: (p) =>
        p.category === "women" &&
        p.subCategory?.toLowerCase() === "ethnic",

    Footwear: (p) =>
        p.category === "women" &&
        p.subCategory?.toLowerCase() === "footwear",

    Jewellery: (p) =>
        p.category === "women" &&
        p.subCategory?.toLowerCase() === "jewellery",
};

export default function WomenPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    useEffect(() => {
        let mounted = true;
        void getProducts().then((data) => {
            if (mounted) setAllProducts(data ?? []);
        });
        return () => { mounted = false; };
    }, []);

    /* ================= FILTERED PRODUCTS (FIXED + FAST) ================= */

    const womenProducts = useMemo(() => {
        const filterFn = WOMEN_FILTERS[activeFilter];
        return allProducts.filter(filterFn as any);
    }, [activeFilter, allProducts]);

    return (
        <main className="relative bg-[#f6f7f9] text-gray-900">

            {/* ================= HERO ================= */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/womenHome.jpg')" }}
                />
                <div className="absolute inset-0 bg-white/70" />

                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 ml-auto text-right">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">
                        Women Collection
                    </h1>

                    <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-700 max-w-xl ml-auto">
                        Elegant fashion • Modern styles • Designed to make you stand out
                    </p>

                    <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-end">
                        <Link
                            href="/cart"
                            className="px-8 sm:px-10 py-4 rounded-full bg-black text-white font-semibold text-center"
                        >
                            View Cart
                        </Link>

                        <Link
                            href="/"
                            className="px-8 sm:px-10 py-4 rounded-full border border-gray-400 text-gray-900 font-semibold text-center hover:bg-black hover:text-white transition"
                        >
                            Explore More
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================= FILTER BAR ================= */}
            <section className="relative z-10 bg-white/80 backdrop-blur border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex gap-3 overflow-x-auto scrollbar-hide">
                    {Object.keys(WOMEN_FILTERS).map(label => (
                        <FilterBadge
                            key={label}
                            label={label}
                            active={activeFilter === label}
                            onClick={setActiveFilter}
                        />
                    ))}
                </div>
            </section>

            {/* ================= PRODUCTS GRID ================= */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#f3f4f6]">
                <div className="max-w-7xl mx-auto">
                    {womenProducts.length === 0 ? (
                        <p className="text-center text-gray-500">
                            No products found
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {womenProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ================= CTA ================= */}
            <section className="pb-16 sm:pb-24 text-center px-4 bg-[#f6f7f9]">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                    Loved the Collection?
                </h2>

                <p className="text-gray-600 mb-8">
                    Add your favorite items and order instantly via WhatsApp
                </p>

                <Link
                    href="/cart"
                    className="inline-block px-10 py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-500 text-white"
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
    onClick: (value: string) => void;
}) {
    return (
        <button
            onClick={() => onClick(label)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition
            ${active
                    ? "bg-black text-white"
                    : "bg-white text-pink-700 border border-pink-200 hover:bg-pink-50"
                }`}
        >
            {label}
        </button>
    );
}
