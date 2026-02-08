"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { getProducts } from "@/data/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";

/* ======================================================================
   HERO SLIDES DATA (ADS STYLE)
====================================================================== */

const heroSlides = [
  {
    image: "/hero/men.png",
    title: "Men's Fashion",
    subtitle: "Premium styles for everyday confidence",
    cta: "Shop Men",
    link: "/men",
    position: "object-left md:object-center",
  },
  {
    image: "/hero/womens.png",
    title: "Women's Collection",
    subtitle: "Elegant looks made to turn heads",
    cta: "Shop Women",
    link: "/women",
    position: "object-left md:object-center",
  },
  {
    image: "/hero/kids.png",
    title: "Kids Wear",
    subtitle: "Comfortable • Colorful • Fun",
    cta: "Shop Kids",
    link: "/kids",
    position: "object-center",
  },
  {
    image: "/hero/shoes.png",
    title: "Trending Shoes",
    subtitle: "Step into style & comfort",
    cta: "Shop Shoes",
    link: "/shoes",
    position: "object-center",
  },
  {
    image: "/hero/kitchen.png",
    title: "Home & Kitchen",
    subtitle: "Upgrade your everyday living",
    cta: "Explore",
    link: "/home-kitchen",
    position: "object-center",
  },
];

/* ======================================================================
   HOME PAGE
====================================================================== */

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  /* ================= HERO AUTO SLIDE ================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[currentSlide];

  /* ================= FEATURED PRODUCTS LOGIC ================= */
  useEffect(() => {
    let mounted = true;
    void getProducts().then((data) => {
      if (mounted) setAllProducts(data ?? []);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const featuredProducts = useMemo(() => {
    const categories = Array.from(
      new Set(allProducts.map((p) => p.category))
    );

    const mixed = categories.flatMap((category) =>
      allProducts.filter((p) => p.category === category).slice(0, 4)
    );

    return mixed.slice(0, 20);
  }, [allProducts]);

  /* ================= FEATURED AUTO SCROLL ================= */

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    let scroll = el.scrollLeft;
    let rafId: number;
    let isUserInteracting = false;
    let isVisible = true;

    const speed = window.innerWidth < 768 ? 0.25 : 0.35;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    const animate = () => {
      if (!isUserInteracting && isVisible) {
        scroll += speed;
        if (scroll >= el.scrollWidth - el.clientWidth) {
          scroll = 0;
        }
        el.scrollLeft = scroll;
      }
      rafId = requestAnimationFrame(animate);
    };

    const stop = () => {
      isUserInteracting = true;
    };

    const start = () => {
      scroll = el.scrollLeft;
      isUserInteracting = false;
    };

    el.addEventListener("mouseenter", stop);
    el.addEventListener("mouseleave", start);
    el.addEventListener("touchstart", stop, { passive: true });
    el.addEventListener("touchend", start);

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  /* ================= RENDER ================= */

  return (
    <main className="bg-gray-50 text-gray-900">

      {/* ======================================================
         HERO SECTION
      ====================================================== */}
      <section className="relative min-h-[60vh] md:min-h-[80vh] flex items-center overflow-hidden">

        {/* Background Image */}
        <Link href={slide.link} className="absolute inset-0">
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            sizes="100vw"
            className="object-fill md:object-fill transition-all duration-700"
          />

        </Link>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/20" />

        {/* Hero Content */}
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-5xl px-6 md:px-16 ml-auto text-right"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white">
            {slide.title}
          </h1>

          <p className="mt-6 text-base md:text-xl text-gray-200 max-w-xl ml-auto">
            {slide.subtitle}
          </p>

          <div className="mt-8 flex gap-4 justify-end flex-wrap">
            <Link
              href={slide.link}
              className="px-8 py-3 md:px-10 md:py-4 rounded-full bg-white text-black font-semibold hover:scale-105 transition"
            >
              {slide.cta}
            </Link>

            <Link
              href="/cart"
              className="px-8 py-3 md:px-10 md:py-4 rounded-full border border-white text-white hover:bg-white hover:text-black transition"
            >
              Cart
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white text-sm opacity-80 animate-bounce">
          ↓ Scroll
        </div>
      </section>

      {/* ======================================================
         CATEGORIES
      ====================================================== */}
      <section className="-mt-20 pt-28 pb-24 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-12">
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-10">
            <CategoryCard title="Men" image="/man.jpg" link="/men" />
            <CategoryCard title="Women" image="/women.jpg" link="/women" />
            <CategoryCard title="Watches" image="/watch.jpg" link="/watches" />
            <CategoryCard title="Shoes" image="/shoes.jpg" link="/shoes" />
            <CategoryCard title="Home & Kitchen" image="/homeKitchen.jpg" link="/home-kitchen" />
            <CategoryCard title="Kids Clothing" image="/child.jpg" link="/kids" />
          </div>
        </div>
      </section>

      {/* ======================================================
         FEATURED PRODUCTS
      ====================================================== */}
      <section className="py-24 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-10">
            Featured Products
          </h2>

          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto pb-6 cursor-grab"
          >
            {featuredProducts.map(product => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.2 }}
                className="w-[220px] sm:w-[260px] h-[520px] md:h-[560px] flex-none"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* /* ================= TRUST SECTION ================= */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">

          {/* Box */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12">

            {/* Heading */}
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
              Why Shop With Us?
            </h2>

            <p className="mt-3 text-center text-gray-600 max-w-2xl mx-auto">
              Trusted by customers across India for quality products and reliable service
            </p>

            {/* Points */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

              <TrustPoint text="Cash on Delivery Available" />
              <TrustPoint text="100% Original Products" />
              <TrustPoint text="Fast Shipping All Over India" />
              <TrustPoint text="Easy Return & Exchange" />
              <TrustPoint text="Direct WhatsApp Support" />
              <TrustPoint text="Trusted by 460+ Happy Customers" />

            </div>
          </div>
        </div>
      </section>


    </main>
  );
}

/* ======================================================================
   CATEGORY CARD COMPONENT
====================================================================== */

function CategoryCard({
  title,
  image,
  link,
}: {
  title: string;
  image: string;
  link: string;
}) {
  return (
    <Link
      href={link}
      className="relative group h-[190px] sm:h-[210px] md:h-[230px] rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition"
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

      <div className="absolute bottom-0 w-full p-5">
        <h3 className="text-base md:text-lg font-semibold text-white text-center">
          {title}
        </h3>
      </div>
    </Link>
  );
}

function TrustPoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition">

      {/* Check Icon */}
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
        ✓
      </div>

      <p className="text-gray-800 font-medium">
        {text}
      </p>
    </div>
  );
}
