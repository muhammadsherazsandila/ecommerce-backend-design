import React from 'react';
import { User, Mail, Shield, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = ({ setPage }) => {
    const { user, isAdmin } = useAuth();

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <div className="container py-8">
            <div className="bg-white border border-[#DEE2E7] rounded-lg p-8 shadow-sm max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[#DEE2E7]">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0D6EFD] to-[#005ADE] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {initials}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{user?.name || 'Guest'}</h2>
                        <p className="text-[#505050] flex items-center gap-1.5 mt-1">
                            <Mail size={14} className="text-[#8B96A5]" />
                            {user?.email || 'Not signed in'}
                        </p>
                        {isAdmin && (
                            <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-[#FF9017] bg-[#FF9017]/10 px-3 py-1 rounded-full">
                                <Shield size={12} /> Admin
                            </span>
                        )}
                    </div>
                </div>
                <div className="space-y-4">
                    <button className="w-full text-left p-4 border border-[#DEE2E7] rounded-lg hover:bg-shade transition-colors flex justify-between items-center">
                        <span className="flex items-center gap-2"><User size={16} className="text-[#8B96A5]" /> Edit Profile</span>
                        <span className="text-[#8B96A5]">→</span>
                    </button>
                    <button
                        onClick={() => setPage('orders')}
                        className="w-full text-left p-4 border border-[#DEE2E7] rounded-lg hover:bg-shade transition-colors flex justify-between items-center"
                    >
                        <span>My Orders</span>
                        <span className="text-[#8B96A5]">→</span>
                    </button>
                </div>

                {/* Author credit */}
                <div className="mt-10 pt-6 border-t border-[#DEE2E7] text-center">
                    <a
                        href="https://muhammadsheraz.dev/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[#8B96A5] hover:text-[#0D6EFD] transition-colors"
                    >
                        Built by Muhammad Sheraz
                        <ExternalLink size={11} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Profile;
