"use client";

import { useState, useTransition } from "react";
import { Check, Save } from "lucide-react";
import { updateOrderStatus } from "@/app/admin/actions";

const field =
  "w-full rounded-lg border border-sandalwood-light bg-cream px-3 py-2.5 text-sm outline-none focus:border-maroon-600";
const label = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-brown-700/55";

export function OrderStatusForm({
  id,
  status,
  paymentStatus,
  paymentMethod,
}: {
  id: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updateOrderStatus(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    });
  }

  return (
    <form
      action={handleSubmit}
      className="h-fit rounded-2xl border border-sandalwood-light bg-ivory p-5"
    >
      <input type="hidden" name="id" value={id} />
      <h2 className="mb-4 font-serif text-base text-maroon-900">Update status</h2>

      <div className="space-y-4">
        <div>
          <label className={label} htmlFor="status">Fulfilment</label>
          <select id="status" name="status" defaultValue={status} className={field}>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className={label} htmlFor="payment_status">Payment</label>
          <select
            id="payment_status"
            name="payment_status"
            defaultValue={paymentStatus}
            className={field}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <p className="mt-1.5 text-xs text-brown-700/55">
            Paid via {paymentMethod}. Only orders marked paid count towards revenue.
          </p>
        </div>

        {error && (
          <p className="rounded-lg bg-temple-red/10 px-3 py-2 text-xs text-temple-red">{error}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-maroon-600 px-5 py-2.5 text-sm font-semibold text-ivory hover:bg-maroon-700 disabled:opacity-60"
      >
        {saved ? <Check size={16} /> : <Save size={16} />}
        {pending ? "Saving…" : saved ? "Saved" : "Save"}
      </button>
    </form>
  );
}
