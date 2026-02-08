"use client";

import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Rating from "@/components/Rating";
import Image from "next/image";

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const { addToCart } = useCart();

    /* ================= IMAGE NORMALIZATION (SAFE) ================= */
    const images: string[] = Array.isArray(product.images)
        ? product.images
        : product.images
            ? [product.images]
            : product.image
                ? [product.image]
                : [];

    const imageSrc = images[0] || "/placeholder.jpg";

    return (
        <div
            className="
                group
                bg-white
                border border-gray-200
                rounded-2xl
                overflow-hidden
                flex flex-col
                transition
                hover:shadow-xl
                hover:border-gray-300
                h-full
            "
        >
            {/* ================= IMAGE (✅ NOW CLICKABLE) ================= */}
            <Link href={`/product/${product.id}`} className="block">
                <div className="relative w-full bg-gray-100 overflow-hidden flex-shrink-0 h-48 sm:h-56 md:h-60">
                    <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        priority={false}
                        loading="lazy"
                    />
                </div>
            </Link>

            {/* ================= CONTENT ================= */}
            <div className="p-4 flex flex-col gap-2 text-gray-900 flex-1">
                {typeof product.rating === "number" && (
                    <Rating value={product.rating} />
                )}

                <h3 className="font-semibold text-sm sm:text-base leading-snug line-clamp-2">
                    {product.name}
                </h3>

                <p className="text-gray-700 text-sm font-medium">
                    ₹{product.price}
                </p>

                {product.description && (
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                        {product.description}
                    </p>
                )}

                {/* ❌ already tha – untouched */}
                <Link
                    href={`/product/${product.id}`}
                    className="
                        mt-2
                        w-full text-center
                        py-2
                        border border-gray-300
                        rounded-md
                        text-sm
                        text-gray-800
                        hover:bg-black hover:text-white
                        transition
                    "
                >
                    Full Details
                </Link>

                <button
                    type="button"
                    onClick={() => {
                        addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            qty: 1,
                            images: images.length ? images : ["/placeholder.jpg"],
                        });
                    }}
                    className="
                        mt-3 sm:mt-4
                        w-full py-2
                        bg-black text-white
                        rounded-md
                        font-medium
                        text-sm
                        hover:bg-gray-800
                        transition
                    "
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
