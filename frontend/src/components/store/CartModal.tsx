import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Store } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { CartItem } from '../../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VendorGroup {
  vendorId: string;
  vendorName: string;
  businessName: string;
  whatsapp: string;
  items: CartItem[];
  subtotal: number;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, createOrder } = useAuthStore();

  if (!isOpen) return null;

  const totalSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Group cart line items by vendor_id
  const vendorGroupsMap = cart.reduce((acc, item) => {
    const vId = item.product.vendorId || item.product.businessName || 'vendor-default';
    if (!acc[vId]) {
      acc[vId] = {
        vendorId: vId,
        vendorName: item.product.vendorName || item.product.businessName || 'Eco Artisan',
        businessName: item.product.businessName || item.product.vendorName || 'Eco Artisan',
        whatsapp: item.product.whatsapp || '919876543210',
        items: [],
        subtotal: 0
      };
    }
    acc[vId].items.push(item);
    acc[vId].subtotal += item.product.price * item.quantity;
    return acc;
  }, {} as Record<string, VendorGroup>);

  const vendorGroups = Object.values(vendorGroupsMap);

  // Send order to a single specific vendor via their own WhatsApp number
  const handleVendorCheckout = async (group: VendorGroup) => {
    const itemsList = group.items
      .map(i => `• ${i.product.title} (x${i.quantity}) - ₹${i.product.price * i.quantity}`)
      .join('\n');
    
    const message = `Hello ${group.businessName || group.vendorName}! 🌿\nI would like to place an order from GreenCart for the following items:\n\n${itemsList}\n\nVendor Subtotal: ₹${group.subtotal}\nPlease share payment and delivery details!`;
    const cleanPhone = group.whatsapp.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    try {
      if (createOrder) {
        await createOrder({
          items: group.items.map(i => ({
            productId: i.product.id,
            quantity: i.quantity,
            price: i.product.price,
            title: i.product.title
          })),
          sellerName: group.businessName || group.vendorName,
          paymentMode: 'WhatsApp Direct / UPI',
          deliveryCity: 'Dehradun',
          subtotal: group.subtotal,
          total: group.subtotal
        });
      }
    } catch (e) {
      console.warn('Could not record order on server', e);
    }

    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      {/* Light Soft-Rose Surface Panel (stays light for maximum readability) */}
      <div className="bg-[#F6E4E0] border border-[#0A3323]/20 rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-[#0A3323]/15 flex items-center justify-between bg-[#F6E4E0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0A3323] text-[#F7F4D5] flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0A3323]">Your GreenCart</h3>
              <p className="text-xs text-[#0A3323]/70 font-medium">
                {cart.length} item{cart.length !== 1 ? 's' : ''} • {vendorGroups.length} vendor{vendorGroups.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#0A3323]/10 flex items-center justify-center text-[#0A3323] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart Items List Grouped Visually By Vendor */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {vendorGroups.length > 0 ? (
            vendorGroups.map((group) => (
              <div key={group.vendorId} className="space-y-3">
                {/* Vendor Sub-Header */}
                <div className="flex items-center justify-between px-1 border-b border-[#0A3323]/15 pb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0A3323] flex items-center gap-1.5">
                    <Store size={14} className="text-[#105666]" />
                    {group.businessName || group.vendorName}
                  </span>
                  <span className="text-[11px] font-bold text-[#105666] bg-white/60 px-2.5 py-0.5 rounded-full border border-[#0A3323]/10">
                    Vendor Subtotal: ₹{group.subtotal}
                  </span>
                </div>

                {/* Items from this vendor */}
                <div className="space-y-3 pl-1">
                  {group.items.map((item) => (
                    <div 
                      key={item.product.id}
                      className="flex items-center gap-4 p-3.5 bg-white rounded-2xl border border-[#0A3323]/10 shadow-xs"
                    >
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.title} 
                        className="w-16 h-16 rounded-xl object-cover border border-[#0A3323]/15 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-[#0A3323] truncate">{item.product.title}</h4>
                        <div className="text-xs font-bold text-[#105666] mt-1">₹{item.product.price}</div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-[#F6E4E0] border border-[#0A3323]/20 rounded-xl p-1">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg hover:bg-white text-[#0A3323] flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold text-[#0A3323] w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg hover:bg-white text-[#0A3323] flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-600 hover:text-red-800 p-1 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 space-y-3">
              <ShoppingBag size={48} className="mx-auto text-[#0A3323]/40" />
              <p className="text-sm font-bold text-[#0A3323]">Your eco-cart is currently empty.</p>
              <p className="text-xs text-[#0A3323]/70 max-w-xs mx-auto">Explore sustainable handmade products from verified small businesses in our Eco Store!</p>
            </div>
          )}
        </div>

        {/* Footer Subtotal & Vendor Checkout Actions */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-[#0A3323]/15 bg-[#F6E4E0] space-y-4">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-[#0A3323]/80">Order Total</span>
              <span className="text-[#105666] text-xl font-serif">₹{totalSubtotal}</span>
            </div>
            
            {/* Multi-Vendor vs Single-Vendor Checkout */}
            {vendorGroups.length > 1 ? (
              <div className="space-y-2.5">
                <p className="text-[11px] font-bold text-[#0A3323]/80">
                  Multiple small businesses in order. Send separate orders via WhatsApp:
                </p>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {vendorGroups.map((group) => (
                    <button
                      key={group.vendorId}
                      onClick={() => handleVendorCheckout(group)}
                      className="w-full bg-[#0A3323] hover:bg-[#105666] text-[#F7F4D5] py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-between gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <span className="truncate">Send order to {group.businessName || group.vendorName}</span>
                      <span className="font-mono text-[11px] bg-white/15 px-2 py-0.5 rounded-lg flex items-center gap-1 flex-shrink-0">
                        ₹{group.subtotal} <ArrowRight size={12} />
                      </span>
                    </button>
                  ))}
                </div>
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={clearCart}
                    className="text-[11px] font-bold text-red-700 hover:underline cursor-pointer"
                  >
                    Clear All Cart Items
                  </button>
                </div>
              </div>
            ) : (
              /* Single Vendor Checkout */
              <div className="flex gap-3">
                <button
                  onClick={clearCart}
                  className="px-4 py-3 bg-[#105666] hover:bg-[#0A3323] text-[#F7F4D5] rounded-2xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Clear Cart
                </button>
                <button
                  onClick={() => handleVendorCheckout(vendorGroups[0])}
                  className="flex-1 bg-[#0A3323] hover:bg-[#105666] text-[#F7F4D5] py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  Send order to {vendorGroups[0]?.businessName || vendorGroups[0]?.vendorName} (₹{vendorGroups[0]?.subtotal})
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CartModal;
