"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heart, ShoppingBag, ArrowLeft, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getProduct } from "@/lib/api";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

interface SizeVariant { id: string; size: string; stock: number; }
interface ColorVariant { id: string; name: string; images: string[]; sizes: SizeVariant[]; }
interface Product {
  id: string; name: string; slug: string; description?: string;
  price: number; oldPrice?: number; images: string[];
  isActive: boolean; colorVariants: ColorVariant[];
  category?: { name: string; slug: string };
  metaTitle?: string; metaDescription?: string;
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { addItem } = useCartStore();
  const { items: wishlist, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeVariant | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    getProduct(slug).then(res => {
      setProduct(res.data);
      if (res.data.colorVariants?.length) {
        setSelectedColor(res.data.colorVariants[0]);
      }
      setLoading(false);
    }).catch(() => { setLoading(false); router.push("/shop"); });
  }, [slug]);

  // Reset image when color changes
  useEffect(() => { setActiveImage(0); setSelectedSize(null); }, [selectedColor]);

  const currentImages = selectedColor?.images?.length ? selectedColor.images : product?.images || [];
  const availableSizes = selectedColor?.sizes?.filter(s => s.stock > 0) || [];
  const isInWishlist = wishlist.some(w => w.productId === product?.id);

  const handleAddToCart = () => {
    if (!product) return;
    if (selectedColor && !selectedSize) { alert("اختر المقاس"); return; }
    addItem({
      id: `${product.id}-${selectedColor?.name}-${selectedSize?.size}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: currentImages[0],
      size: selectedSize?.size,
      color: selectedColor?.name,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const toggleWishlist = () => {
    if (!product) return;
    if (isInWishlist) removeWishlist(product.id);
    else addWishlist({ id: product.id, productId: product.id, name: product.name, price: product.price, image: currentImages[0] });
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen">
        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="aspect-[3/4] bg-gray-100 animate-pulse" />
            <div className="space-y-4 pt-8">
              <div className="h-8 bg-gray-100 animate-pulse w-3/4" />
              <div className="h-6 bg-gray-100 animate-pulse w-1/4" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );

  if (!product) return null;

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="container py-8 md:py-16">
          {/* Breadcrumb */}
          <button onClick={() => router.back()} className="flex items-center gap-2 text-xs tracking-widest uppercase text-gray-400 hover:text-black transition-colors mb-8">
            <ArrowLeft size={12} /> رجوع
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Images */}
            <div className="space-y-3">
              {/* Main Image */}
              <div className="aspect-[3/4] bg-gray-50 overflow-hidden">
                {currentImages[activeImage] ? (
                  <img src={currentImages[activeImage]} alt={product.name} className="w-full h-full object-cover transition-all duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200">No Image</div>
                )}
              </div>
              {/* Thumbnails */}
              {currentImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {currentImages.map((img, idx) => (
                    <button key={idx} onClick={() => setActiveImage(idx)}
                      className={`flex-shrink-0 w-16 h-20 overflow-hidden border-2 transition-colors ${activeImage === idx ? "border-black" : "border-transparent"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6 lg:pt-4">
              {product.category && (
                <p className="text-xs tracking-[0.4em] uppercase text-gray-400">{product.category.name}</p>
              )}
              <h1 className="text-3xl md:text-4xl font-display tracking-widest leading-tight">{product.name}</h1>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-2xl font-display tracking-widest">{formatPrice(product.price)}</span>
                {product.oldPrice && (
                  <span className="text-gray-400 line-through text-sm">{formatPrice(product.oldPrice)}</span>
                )}
              </div>

              {/* Color Selection */}
              {product.colorVariants?.length > 0 && (
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-3">
                    اللون: <span className="text-black font-medium">{selectedColor?.name}</span>
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {product.colorVariants.map(cv => (
                      <button key={cv.id} onClick={() => setSelectedColor(cv)}
                        className={`px-4 py-2.5 text-xs tracking-widest uppercase border-2 transition-all ${selectedColor?.id === cv.id ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-400"}`}>
                        {cv.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {selectedColor && (
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-3">
                    المقاس: {selectedSize && <span className="text-black font-medium">{selectedSize.size}</span>}
                  </p>
                  {availableSizes.length > 0 ? (
                    <div className="flex gap-2 flex-wrap">
                      {availableSizes.map(s => (
                        <button key={s.id} onClick={() => setSelectedSize(s)}
                          className={`w-14 h-14 text-xs tracking-widest uppercase border-2 transition-all ${selectedSize?.id === s.id ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-400"}`}>
                          {s.size}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-red-400 tracking-widest uppercase">نفذ من المخزون</p>
                  )}
                </div>
              )}

              {/* Description */}
              {product.description && (
                <p className="text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-6">{product.description}</p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={handleAddToCart}
                  disabled={selectedColor ? (!selectedSize || availableSizes.length === 0) : false}
                  className="flex-1 bg-black text-white py-4 flex items-center justify-center gap-3 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors disabled:opacity-40">
                  {added ? <><Check size={14} /> أضيف للسلة</> : <><ShoppingBag size={14} /> أضف للسلة</>}
                </button>
                <button onClick={toggleWishlist}
                  className={`w-14 border-2 flex items-center justify-center transition-all ${isInWishlist ? "border-black bg-black text-white" : "border-gray-200 hover:border-black"}`}>
                  <Heart size={16} fill={isInWishlist ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Info */}
              <div className="border-t border-gray-100 pt-6 space-y-2">
                {[["الشحن", "توصيل مجاني لجميع المحافظات"], ["الدفع", "الدفع عند الاستلام"], ["الإرجاع", "7 أيام للإرجاع والاستبدال"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs"><span className="text-gray-400">{k}</span><span>{v}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
