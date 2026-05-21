"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

export default function ProductCard({ product }: { product: Product }) {
  const img1 = product.images?.[0] || "https://placehold.co/400x533/f5f5f5/000?text=SEENWAYS";
  const img2 = product.images?.[1] || img1;
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null;
  const { addItem } = useCartStore();
  const { toggle, has } = useWishlistStore();
  const isWishlisted = has(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.sizes?.length > 0) {
      window.location.href = `/product/${product.slug}`;
      return;
    }
    addItem({ id: uuidv4(), productId: product.id, name: product.name, price: product.price, image: img1, quantity: 1, slug: product.slug });
    toast.success("Added to bag");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden bg-gray-50 aspect-[3/4]">
        {/* Images */}
        <Image src={img1} alt={product.name} fill className="object-cover transition-opacity duration-700 group-hover:opacity-0" sizes="(max-width: 768px) 50vw, 25vw" />
        <Image src={img2} alt={product.name} fill className="object-cover transition-opacity duration-700 opacity-0 group-hover:opacity-100" sizes="(max-width: 768px) 50vw, 25vw" />

        {/* Badge */}
        {discount && (
          <div className="absolute top-3 left-3 bg-black text-white text-[10px] px-2 py-1 tracking-widest">
            -{discount}%
          </div>
        )}
        {!product.oldPrice && product.isFeatured && (
          <div className="absolute top-3 left-3 bg-black text-white text-[10px] px-2 py-1 tracking-widest">
            NEW
          </div>
        )}

        {/* Wishlist */}
        <button onClick={handleWishlist} className={`absolute top-3 right-3 p-2 transition-all duration-300 ${isWishlisted ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          <Heart size={16} fill={isWishlisted ? "#000" : "none"} />
        </button>

        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button onClick={handleQuickAdd} className="w-full bg-black text-white py-3 flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase hover:bg-gray-900 transition-colors">
            <ShoppingBag size={14} /> QUICK ADD
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 space-y-1">
        <h3 className="text-xs tracking-wider font-medium uppercase">{product.name}</h3>
        {product.category && <p className="text-[10px] text-gray-400 tracking-widest uppercase">{product.category.name}</p>}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{formatPrice(product.price)}</span>
          {product.oldPrice && <span className="text-xs text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>}
        </div>
      </div>
    </Link>
  );
}
