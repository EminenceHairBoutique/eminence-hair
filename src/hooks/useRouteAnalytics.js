import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useRouteAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Google Analytics / Meta / custom
    window?.gtag?.("event", "page_view", {
      page_path: location.pathname,
    });

    // console.log("Page view:", location.pathname);
  }, [location.pathname]);
}
