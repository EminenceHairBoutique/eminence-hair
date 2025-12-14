import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";


const TABS = [
  "Overview",
  "Orders",
  "Wishlist",
  "Loyalty",
  "Referrals",
  "Settings",
];

export default function AccountDashboard() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="pt-28 pb-24 bg-black text-neutral-900 min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.35)] p-8">
          
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm text-neutral-500">
                Welcome back,{" "}
                <span className="text-neutral-900 font-medium">
                  {user?.name || "Client"}
                </span>
              </p>
              <p className="text-xs text-neutral-400">{user?.email}</p>
            </div>

            <div className="text-xs border border-neutral-300 rounded-full px-3 py-1">
              Bronze · {user?.loyaltyPoints || 0} pts
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-neutral-200 mb-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-xs tracking-[0.2em] uppercase transition
                  ${
                    activeTab === tab
                      ? "text-black border-b border-black"
                      : "text-neutral-400 hover:text-black"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="min-h-[180px]">
            {activeTab === "Overview" && <Overview />}
            {activeTab === "Orders" && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                  <p className="text-xs tracking-widest uppercase text-neutral-500 mb-2">
                    Order History
                  </p>
                  <p className="text-sm text-neutral-700">
                    Your collection begins here. Once an order is placed, confirmation,
                    tracking, and history will appear below.
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-200 p-5">
                  <p className="text-xs tracking-widest uppercase text-neutral-500 mb-2">
                    Ready when you are
                  </p>
                  <p className="text-sm text-neutral-700">
                    Explore the current drop and select your texture, length, and density.
                  </p>

                  <div className="mt-4">
                    <Button
                      className="w-full rounded-full text-xs tracking-[0.25em] uppercase"
                      onClick={() => navigate("/shop")}
                    >
                      Shop the Collection
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "Wishlist" && <Wishlist />}
            {activeTab === "Loyalty" && <Loyalty />}
            {activeTab === "Referrals" && <Referrals />}
            {activeTab === "Settings" && <Settings />}
          </div>

          {/* Logout */}
          <div className="mt-10">
            <Button
              variant="outline"
              className="w-full rounded-full text-xs tracking-[0.25em] uppercase"
              onClick={logout}
            >
              Log Out
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <SummaryCard title="Tier" value="Bronze" subtitle="Every order pulls you higher." />
          <SummaryCard title="Loyalty Points" value={`${user?.loyaltyPoints || 0} pts`} subtitle="Earn 1 pt per $10." />
          <SummaryCard title="Orders" value={user?.orders?.length || 0} subtitle="Your first piece awaits." />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Sub-components ---------------- */

const SummaryCard = ({ title, value, subtitle }) => (
  <div className="bg-white rounded-2xl p-5 shadow-md">
    <p className="text-xs tracking-widest uppercase text-neutral-500 mb-1">
      {title}
    </p>
    <p className="text-lg font-medium">{value}</p>
    <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>
  </div>
);

const Overview = () => (
  <p className="text-sm text-neutral-600">
    Your Eminence account gives you priority access, loyalty rewards,
    and a seamless experience from purchase to wear.
  </p>
);

const Orders = () => (
  <p className="text-sm text-neutral-600">
    You haven’t placed any orders yet. Your first Eminence piece is waiting.
  </p>
);

const Wishlist = () => (
  <p className="text-sm text-neutral-600">
    Save pieces you love and revisit them anytime.
  </p>
);

const Loyalty = () => (
  <p className="text-sm text-neutral-600">
    Earn points with every purchase and unlock elevated benefits.
  </p>
);

const Referrals = () => (
  <p className="text-sm text-neutral-600">
    Share Eminence with friends and receive exclusive rewards.
  </p>
);

const Settings = () => (
  <p className="text-sm text-neutral-600">
    Manage your personal details and preferences.
  </p>
);
