import React from 'react';
import { Package } from 'lucide-react';

const Orders = ({ setPage }) => {
    // No orders API yet — show empty state
    const orderItems = [];

    return (
        <div className="container py-8">
            <div className="bg-white border border-[#DEE2E7] rounded-lg p-8 shadow-sm">
                <h1 className="text-2xl font-bold mb-6">Recent Orders</h1>

                {orderItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-24 h-24 bg-[#F7F7F7] rounded-full flex items-center justify-center mb-6">
                            <Package size={40} className="text-[#DEE2E7]" />
                        </div>
                        <h2 className="text-xl font-bold text-[#1C1C1C] mb-2">No orders yet</h2>
                        <p className="text-[#8B96A5] text-sm mb-6 max-w-sm">
                            You haven't placed any orders yet. Start exploring our products and make your first purchase!
                        </p>
                        <button
                            className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                            onClick={() => setPage('listing')}
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orderItems.map((order) => (
                            <div key={order.id} className="border border-[#DEE2E7] rounded-lg overflow-hidden">
                                <div className="bg-[#F7FAFC] p-4 border-b border-[#DEE2E7] flex justify-between items-center whitespace-nowrap overflow-x-auto no-scrollbar gap-4">
                                    <div className="flex gap-6 text-sm">
                                        <div>
                                            <p className="text-[#8B96A5]">ORDER PLACED</p>
                                            <p className="font-medium">{order.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-[#8B96A5]">TOTAL</p>
                                            <p className="font-medium">${order.total.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[#8B96A5]">STATUS</p>
                                            <p className="font-medium text-[#00B517]">{order.status}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[#8B96A5] text-sm text-right">ORDER # {order.id}</p>
                                    </div>
                                </div>
                                <div className="p-6 flex gap-6">
                                    <div className="w-20 h-20 bg-white border border-[#DEE2E7] rounded p-2 flex items-center justify-center">
                                        <img
                                            src={order.image || 'https://via.placeholder.com/80x80?text=No+Image'}
                                            alt={order.title}
                                            className="max-w-full max-h-full object-contain"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'; }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-primary hover:underline cursor-pointer mb-2">{order.title}</h3>
                                        <button
                                            className="bg-primary text-white px-4 py-2 rounded text-sm font-bold hover:bg-primary-dark transition-colors"
                                            onClick={() => setPage('listing')}
                                        >
                                            Buy it again
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
