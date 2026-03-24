/**
 * Generate the next order number using a Postgres sequence for atomicity.
 *
 * Requires the SUPABASE_ORDER_SEQUENCE.sql migration to have been applied.
 * Falls back to a timestamp-based ID if the sequence/function is not yet
 * deployed, so the webhook handler can still save orders during a rolling deploy.
 *
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @returns {Promise<string>} e.g. "EM-100001-3847"
 */
export async function generateOrderNumber(supabase) {
  try {
    const { data, error } = await supabase.rpc("next_order_number");
    if (error) throw error;
    if (typeof data === "string" && data.startsWith("EM-")) return data;
    throw new Error("Unexpected return value from next_order_number()");
  } catch (err) {
    // Fallback: timestamp-based ID (non-atomic, but safe as last resort).
    // Log a warning so ops can see the sequence is not yet installed.
    console.warn(
      "⚠️  generateOrderNumber: falling back to timestamp ID — " +
        "apply SUPABASE_ORDER_SEQUENCE.sql to enable atomic sequence. " +
        "Error: " + (err?.message || err)
    );
    const ts = Date.now();
    return `EM-${ts}-${String(ts).slice(-4)}`;
  }
}
