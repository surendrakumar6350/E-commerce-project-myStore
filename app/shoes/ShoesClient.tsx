"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getProducts } from "@/data/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

/* ================= FILTER CONFIG ================= */

const SHOE_FILTERS = ["All", "Running", "Casual", "Sneakers", "Formal", "Sports"];

export default function ShoesClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const typeParam = searchParams.get("type") || "All";
    const sortParam = searchParams.get("sort") || "none";
    const priceParam = Number(searchParams.get("price")) || 5000;

    const [activeType, setActiveType] = useState(typeParam);
    const [priceRange, setPriceRange] = useState(priceParam);
    const [sort, setSort] = useState(sortParam);

    const [allProducts, setAllProducts] = useState<Product[]>([]);

    /* ================= LOAD PRODUCTS ================= */
    useEffect(() => {
        let mounted = true;
        void getProducts().then((data) => {
            if (mounted) setAllProducts(data ?? []);
        });
        return () => { mounted = false; };
    }, []);

    /* ================= SHOES FILTER (OPTIMIZED) ================= */

    const filteredProducts = useMemo(() => {
        let data = allProducts.filter((p) => p.category === "shoes");

        if (activeType !== "All") {
            const type = activeType.toLowerCase();
            data = data.filter((p) =>
                p.name.toLowerCase().includes(type)
            );
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

    /* ================= SANDALS (MEMOIZED) ================= */

    const sandalsProducts = useMemo(
        () => allProducts.filter((p) => p.category === "sandals"),
        [allProducts]
    );

    /* ================= URL SYNC ================= */

    useEffect(() => {
        const params = new URLSearchParams();

        if (activeType !== "All") params.set("type", activeType);
        if (priceRange !== 5000) params.set("price", String(priceRange));
        if (sort !== "none") params.set("sort", sort);

        router.replace(`?${params.toString()}`, { scroll: false });
    }, [activeType, priceRange, sort, router]);

    return (
        <main className="bg-gray-50 text-gray-900">

            {/* ================= HERO ================= */}
            <section
                className="min-h-[90vh] flex items-center bg-cover bg-center relative"
                style={{ backgroundImage: "url('/heroShoes.jpg')" }}
            >
                <div className="absolute inset-0 bg-black/45" />

                <div className="relative max-w-7xl mx-auto px-6 w-full">
                    <div className="ml-auto max-w-xl text-right">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white">
                            Shoes Collection
                        </h1>
                        <p className="mt-4 text-gray-200">
                            Comfort • Performance • Style
                        </p>

                        <div className="mt-10 flex justify-end gap-4">
                            <Link
                                href="/cart"
                                className="px-10 py-4 rounded-full bg-white text-black font-semibold hover:scale-105 transition"
                            >
                                View Cart
                            </Link>
                            <Link
                                href="/"
                                className="px-10 py-4 rounded-full border border-white text-white hover:bg-white hover:text-black transition"
                            >
                                Home
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= FILTER BAR ================= */}
            <section className="bg-white/90 backdrop-blur border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">

                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {SHOE_FILTERS.map(type => (
                            <button
                                key={type}
                                onClick={() => setActiveType(type)}
                                className={`
                                    px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all
                                    ${activeType === type
                                        ? "bg-black text-white scale-[1.05]"
                                        : "bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100"}
                                `}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 sm:items-center sm:justify-between">

                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-gray-600">
                                Max Price: ₹{priceRange}
                            </span>
                            <input
                                type="range"
                                min={500}
                                max={5000}
                                step={100}
                                value={priceRange}
                                onChange={e => setPriceRange(Number(e.target.value))}
                                className="w-full sm:w-52 accent-orange-500"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <select
                                value={sort}
                                onChange={e => setSort(e.target.value)}
                                className="px-4 py-2 rounded-full text-sm bg-gray-100 border border-gray-300 outline-none"
                            >
                                <option value="none">Sort</option>
                                <option value="low">Price: Low → High</option>
                                <option value="high">Price: High → Low</option>
                            </select>

                            <span className="text-xs text-gray-600">
                                {filteredProducts.length} items
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= SHOES GRID ================= */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredProducts.map(p => (
                        <ProductCard
                            key={p.id}
                            product={{
                                ...p,
                                images: Array.isArray(p.images)
                                    ? p.images
                                    : p.images
                                        ? [p.images]
                                        : [],
                            }}
                        />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <p className="text-center text-gray-500 mt-16">
                        No shoes found
                    </p>
                )}
            </section>

            {/* ================= SANDALS ================= */}
            <section className="py-20 px-6 bg-gradient-to-br from-yellow-50 via-orange-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-4xl md:text-5xl font-extrabold">
                            Sandals Collection
                        </h2>
                        <p className="mt-4 text-gray-600">
                            Comfort • Outdoor • Everyday Wear
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {sandalsProducts.map(p => (
                            <ProductCard
                                key={p.id}
                                product={{
                                    ...p,
                                    images: Array.isArray(p.images)
                                        ? p.images
                                        : p.images
                                            ? [p.images]
                                            : [],
                                }}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= CTA ================= */}
            <section className="pb-24 text-center">
                <Link
                    href="/cart"
                    className="inline-block px-14 py-6 rounded-full bg-gradient-to-r from-orange-600 to-red-600 text-white text-xl font-semibold hover:scale-105 transition"
                >
                    Order Now 👟
                </Link>
            </section>

        </main>
    );
}
