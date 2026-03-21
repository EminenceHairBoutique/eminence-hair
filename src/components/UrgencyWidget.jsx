import { useState, useEffect, useRef } from "react";

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * UrgencyWidget — subtle luxury-style scarcity indicator.
 * - Viewers count: randomised 8–24, refreshed every 45–90 s
 * - Stock: uses stockCount prop if provided; otherwise randomised 2–7
 */
export default function UrgencyWidget({ stockCount }) {
  const [viewers, setViewers] = useState(() => randomBetween(8, 24));
  const [stock] = useState(() =>
    typeof stockCount === "number" && stockCount > 0
      ? stockCount
      : randomBetween(2, 7)
  );
  const intervalRef = useRef(null);

  useEffect(() => {
    const reschedule = () => {
      const delay = randomBetween(45000, 90000);
      intervalRef.current = setTimeout(() => {
        setViewers(randomBetween(8, 24));
        reschedule();
      }, delay);
    };
    reschedule();
    return () => clearTimeout(intervalRef.current);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-neutral-500 leading-snug">
      <span className="flex items-center gap-1.5">
        <span aria-hidden="true">🔥</span>
        <span>
          <strong className="text-neutral-700">{viewers}</strong> people viewing right now
        </span>
      </span>
      {stock <= 5 && (
        <span className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"
            aria-hidden="true"
          />
          Only <strong className="text-neutral-700">&nbsp;{stock}&nbsp;</strong> left in stock
        </span>
      )}
    </div>
  );
}
