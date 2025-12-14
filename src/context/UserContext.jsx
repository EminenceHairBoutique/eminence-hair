import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";


const UserContext = createContext();

/* =========================
   Base User Shape
========================= */

const EMPTY_USER = {
  id: null,
  name: "",
  email: "",
  phone: "",
  loyaltyPoints: 0,
  orders: [],
  wishlist: [],
  address: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  },
  referrals: {
    code: "",
    referredCount: 0,
    rewardBalance: 0,
  },
  createdAt: null,
};

/* =========================
   Helpers
========================= */

const generateReferralCode = (idOrEmail = "") => {
  const base =
    idOrEmail.replace(/[^A-Za-z0-9]/g, "").slice(-5).toUpperCase() ||
    Date.now().toString().slice(-5);
  return `EMINENCE-${base}`;
};

const hydrateUser = (raw) => {
  if (!raw) return null;

  const mergedAddress = {
    ...EMPTY_USER.address,
    ...(raw.address || {}),
  };

  const mergedReferrals = {
    ...EMPTY_USER.referrals,
    ...(raw.referrals || {}),
  };

  if (!mergedReferrals.code) {
    mergedReferrals.code = generateReferralCode(raw.id || raw.email || "");
  }

  return {
    ...EMPTY_USER,
    ...raw,
    address: mergedAddress,
    referrals: mergedReferrals,
    createdAt: raw.createdAt || new Date().toISOString(),
  };
};

/* =========================
   Provider
========================= */

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------- SESSION HYDRATION ---------- */
  useEffect(() => {
    let mounted = true;
    let subscriptionRef = null;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const supaUser = data?.session?.user;
        if (!mounted) return;
        if (supaUser) {
          setUser(
            hydrateUser({
              id: supaUser.id,
              email: supaUser.email,
              name: supaUser.user_metadata?.full_name || "",
            })
          );
        } else {
          setUser(null);
        }
      } catch (err) {
        // ignore - keep user null
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const res = supabase.auth.onAuthStateChange((_event, session) => {
      const supaUser = session?.user;
      if (!mounted) return;
      if (supaUser) {
        setUser(
          hydrateUser({
            id: supaUser.id,
            email: supaUser.email,
            name: supaUser.user_metadata?.full_name || "",
          })
        );
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // handle different return shapes across supabase clients
    subscriptionRef = res?.data?.subscription ?? res?.subscription ?? res?.data;

    return () => {
      mounted = false;
      if (subscriptionRef) {
        if (typeof subscriptionRef.unsubscribe === "function") {
          subscriptionRef.unsubscribe();
        } else if (typeof subscriptionRef.remove === "function") {
          subscriptionRef.remove();
        }
      }
    };
  }, []);

  /* =========================
     AUTH METHODS (REAL)
  ========================= */

  const register = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  /* =========================
     PROFILE / COMMERCE LOGIC
     (UNCHANGED FROM YOUR WORK)
  ========================= */

  const addOrder = (order) => {
    setUser((prev) => {
      if (!prev) return prev;
      const orderWithDefaults = {
        id: order.id || Date.now().toString(),
        createdAt: order.createdAt || new Date().toISOString(),
        status: order.status || "Processing",
        items: order.items || [],
        total: order.total || 0,
      };
      return {
        ...prev,
        orders: [orderWithDefaults, ...(prev.orders || [])],
        loyaltyPoints:
          (prev.loyaltyPoints || 0) +
          Math.round((orderWithDefaults.total || 0) / 10),
      };
    });
  };

  const addLoyaltyPoints = (points) => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        loyaltyPoints: (prev.loyaltyPoints || 0) + (points || 0),
      };
    });
  };

  const updateProfile = (updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      return hydrateUser({
        ...prev,
        ...updates,
        address: {
          ...(prev.address || EMPTY_USER.address),
          ...(updates.address || {}),
        },
      });
    });
  };

  const toggleWishlistItem = (item) => {
    setUser((prev) => {
      if (!prev) return prev;
      const wishlist = prev.wishlist || [];
      const exists = wishlist.find((p) => p.id === item.id);
      return {
        ...prev,
        wishlist: exists
          ? wishlist.filter((p) => p.id !== item.id)
          : [...wishlist, item],
      };
    });
  };

  /* ========================= */

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        loginWithGoogle,
        logout,
        addOrder,
        addLoyaltyPoints,
        updateProfile,
        toggleWishlistItem,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
