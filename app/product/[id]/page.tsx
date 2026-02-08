"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getProducts } from "@/data/products";
import type { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";

export default function ProductDetailPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;

    const { addToCart } = useCart();

    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [activeImage, setActiveImage] = useState(0);

    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [customersAlsoBought, setCustomersAlsoBought] = useState<Product[]>([]);

    useEffect(() => {
        let mounted = true;
        void getProducts().then((data) => {
            if (!mounted) return;
            const items = data ?? [];
            setAllProducts(items);
        });
        return () => { mounted = false; };
    }, []);

    const product = allProducts.find((p) => String(p.id) === id);
    const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

    /* ================= RECOMMENDATIONS ================= */
    useEffect(() => {
        if (!product) return;

        setRelatedProducts(
            shuffle(
                allProducts.filter((p) =>
                    p.id !== product.id &&
                    p.category === product.category &&
                    p.subCategory === product.subCategory
                )
            ).slice(0, 6)
        );

        setCustomersAlsoBought(
            shuffle(
                allProducts.filter((p) =>
                    p.id !== product.id &&
                    p.category === product.category
                )
            ).slice(0, 6)
        );
    }, [product, allProducts]);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600 bg-gray-50">
                Product not found
            </div>
        );
    }

    /* ================= IMAGE NORMALIZE ================= */
    const images: string[] = Array.isArray(product.images)
        ? product.images
        : product.images
            ? [product.images]
            : product.image
                ? [product.image]
                : ["/placeholder.jpg"];

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900 px-4 sm:px-6 py-12">

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14">

                {/* ================= IMAGE ================= */}
                <div className="flex flex-col gap-4">
                    <div className="relative w-full max-h-[600px] aspect-[3/4] rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm">
                        <img
                            src={images[activeImage]}
                            alt={product.name}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain"
                        />
                    </div>

                    {/* THUMBNAILS */}
                    <div className="flex gap-3 overflow-x-auto">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={`
                                    relative h-20 w-16 rounded-xl overflow-hidden border
                                    ${activeImage === idx
                                        ? "border-black"
                                        : "border-gray-300"}
                                `}
                            >
                                <img
                                    src={img}
                                    alt="thumb"
                                    sizes="64px"
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* ================= DETAILS ================= */}
                <div className="flex flex-col gap-6">
                    <h1 className="text-3xl sm:text-4xl font-bold">
                        {product.name}
                    </h1>

                    <p className="text-green-600 text-2xl font-semibold">
                        ₹{product.price}
                    </p>

                    <p className="text-gray-600 max-w-xl leading-relaxed">
                        {product.description}
                    </p>

                    {product.sizes && (
                        <div>
                            <p className="mb-2 text-sm font-medium">Select Size</p>
                            <div className="flex gap-3 flex-wrap">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`
                                            px-4 py-2 rounded-full border transition
                                            ${selectedSize === size
                                                ? "bg-black text-white border-black"
                                                : "border-gray-300 hover:bg-gray-100"}
                                        `}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 flex-wrap mt-4">
                        <button
                            onClick={() => {
                                if (product.sizes && !selectedSize) return;
                                addToCart({
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    qty: 1,
                                    size: selectedSize ?? undefined,
                                    images,
                                });
                            }}
                            className="px-8 py-3 rounded-full bg-black text-white font-semibold hover:scale-105 transition"
                        >
                            Add to Cart
                        </button>

                        <button className="px-8 py-3 rounded-full border border-gray-400 hover:bg-gray-100 transition">
                            Order on WhatsApp
                        </button>
                    </div>
                </div>
            </div>

            {/* ================= RELATED ================= */}
            {relatedProducts.length > 0 && (
                <section className="mt-28">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                        Related Products
                    </h2>

                    <div className="flex gap-6 overflow-x-auto pb-4">
                        {relatedProducts.map(item => (
                            <div key={item.id} className="min-w-[220px] sm:min-w-[260px]">
                                <ProductCard product={item} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {customersAlsoBought.length > 0 && (
                <section className="mt-28">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                        Customers Also Bought
                    </h2>

                    <div className="flex gap-6 overflow-x-auto pb-4">
                        {customersAlsoBought.map(item => (
                            <div key={item.id} className="min-w-[220px] sm:min-w-[260px]">
                                <ProductCard product={item} />
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
