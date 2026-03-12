import React from "react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import SEO from "../components/SEO";

export default function NotFound() {
  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
        noindex={true}
      />
      <PageTransition>
      <div className="min-h-[70vh] bg-[#FBF6ED] pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">
            404
          </p>
          <h1 className="mt-4 text-4xl md:text-5xl font-light font-display">
            This page doesn’t exist.
          </h1>
          <p className="mt-6 text-neutral-700 leading-relaxed max-w-xl mx-auto">
            The link you followed may be outdated, or the page has moved. Use the options below to continue.
          </p>

          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <Link
              to="/shop"
              className="px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] bg-neutral-900 text-[#FBF6EE] hover:bg-black"
            >
              Shop
            </Link>
            <Link
              to="/collections"
              className="px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 hover:bg-neutral-900 hover:text-[#FBF6EE]"
            >
              Collections
            </Link>
            <Link
              to="/start-here"
              className="px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-300 bg-white/60 hover:bg-white"
            >
              Start Here
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
    </>
  );
}
