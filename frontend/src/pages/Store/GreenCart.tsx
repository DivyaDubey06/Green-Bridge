import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Search, Plus, Trash2, Edit3, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Product } from '../../types';
import toast from 'react-hot-toast';
import { BasketDropAnimation, BasketDropTriggerData } from '../../components/store/BasketDropAnimation';
import { Surface } from '../../components/common/Surface';
import { Background3DScene } from '../../components/common/Background3DScene';

export const GreenCart: React.FC = () => {
  const { 
    products, 
    vendors, 
    currentUser, 
    addToCart, 
    createProduct, 
    updateProduct, 
    deleteProduct 
  } = useAuthStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [basketTrigger, setBasketTrigger] = useState<BasketDropTriggerData | null>(null);

  // Vendor Dashboard Modal / Panel state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProd, setNewProd] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Personal Care',
    image: '',
    whatsapp: ''
  });

  // Check if current user is an approved vendor
  const userVendor = vendors.find(v => v.ownerId === currentUser?.id);
  const isApprovedVendor = userVendor?.verificationStatus === 'APPROVED';

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    // If prefers-reduced-motion: fade + instant badge increment, no basket
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      addToCart(product);
      toast.success(`Added "${product.title}" to GreenCart! 🌿`);
      return;
    }

    // Trigger Red Basket animation sequence
    setBasketTrigger({
      id: `${product.id}-${Date.now()}`,
      product
    });
  };

  const handleArrivalAtCart = (product: Product) => {
    // Badge increments the moment the basket reaches the cart icon
    addToCart(product);
    toast.success(`Added "${product.title}" to GreenCart! 🌿`);
  };

  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.title || !newProd.price || !userVendor) {
      toast.error('Please enter product title and price.');
      return;
    }
    try {
      await createProduct({
        vendorId: userVendor.id,
        vendorName: userVendor.businessName,
        businessName: userVendor.businessName,
        title: newProd.title,
        description: newProd.description,
        price: Number(newProd.price),
        images: newProd.image ? [newProd.image] : ['https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500&auto=format&fit=crop&q=60'],
        category: newProd.category,
        inStock: true,
        whatsapp: newProd.whatsapp || userVendor.whatsapp
      });
      toast.success('Product listed successfully in GreenCart!');
      setShowAddProductModal(false);
      setNewProd({ title: '', description: '', price: '', category: 'Personal Care', image: '', whatsapp: '' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to list product.');
    }
  };

  // Filter Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Split into 2 rows for the horizontal scroll carousel
  const row1Products = filteredProducts.filter((_, idx) => idx % 2 === 0);
  const row2Products = filteredProducts.filter((_, idx) => idx % 2 !== 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-12">
      {/* Red Basket Drop 3D Animation Component */}
      <BasketDropAnimation triggerData={basketTrigger} onArrival={handleArrivalAtCart} />

      {/* Header Banner with 3D Store Scene */}
      <Surface tone="deep" className="p-10 rounded-[40px] shadow-2xl relative overflow-hidden border border-white/10">
        <Background3DScene tab="store" className="w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl relative z-10">
              <span className="text-xs font-extrabold uppercase tracking-widest bg-[#0A3323]/10 text-[#0A3323] dark:bg-white/10 dark:text-[#1C8F6A] px-3.5 py-1.5 rounded-full inline-block">
                Eco Store & Marketplace
              </span>
              <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight text-[#0A3323] dark:text-[#1C8F6A]">
                GreenCart Small Business Marketplace
              </h1>
              <p className="text-sm text-[#0A3323]/80 dark:text-[#1C8F6A]/80 leading-relaxed">
                Support local sustainable artisans and eco-friendly small businesses in Uttarakhand. Every purchase directly empowers sustainable living!
              </p>
            </div>

            {/* Vendor Dashboard Button */}
            {isApprovedVendor ? (
              <button
                onClick={() => setShowAddProductModal(true)}
                className="bg-[#0A3323] hover:bg-[#105666] text-[#F7F4D5] font-bold px-6 py-3.5 rounded-2xl flex items-center gap-2 text-sm shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer z-10"
              >
                <Plus size={18} />
                Vendor Dashboard: List Product
              </button>
            ) : (
              <a
                href="/register"
                className="bg-[#0A3323] hover:bg-[#105666] text-[#F7F4D5] font-semibold px-5 py-3 rounded-2xl text-xs flex items-center gap-2 transition-colors z-10 shadow-md"
              >
                Register Your Small Business &rarr;
              </a>
            )}
          </div>
        </Background3DScene>
      </Surface>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-dark-forest border border-[#CD9777]/20 p-6 rounded-[36px] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search eco products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-warm-cream/45 dark:bg-black/20 border border-[#CD9777]/25 focus:border-primary-green focus:outline-none rounded-2xl text-sm"
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-text/40 dark:text-moss" />
        </div>

        {/* Category Pills (Pair B/C compliant for 100% legibility in light and dark mode) */}
        <div className="flex flex-wrap gap-2">
          {['All', 'Personal Care', 'Fashion & Bags', 'Eco Gadgets', 'Home & Living'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0A3323] text-[#F7F4D5] shadow-sm'
                  : 'bg-[#F7F4D5] text-[#0A3323] dark:bg-[#105666] dark:text-[#F7F4D5] border border-[#0A3323]/20 hover:border-[#0A3323]/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Two-Row Horizontally Scrollable Product Carousel */}
      {filteredProducts.length > 0 ? (
        <div className="space-y-6">
          <h3 className="font-serif text-xl font-bold text-dark-forest dark:text-beige flex items-center gap-2">
            <Tag size={20} className="text-primary-green" />
            Curated Sustainable Listings
          </h3>

          {/* Row 1 Carousel */}
          <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-emerald-600/30 flex gap-6">
            {row1Products.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelect={() => setSelectedProduct(prod)}
                onAddToCart={(e) => handleAddToCart(e, prod)}
              />
            ))}
          </div>

          {/* Row 2 Carousel */}
          {row2Products.length > 0 && (
            <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-emerald-600/30 flex gap-6">
              {row2Products.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelect={() => setSelectedProduct(prod)}
                  onAddToCart={(e) => handleAddToCart(e, prod)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-dark-forest border border-[#CD9777]/10 rounded-[40px] space-y-4 max-w-md mx-auto">
          <ShoppingBag size={48} className="mx-auto text-primary-green/40" />
          <h4 className="font-serif text-xl font-bold text-dark-forest dark:text-beige">No Products Found</h4>
          <p className="text-xs text-slate-text/60 dark:text-moss max-w-xs mx-auto">
            No eco products currently match your search filter.
          </p>
        </div>
      )}

      {/* VENDOR PRODUCT ADD MODAL */}
      {showAddProductModal && userVendor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-white dark:bg-dark-forest border border-[#CD9777]/30 rounded-[36px] shadow-2xl p-8 relative">
            <button
              onClick={() => setShowAddProductModal(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-warm-cream dark:bg-white/10 text-slate-text dark:text-beige flex items-center justify-center font-bold text-xs"
            >
              ✕
            </button>
            <h3 className="font-serif text-2xl font-bold text-dark-forest dark:text-beige mb-1">List New Eco Product</h3>
            <p className="text-xs text-slate-text/60 dark:text-moss mb-6">List a new item for sale under {userVendor.businessName}.</p>

            <form onSubmit={handleCreateProductSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-text/75 dark:text-moss block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Handmade Hemp Wallet"
                  value={newProd.title}
                  onChange={(e) => setNewProd({ ...newProd, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-warm-cream/35 dark:bg-black/20 border border-[#CD9777]/20 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-text/75 dark:text-moss block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="399"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    className="w-full px-4 py-2.5 bg-warm-cream/35 dark:bg-black/20 border border-[#CD9777]/20 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-text/75 dark:text-moss block mb-1">Category</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-warm-cream/35 dark:bg-black/20 border border-[#CD9777]/20 rounded-xl text-sm"
                  >
                    <option value="Personal Care">Personal Care</option>
                    <option value="Fashion & Bags">Fashion & Bags</option>
                    <option value="Eco Gadgets">Eco Gadgets</option>
                    <option value="Home & Living">Home & Living</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-text/75 dark:text-moss block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Materials used, eco features..."
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="w-full p-3 bg-warm-cream/35 dark:bg-black/20 border border-[#CD9777]/20 rounded-xl text-xs resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-text/75 dark:text-moss block mb-1">Photo URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newProd.image}
                  onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                  className="w-full px-4 py-2.5 bg-warm-cream/35 dark:bg-black/20 border border-[#CD9777]/20 rounded-xl text-sm"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="flex-1 py-3 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary-green text-white rounded-xl text-xs font-bold"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-xl bg-white dark:bg-dark-forest border border-[#CD9777]/30 rounded-[36px] shadow-2xl p-8 relative space-y-6">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-warm-cream dark:bg-white/10 text-slate-text dark:text-beige flex items-center justify-center font-bold text-xs"
            >
              ✕
            </button>

            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={selectedProduct.images[0]}
                alt={selectedProduct.title}
                className="w-full sm:w-48 h-48 rounded-2xl object-cover border border-[#CD9777]/20"
              />
              <div className="space-y-3 flex-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-soft-mint text-primary-green px-2.5 py-1 rounded-full">
                  {selectedProduct.category}
                </span>
                <h3 className="font-serif text-2xl font-bold text-dark-forest dark:text-beige leading-snug">{selectedProduct.title}</h3>
                <p className="text-xs text-slate-text/70 dark:text-moss">{selectedProduct.description}</p>
                <div className="text-xl font-bold font-serif text-primary-green">₹{selectedProduct.price}</div>
                <p className="text-[10px] text-slate-text/50 dark:text-moss">Vendor: <strong>{selectedProduct.businessName}</strong></p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#CD9777]/15 flex gap-4">
              <button
                onClick={(e) => {
                  handleAddToCart(e, selectedProduct);
                  setSelectedProduct(null);
                }}
                className="flex-1 bg-primary-green hover:bg-dark-forest text-white py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary-green/20 transition-all cursor-pointer"
              >
                <ShoppingBag size={16} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Component for Individual Product Cards in Carousel
const ProductCard: React.FC<{
  product: Product;
  onSelect: () => void;
  onAddToCart: (e: React.MouseEvent) => void;
}> = ({ product, onSelect, onAddToCart }) => {
  return (
    <div className="min-w-[280px] max-w-[280px] watercolor-card p-4 rounded-3xl border border-[#CD9777]/25 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group bg-white/90 dark:bg-dark-forest/80">
      <div>
        <div 
          onClick={onSelect}
          className="h-40 rounded-2xl overflow-hidden relative mb-3 cursor-pointer group-hover:scale-[1.02] transition-transform"
        >
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-2.5 left-2.5 bg-[#0A3323] text-[#F7F4D5] border border-[#F7F4D5]/30 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {product.category}
          </span>
        </div>
        <span className="text-[9px] text-slate-text/50 dark:text-moss block mb-0.5">{product.businessName}</span>
        <h4 
          onClick={onSelect}
          className="font-bold text-dark-forest dark:text-beige text-sm truncate cursor-pointer hover:text-primary-green transition-colors"
        >
          {product.title}
        </h4>
        <p className="text-xs text-slate-text/60 dark:text-moss line-clamp-2 mt-1 leading-relaxed">{product.description}</p>
      </div>

      <div className="pt-3 mt-3 border-t border-[#CD9777]/10 flex items-center justify-between">
        <span className="text-sm font-bold font-serif text-primary-green">₹{product.price}</span>
        <button
          onClick={onAddToCart}
          className="bg-primary-green hover:bg-dark-forest text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
        >
          <ShoppingBag size={14} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};
