// src/context/UserContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

const EMPTY_USER = {
  id: null,
  name: "",
  email: "",
  password: "",
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
    mergedReferrals.code = generateReferralCode(raw.id || raw.email);
  }

  return {
    ...EMPTY_USER,
    ...raw,
    address: mergedAddress,
    referrals: mergedReferrals,
    createdAt: raw.createdAt || new Date().toISOString(),
  };
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("eminence_user");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return hydrateUser(parsed);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("eminence_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("eminence_user");
    }
  }, [user]);

  const register = ({ name, email, password }) => {
    const newUser = {
      ...EMPTY_USER,
      id: Date.now().toString(),
      name,
      email,
      password: password || "",
      loyaltyPoints: 50, // signup bonus
      orders: [],
      wishlist: [],
      createdAt: new Date().toISOString(),
    };
    newUser.referrals.code = generateReferralCode(newUser.id || newUser.email);
    setUser(newUser);
  };

  const login = ({ email, password }) => {
    const stored = localStorage.getItem("eminence_user");
    if (stored) {
      const parsed = hydrateUser(JSON.parse(stored));
      if (parsed && parsed.email === email) {
        // simple password check (frontend only; replace with real backend later)
        if (!parsed.password || !password || parsed.password === password) {
          setUser(parsed);
          return true;
        }
        return false;
      }
    }

    // fallback: create a minimal user
    const fallbackUser = {
      ...EMPTY_USER,
      id: Date.now().toString(),
      name: email.split("@")[0],
      email,
      loyaltyPoints: 0,
      createdAt: new Date().toISOString(),
    };
    fallbackUser.referrals.code = generateReferralCode(
      fallbackUser.id || fallbackUser.email
    );
    setUser(fallbackUser);
    return true;
  };

  const logout = () => setUser(null);

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
      const updated = {
        ...prev,
        orders: [orderWithDefaults, ...(prev.orders || [])],
        loyaltyPoints:
          (prev.loyaltyPoints || 0) +
          Math.round((orderWithDefaults.total || 0) / 10),
      };
      return updated;
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
    if (!user) return;
    const mergedAddress = {
      ...(user.address || EMPTY_USER.address),
      ...(updates.address || {}),
    };
    const updated = {
      ...user,
      ...updates,
      address: mergedAddress,
    };
    setUser(updated);
  };

  const updatePassword = (currentPassword, newPassword) => {
    if (!user) return false;
    if (user.password && user.password !== currentPassword) {
      return false;
    }
    const updated = {
      ...user,
      password: newPassword || "",
    };
    setUser(updated);
    return true;
  };

  const toggleWishlistItem = (item) => {
    if (!user) return;
    const wishlist = user.wishlist || [];
    const exists = wishlist.find((p) => p.id === item.id);
    const updatedWishlist = exists
      ? wishlist.filter((p) => p.id !== item.id)
      : [...wishlist, item];

    setUser({
      ...user,
      wishlist: updatedWishlist,
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        addOrder,
        addLoyaltyPoints,
        updateProfile,
        updatePassword,
        toggleWishlistItem,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
