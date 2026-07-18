import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Heart, Plus, Gift, Check, Sparkles, Upload } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export const Donations: React.FC = () => {
  const navigate = useNavigate();
  const { donations, currentUser, isAuthenticated, uploadDonation, requestDonation } = useAuthStore();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  
  // Upload modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [itemCategory, setItemCategory] = useState('Books');
  const [condition, setCondition] = useState('Good');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&auto=format&fit=crop&q=60');

  const handleClaim = async (donationId: string) => {
    if (!isAuthenticated) {
      toast('Please sign in to request donation items!', { icon: '🔑' });
      navigate('/login');
      return;
    }
    try {
      await requestDonation(donationId);
      toast.success('Donation requested! The owner has been notified. 🎁');
    } catch (err: any) {
      toast.error(err.message || 'Failed to request item.');
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location) {
      toast.error('Please fill in all listing details.');
      return;
    }

    uploadDonation({
      title,
      description,
      category: itemCategory,
      condition,
      location,
      images: [imageUrl]
    });

    toast.success('Donation uploaded! Thank you for sharing! ❤️');
    setShowUploadModal(false);
    
    // Reset Form
    setTitle('');
    setDescription('');
    setLocation('');
  };

  // Filter listings
  const filteredDonations = donations.filter((don) => {
    const matchesSearch = don.title.toLowerCase().includes(search.toLowerCase()) || 
                          don.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || don.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
        <div className="space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary-green bg-soft-mint px-3.5 py-1.5 rounded-full">Share Support</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-dark-forest">Community Donations</h2>
          <p className="text-sm text-slate-text/60 max-w-lg">Claim books, stationery, or clothes uploaded by neighbors, or share what you no longer need.</p>
        </div>

        {isAuthenticated && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-primary-green hover:bg-dark-forest text-white py-3.5 px-6 rounded-full font-bold text-sm transition-all flex items-center gap-1.5 shadow-md shadow-primary-green/10 cursor-pointer"
          >
            <Plus size={16} />
            Donate an Item
          </button>
        )}
      </div>

      {/* Filter panel */}
      <div className="bg-white border border-[#CD9777]/20 p-6 rounded-[36px] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search donation item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-warm-cream/45 border border-[#CD9777]/25 focus:border-primary-green focus:bg-white focus:outline-none rounded-2xl text-sm"
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-text/40" />
        </div>

        {/* Category selector */}
        <div className="w-full md:w-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-xs focus:border-primary-green focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Books">📚 Books & Notes</option>
            <option value="Clothes">👕 Clothing & Winterwear</option>
            <option value="Furniture">🪑 Furniture & Desk</option>
            <option value="Stationery">✏️ Stationery & Supplies</option>
            <option value="Electronics">💻 School Electronics</option>
          </select>
        </div>
      </div>

      {/* Donations Cards Grid */}
      {filteredDonations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDonations.map((don) => (
            <div 
              key={don.id} 
              className="watercolor-card flex flex-col h-full overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={don.images[0]} 
                  alt={don.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 right-4 bg-amber-50/95 px-3.5 py-1.5 rounded-full text-[10px] font-bold text-amber-900 uppercase tracking-widest border border-amber-200 shadow-sm">
                  {don.category}
                </span>
                
                {/* Available Badge */}
                {don.status === 'AVAILABLE' && (
                  <span className="absolute bottom-4 left-4 bg-green-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    Available
                  </span>
                )}
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-slate-text/75">From: {don.ownerName}</span>
                  <span className="bg-orange-50 text-orange-800 px-2.5 py-0.5 rounded-full font-bold border border-orange-100">
                    {don.condition}
                  </span>
                </div>

                <h4 className="font-serif text-xl font-bold text-dark-forest mb-2 leading-snug group-hover:text-primary-green transition-colors">
                  {don.title}
                </h4>
                <p className="text-xs text-slate-text/60 line-clamp-3 mb-6 leading-relaxed">
                  {don.description}
                </p>

                <div className="mt-auto pt-4 border-t border-[#CD9777]/10 flex flex-col gap-3 text-xs text-slate-text/65">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-primary-green" />
                    <span>{don.location}</span>
                  </div>

                  <button
                    onClick={() => handleClaim(don.id)}
                    disabled={don.status !== 'AVAILABLE' || (!!currentUser && don.ownerId === currentUser.id)}
                    className={`w-full mt-2 py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer ${
                      don.status === 'AVAILABLE'
                        ? !!currentUser && don.ownerId === currentUser.id
                          ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-default'
                          : 'bg-primary-green hover:bg-dark-forest text-white'
                        : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                    }`}
                  >
                    {don.status === 'AVAILABLE'
                      ? !!currentUser && don.ownerId === currentUser.id
                        ? 'Your Listing'
                        : 'Request Item 🎁'
                      : 'Claimed / Requested'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-[#CD9777]/10 rounded-[40px] space-y-4 max-w-md mx-auto">
          <span className="text-4xl block">🎁</span>
          <h4 className="font-serif text-xl font-bold text-dark-forest">No Items Found</h4>
          <p className="text-xs text-slate-text/60 leading-relaxed max-w-xs mx-auto">
            No active donations listed matching your category filters. Share your books or clothes to help a student today!
          </p>
        </div>
      )}

      {/* UPLOAD DONATION MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-white border border-[#CD9777]/20 rounded-[36px] shadow-2xl p-8 relative flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setShowUploadModal(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-warm-cream text-slate-text hover:text-primary-green flex items-center justify-center font-bold text-xs"
            >
              ✕
            </button>
            <div className="mb-4">
              <h3 className="font-serif text-xl font-bold text-dark-forest leading-none">Donate an Item</h3>
              <p className="text-[10px] text-slate-text/60 mt-1">Upload study tables, winter clothes, or stationery for students.</p>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/70 block">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Set of Highschool Math textbooks"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/70 block">Condition / Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Cover page slightly torn, otherwise pages are clean and legible."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-text/70 block">Category</label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none"
                  >
                    <option value="Books">📚 Books</option>
                    <option value="Clothes">👕 Clothes</option>
                    <option value="Furniture">🪑 Furniture</option>
                    <option value="Stationery">✏️ Stationery</option>
                    <option value="Electronics">💻 Electronics</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-text/70 block">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none"
                  >
                    <option value="New">✨ New</option>
                    <option value="Like New">💎 Like New</option>
                    <option value="Good">👍 Good</option>
                    <option value="Fair">🤝 Fair</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/70 block">Pickup Location (Area/City)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dalanwala, Dehradun"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none"
                />
              </div>

              {/* Cover image selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-text/70 block">Upload Item Image</label>
                <div className="border-2 border-dashed border-[#CD9777]/20 p-5 rounded-2xl flex flex-col items-center justify-center text-center bg-warm-cream/10 cursor-pointer">
                  <Upload size={18} className="text-[#CD9777] mb-1" />
                  <span className="text-xs font-bold text-slate-text">Drag photo or click to choose file</span>
                  <span className="text-[9px] text-slate-text/45 mt-0.5">JPG, PNG (Max 5MB)</span>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-[#CD9777]/10">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-3 border border-[#CD9777]/30 text-xs font-bold rounded-2xl text-slate-text hover:bg-red-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary-green hover:bg-dark-forest text-white text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-1 shadow-sm"
                >
                  List Item
                  <Sparkles size={12} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Donations;
