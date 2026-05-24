"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heart, ShoppingBag, ArrowLeft, Check, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getProduct } from "@/lib/api";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { viewContent, addToCart as fbAddToCart } from "@/lib/fbpixel";
import toast from "react-hot-toast";

interface SizeVariant { id: string; size: string; stock: number; }
interface ColorVariant { id: string; name: string; images: string[]; sizes: SizeVariant[]; }
interface Bundle { quantity: number; price: number; }
interface Product {
  id: string; name: string; slug: string; description?: string;
  price: number; oldPrice?: number; images: string[];
  isActive: boolean; colorVariants: ColorVariant[];
  category?: { name: string; slug: string };
  metaTitle?: string; metaDescription?: string;
  bundles?: Bundle[];
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { addItem } = useCartStore();
  const { toggle: toggleWishlistItem, has: isInWishlistFn } = useWishlistStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeVariant | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [bundleModal, setBundleModal] = useState<Bundle | null>(null);
  const [bundleSelections, setBundleSelections] = useState<{color: ColorVariant | null; size: SizeVariant | null}[]>([]);

  useEffect(() => {
    getProduct(slug).then(res => {
      setProduct(res.data);
      if (res.data.colorVariants?.length) setSelectedColor(res.data.colorVariants[0]);
      setLoading(false);
      viewContent({ id: res.data.id, name: res.data.name, price: res.data.price, category: res.data.category?.name });
    }).catch(() => { setLoading(false); router.push("/shop"); });
  }, [slug]);

  useEffect(() => { setActiveImage(0); setSelectedSize(null); }, [selectedColor]);

  const currentImages = selectedColor?.images?.length ? selectedColor.images : product?.images || [];
  const availableSizes = selectedColor?.sizes?.filter(s => s.stock > 0) || [];
  const isInWishlist = product ? isInWishlistFn(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    if (selectedColor && !selectedSize) { alert("Please select a size"); return; }
    addItem({
      id: `${product.id}-${selectedColor?.name}-${selectedSize?.size}`,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: currentImages[0],
      size: selectedSize?.size,
      color: selectedColor?.name,
      quantity: 1,
    });
    fbAddToCart({ id: product.id, name: product.name, price: product.price, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const toggleWishlist = () => {
    if (!product) return;
    toggleWishlistItem(product.id);
  };

  const openBundleModal = (bundle: Bundle) => {
    setBundleModal(bundle);
    setBundleSelections(
      Array.from({ length: bundle.quantity }, (_, i) =>
        i === 0 ? { color: selectedColor, size: selectedSize } : { color: null, size: null }
      )
    );
  };

  const handleAddBundle = () => {
    if (!product || !bundleModal) return;
    bundleSelections.forEach((sel, idx) => {
      addItem({
        id: `${product.id}-${sel.color?.name}-${sel.size?.size}-bundle-${Date.now()}-${idx}`,
        productId: product.id,
        slug: product.slug,
        name: `${product.name} (Bundle x${bundleModal.quantity})`,
        price: idx === 0 ? bundleModal.price : 0,
        image: sel.color?.images?.[0] || currentImages[0],
        size: sel.size?.size,
        color: sel.color?.name,
        quantity: 1,
      });
    });
    setBundleModal(null);
    toast.success(`Bundle of ${bundleModal.quantity} added to cart!`);
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
      <main className="pt-20 pb-16">
        <div className="container py-8 md:py-16">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-xs tracking-widest uppercase text-gray-400 hover:text-black transition-colors mb-8">
            <ArrowLeft size={12} /> Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Images */}
            <div className="space-y-3">
              <div className="aspect-[3/4] bg-gray-50 overflow-hidden">
                {currentImages[activeImage] ? (
                  <img src={currentImages[activeImage]} alt={product.name} className="w-full h-full object-cover transition-all duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200">No Image</div>
                )}
              </div>
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
            <div className="space-y-4 lg:pt-4" dir="ltr">
              {product.category && (
                <p className="text-xs tracking-[0.4em] uppercase text-gray-400">{product.category.name}</p>
              )}
              <h1 className="text-3xl md:text-4xl font-display tracking-widest leading-tight">{product.name}</h1>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-2xl font-display tracking-widest">{formatPrice(product.price)}</span>
                {product.oldPrice && <span className="text-gray-400 line-through text-sm">{formatPrice(product.oldPrice)}</span>}
              </div>

              {/* Color Selection */}
              {product.colorVariants?.length > 0 && (
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-3">
                    Color: <span className="text-black font-medium">{selectedColor?.name}</span>
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
                    Size: {selectedSize && <span className="text-black font-medium">{selectedSize.size}</span>}
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
                    <p className="text-xs text-red-400 tracking-widest uppercase">Out of Stock</p>
                  )}
                </div>
              )}

              {/* Description */}
              {product.description && (
                <p className="text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-6">{product.description}</p>
              )}

              {/* Bundle Deals */}
              {product.bundles && product.bundles.length > 0 && (
                <div className="border-t border-gray-100 pt-6">
                  <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-4">BUNDLE DEALS</p>
                  <div className="space-y-3">
                    {product.bundles.map((bundle, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 hover:border-black transition-colors">
                        <div>
                          <p className="text-sm font-medium tracking-wider">{bundle.quantity} PIECES</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-lg font-display">{formatPrice(bundle.price)}</span>
                            <span className="text-xs text-gray-400 line-through">{formatPrice(bundle.quantity * product.price)}</span>
                            <span className="text-xs text-green-600">Save {formatPrice((bundle.quantity * product.price) - bundle.price)}</span>
                          </div>
                        </div>
                        <button onClick={() => openBundleModal(bundle)}
                          className="bg-black text-white px-6 py-3 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors">
                          ADD BUNDLE
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={handleAddToCart}
                  disabled={selectedColor ? (!selectedSize || availableSizes.length === 0) : false}
                  className="flex-1 bg-black text-white py-4 flex items-center justify-center gap-3 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors disabled:opacity-40">
                  {added ? <><Check size={14} /> Added to Bag</> : <><ShoppingBag size={14} /> Add to Bag</>}
                </button>
                <button onClick={toggleWishlist}
                  className={`w-14 border-2 flex items-center justify-center transition-all ${isInWishlist ? "border-black bg-black text-white" : "border-gray-200 hover:border-black"}`}>
                  <Heart size={16} fill={isInWishlist ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Info */}
              <div className="border-t border-gray-100 pt-6 space-y-3">
                {[
                  ["Payment", "Cash on Delivery"],
                  ["Returns", "14-day return policy"],
                  ["Shipping", "Calculated at checkout"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between text-xs gap-4">
                     <span className="text-gray-400 tracking-widest uppercase shrink-0">{k}</span>
                     <span className="text-black tracking-wider text-right">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bundle Modal */}
      {bundleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setBundleModal(null)}>
          <div className="bg-white w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()} dir="ltr">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-sm font-display tracking-widest">SELECT {bundleModal.quantity} PIECES</h3>
              <button onClick={() => setBundleModal(null)} className="text-gray-400 hover:text-black"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4 max-h-96 overflow-y-auto">
              {bundleSelections.map((sel, idx) => (
                <div key={idx} className="border border-gray-100 p-4">
                  <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">PIECE {idx + 1}</p>
                  <div className="mb-3">
                    <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-2">
                      Color: <span className="text-black">{sel.color?.name || "Select"}</span>
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {product.colorVariants.map(cv => (
                        <button key={cv.id} onClick={() => {
                          const newSels = [...bundleSelections];
                          newSels[idx] = { color: cv, size: null };
                          setBundleSelections(newSels);
                        }}
                          className={`px-3 py-1.5 text-xs tracking-widest uppercase border transition-all ${sel.color?.id === cv.id ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-400"}`}>
                          {cv.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  {sel.color && (
                    <div>
                      <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-2">
                        Size: <span className="text-black">{sel.size?.size || "Select"}</span>
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {sel.color.sizes?.filter(s => s.stock > 0).map(s => (
                          <button key={s.id} onClick={() => {
                            const newSels = [...bundleSelections];
                            newSels[idx] = { ...newSels[idx], size: s };
                            setBundleSelections(newSels);
                          }}
                            className={`w-12 h-12 text-xs tracking-widest uppercase border transition-all ${sel.size?.id === s.id ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-400"}`}>
                            {s.size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs tracking-widest uppercase text-gray-400">Bundle Total</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 line-through">{formatPrice(bundleModal.quantity * product.price)}</span>
                  <span className="text-xl font-display">{formatPrice(bundleModal.price)}</span>
                </div>
              </div>
              <button
                disabled={bundleSelections.some(s => !s.color || !s.size)}
                onClick={handleAddBundle}
                className="w-full bg-black text-white py-4 text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors disabled:opacity-40">
                ADD BUNDLE TO CART — {formatPrice(bundleModal.price)}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
