import React, { useState, useEffect } from 'react';
import { ChevronDown, ArrowLeft, Trash2, Heart, ShieldCheck, Truck, MessageSquare, ShoppingCart, Loader2, Plus, Minus } from 'lucide-react';
import { productsAPI } from '../api';

const Cart = ({ setPage }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load cart from localStorage and fetch product details
    useEffect(() => {
        const loadCart = async () => {
            try {
                const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
                if (savedCart.length === 0) {
                    setCartItems([]);
                    setLoading(false);
                    return;
                }

                // Fetch full product details for each cart item
                const itemsWithDetails = await Promise.all(
                    savedCart.map(async (cartItem) => {
                        try {
                            const { data } = await productsAPI.getById(cartItem.productId);
                            if (data.success) {
                                return {
                                    ...data.product,
                                    qty: cartItem.qty || 1,
                                };
                            }
                        } catch {
                            // Product may have been deleted
                        }
                        return null;
                    })
                );

                setCartItems(itemsWithDetails.filter(Boolean));
            } catch {
                setCartItems([]);
            } finally {
                setLoading(false);
            }
        };
        loadCart();
    }, []);

    // Save cart to localStorage whenever it changes
    const saveCart = (items) => {
        const toSave = items.map((item) => ({ productId: item._id, qty: item.qty }));
        localStorage.setItem('cart', JSON.stringify(toSave));
    };

    const updateQty = (id, delta) => {
        setCartItems((prev) => {
            const updated = prev.map((item) =>
                item._id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
            );
            saveCart(updated);
            return updated;
        });
    };

    const removeItem = (id) => {
        setCartItems((prev) => {
            const updated = prev.filter((item) => item._id !== id);
            saveCart(updated);
            return updated;
        });
    };

    const removeAll = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const discount = subtotal > 200 ? subtotal * 0.05 : 0;
    const tax = subtotal * 0.02;
    const total = subtotal - discount + tax;

    if (loading) {
        return (
            <div className="container py-6 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-[#0D6EFD] animate-spin" />
                    <p className="text-[#8B96A5] text-sm">Loading cart...</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="container py-6">
                <div className="bg-white border border-[#DEE2E7] rounded-lg p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                    <div className="w-24 h-24 bg-[#F7F7F7] rounded-full flex items-center justify-center mb-6">
                        <ShoppingCart size={40} className="text-[#DEE2E7]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1C1C1C] mb-2">Your cart is empty</h2>
                    <p className="text-[#8B96A5] text-sm mb-6 max-w-sm">
                        Looks like you haven't added any products to your cart yet. Browse our products and find something you love!
                    </p>
                    <button
                        className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                        onClick={() => setPage('listing')}
                    >
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-6">
            <h1 className="text-2xl font-bold text-[#1C1C1C] mb-6">My cart ({cartItems.length})</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Section: Cart Items */}
                <div className="flex-1 space-y-4">
                    <div className="bg-white border border-[#DEE2E7] rounded-lg overflow-hidden">
                        {cartItems.map((item, index) => (
                            <div key={item._id} className={`p-4 lg:p-6 flex flex-col sm:flex-row gap-4 lg:gap-6 ${index !== cartItems.length - 1 ? 'border-b border-[#DEE2E7]' : ''}`}>
                                {/* Product Image */}
                                <div
                                    className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] border border-[#DEE2E7] rounded-lg p-3 flex items-center justify-center bg-[#F7F7F7] flex-shrink-0 group overflow-hidden cursor-pointer"
                                    onClick={() => setPage('details')}
                                >
                                    <img
                                        src={item.image || 'https://via.placeholder.com/100x100?text=No+Image'}
                                        alt={item.name}
                                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100?text=No+Image'; }}
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
                                    <div className="space-y-1.5">
                                        <h3 className="font-semibold text-[#1C1C1C] hover:text-primary cursor-pointer transition-colors max-w-md">{item.name}</h3>
                                        <div className="text-[#8B96A5] text-sm space-y-0.5">
                                            <p>Category: {item.category}</p>
                                            {item.brand && <p>Brand: {item.brand}</p>}
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                className="px-3 py-1.5 border border-[#DEE2E7] rounded-md text-[#FA3434] text-xs font-semibold hover:bg-[#FFF0F0] transition-colors flex items-center gap-1.5"
                                                onClick={() => removeItem(item._id)}
                                            >
                                                <Trash2 size={12} />
                                                Remove
                                            </button>
                                            <button className="px-3 py-1.5 border border-[#DEE2E7] rounded-md text-primary text-xs font-semibold hover:bg-shade transition-colors flex items-center gap-1.5">
                                                <Heart size={12} />
                                                Save for later
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-3 min-w-[120px]">
                                        <span className="text-lg font-bold text-[#1C1C1C]">${(item.price * item.qty).toFixed(2)}</span>
                                        <div className="flex items-center border border-[#DEE2E7] rounded-md overflow-hidden">
                                            <button
                                                className="px-2 py-2 hover:bg-shade transition-colors"
                                                onClick={() => updateQty(item._id, -1)}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="px-4 py-2 text-sm font-medium border-x border-[#DEE2E7]">{item.qty}</span>
                                            <button
                                                className="px-2 py-2 hover:bg-shade transition-colors"
                                                onClick={() => updateQty(item._id, 1)}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-[#DEE2E7]">
                        <button
                            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                            onClick={() => setPage('listing')}
                        >
                            <ArrowLeft size={18} />
                            Back to shop
                        </button>
                        <button
                            className="text-[#FA3434] font-bold hover:underline"
                            onClick={removeAll}
                        >
                            Remove all
                        </button>
                    </div>

                    {/* Benefits Bar */}
                    <div className="flex flex-wrap gap-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#DEE2E7] flex items-center justify-center text-[#8B96A5]">
                                <ShieldCheck size={20} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-[#1C1C1C] font-semibold text-sm">Secure Payment</p>
                                <p className="text-[#8B96A5] text-xs">Have you ever heard that?</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#DEE2E7] flex items-center justify-center text-[#8B96A5]">
                                <MessageSquare size={20} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-[#1C1C1C] font-semibold text-sm">Customer Support</p>
                                <p className="text-[#8B96A5] text-xs">Have you ever heard that?</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#DEE2E7] flex items-center justify-center text-[#8B96A5]">
                                <Truck size={20} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-[#1C1C1C] font-semibold text-sm">Free Delivery</p>
                                <p className="text-[#8B96A5] text-xs">Have you ever heard that?</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section: Summary */}
                <div className="lg:w-[280px] space-y-4">
                    {/* Coupon */}
                    <div className="bg-white border border-[#DEE2E7] rounded-lg p-5">
                        <p className="text-[#505050] text-sm mb-3">Have a coupon?</p>
                        <div className="flex border border-[#DEE2E7] rounded-md overflow-hidden">
                            <input type="text" placeholder="Add coupon" className="flex-1 px-3 py-2 outline-none text-sm" />
                            <button className="bg-white border-l border-[#DEE2E7] px-4 py-2 text-primary font-bold text-sm hover:bg-shade transition-colors">Apply</button>
                        </div>
                    </div>

                    {/* Price Calculations */}
                    <div className="bg-white border border-[#DEE2E7] rounded-lg p-5 shadow-sm">
                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-[#505050]">
                                <span>Subtotal:</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-[#FA3434]">
                                    <span>Discount (5%):</span>
                                    <span>- ${discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-[#00B517]">
                                <span>Tax:</span>
                                <span>+ ${tax.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="h-[1px] bg-[#DEE2E7] mb-4"></div>

                        <div className="flex justify-between text-lg font-bold text-[#1C1C1C] mb-6">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        <button className="w-full bg-[#00B517] hover:bg-[#00A015] text-white py-4 rounded-lg font-bold text-lg transition-colors shadow-lg">
                            Checkout
                        </button>

                        <div className="mt-4 flex flex-wrap justify-center gap-2 opacity-60">
                            {/* Payment icon placeholders */}
                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
