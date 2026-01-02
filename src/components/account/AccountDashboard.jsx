import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Crown,
  Receipt,
  Sparkles,
  Gift,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { supabase } from "../../lib/supabaseClient";
import { useUser } from "../../context/UserContext";
import { LOYALTY, nextTierInfo, tierForSpendCents } from "../../utils/loyalty";
import { Button } from "../ui/button";

const money = (cents) => {
  const dollars = Number(cents || 0) / 100;
  return `$${dollars.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const niceDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
};

export default function AccountDashboard() {
  const { user, logout } = useUser();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  // Load profile + recent orders
  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!user?.id) return;

      setLoading(true);
      setError("");

      try {
        // 1) Profile
        let { data: prof, error: profErr } = await supabase
          .from("profiles")
          .select("id, email, loyalty_points, lifetime_spend_cents, first_purchase_bonus_awarded")
          .eq("id", user.id)
          .maybeSingle();

        // If no profile row exists yet, create one (RLS must allow insert of own row).
        if (!prof && !profErr) {
          const { error: insErr } = await supabase.from("profiles").insert({
            id: user.id,
            email: user.email || null,
            loyalty_points: 0,
            lifetime_spend_cents: 0,
            first_purchase_bonus_awarded: false,
          });

          if (!insErr) {
            const refetch = await supabase
              .from("profiles")
              .select(
                "id, email, loyalty_points, lifetime_spend_cents, first_purchase_bonus_awarded"
              )
              .eq("id", user.id)
              .maybeSingle();
            prof = refetch.data || null;
            profErr = refetch.error || null;
          }
        }

        // 2) Orders (tries user_id first; falls back to email if needed)
        let ordersQuery = supabase
          .from("orders")
          .select("order_number, created_at, amount_total, currency, status")
          .order("created_at", { ascending: false })
          .limit(12);

        ordersQuery = ordersQuery.eq("user_id", user.id);

        let { data: ord, error: ordErr } = await ordersQuery;

        if (ordErr && user.email) {
          // Some older schemas may not have user_id wired. Fallback to email.
          const fallback = await supabase
            .from("orders")
            .select("order_number, created_at, amount_total, currency, status")
            .eq("email", user.email)
            .order("created_at", { ascending: false })
            .limit(12);
          ord = fallback.data || [];
          ordErr = fallback.error || null;
        }

        if (!cancelled) {
          if (profErr) setError(profErr.message || "Failed to load profile.");
          if (ordErr) setError((prev) => prev || ordErr.message || "Failed to load orders.");
          setProfile(prof || null);
          setOrders(ord || []);
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || "Something went wrong.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.email]);

  const lifetimeSpendCents = useMemo(() => {
    // Prefer stored lifetime spend, fallback to sum of loaded orders.
    if (profile?.lifetime_spend_cents != null) return Number(profile.lifetime_spend_cents || 0);
    return orders.reduce((sum, o) => sum + Number(o.amount_total || 0), 0);
  }, [profile, orders]);

  const points = useMemo(() => Number(profile?.loyalty_points || 0), [profile]);
  const tier = useMemo(() => tierForSpendCents(lifetimeSpendCents), [lifetimeSpendCents]);
  const nextTier = useMemo(() => nextTierInfo(lifetimeSpendCents), [lifetimeSpendCents]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">My Account</p>
          <h1 className="text-2xl md:text-3xl font-light text-neutral-900 mt-2">
            Welcome back{user?.email ? `, ${user.email}` : ""}
          </h1>
          <p className="text-sm text-neutral-600 mt-2 max-w-xl">
            Your orders, loyalty status, and support — all in one place.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/private-consult"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 text-sm"
          >
            Private consult <ChevronRight className="w-4 h-4" />
          </Link>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={logout}
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center gap-2 text-neutral-500 text-xs uppercase tracking-[0.22em]">
            <Crown className="w-4 h-4" /> Membership
          </div>
          <div className="mt-3 text-lg font-medium text-neutral-900">{tier.name}</div>
          <div className="mt-1 text-sm text-neutral-500">Tier based on lifetime spend</div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center gap-2 text-neutral-500 text-xs uppercase tracking-[0.22em]">
            <Sparkles className="w-4 h-4" /> Points
          </div>
          <div className="mt-3 text-lg font-medium text-neutral-900">
            {loading ? "—" : points.toLocaleString()}
          </div>
          <div className="mt-1 text-sm text-neutral-500">Earned from verified purchases</div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center gap-2 text-neutral-500 text-xs uppercase tracking-[0.22em]">
            <Receipt className="w-4 h-4" /> Lifetime spend
          </div>
          <div className="mt-3 text-lg font-medium text-neutral-900">
            {loading ? "—" : money(lifetimeSpendCents)}
          </div>
          <div className="mt-1 text-sm text-neutral-500">Used to calculate tier</div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center gap-2 text-neutral-500 text-xs uppercase tracking-[0.22em]">
            <Receipt className="w-4 h-4" /> Orders
          </div>
          <div className="mt-3 text-lg font-medium text-neutral-900">
            {loading ? "—" : orders.length}
          </div>
          <div className="mt-1 text-sm text-neutral-500">Recent purchases</div>
        </div>
      </div>

      {/* Loyalty */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Loyalty</p>
              <h2 className="text-xl font-light text-neutral-900 mt-2">Eminence Rewards</h2>
              <p className="text-sm text-neutral-600 mt-2">
                Earn <span className="font-medium">{LOYALTY.pointsPerDollar} point</span> per $1. First
                purchase bonus: <span className="font-medium">{LOYALTY.firstPurchaseBonusPoints}</span>.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 border border-neutral-200 bg-neutral-50 text-xs">
              <Gift className="w-4 h-4" /> {tier.name}
            </div>
          </div>

          <div className="mt-6">
            {nextTier.next ? (
              <>
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                  <span>
                    Next: <span className="text-neutral-800 font-medium">{nextTier.next.name}</span>
                  </span>
                  <span>{money(nextTier.remainingCents)} to go</span>
                </div>

                <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full bg-neutral-900"
                    style={{ width: `${Math.round(nextTier.progress * 100)}%` }}
                  />
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
                You’re at our highest tier. Enjoy the VIP treatment.
              </div>
            )}
          </div>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.22em] text-neutral-500 mb-3">Your perks</p>
            <ul className="space-y-2 text-sm text-neutral-700">
              {tier.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-neutral-900" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/authenticity"
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm hover:bg-neutral-50"
            >
              Authenticity
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm hover:bg-neutral-50"
            >
              Support
            </Link>
          </div>
        </div>

        {/* Orders */}
        <div className="lg:col-span-7 rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Orders</p>
              <h2 className="text-xl font-light text-neutral-900 mt-2">Recent purchases</h2>
            </div>
            <Link to="/shop" className="text-sm text-neutral-700 hover:text-neutral-900">
              Shop <ChevronRight className="inline w-4 h-4" />
            </Link>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="space-y-3">
                <div className="h-14 rounded-xl bg-neutral-100 animate-pulse" />
                <div className="h-14 rounded-xl bg-neutral-100 animate-pulse" />
                <div className="h-14 rounded-xl bg-neutral-100 animate-pulse" />
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-700">
                No orders yet. When you place your first order, you’ll see it here.
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div
                    key={o.order_number || o.created_at}
                    className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 px-4 py-3"
                  >
                    <div>
                      <div className="text-sm font-medium text-neutral-900">
                        Order {o.order_number || "—"}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">
                        {niceDate(o.created_at)} · {String(o.status || "paid").toUpperCase()}
                      </div>
                    </div>

                    <div className="text-sm text-neutral-900">
                      {money(o.amount_total)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
