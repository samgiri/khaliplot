"use client";

import { useState } from "react";

const BROKER_PCT = 0.08; // 8% typical broker (both sides combined skew higher)
const INVESTOR_PCT = 0.03; // 3% typical investor-aggregator
const KHALIPLOT_FEE = 499;

/** Format a rupee amount as ₹X Cr / ₹Y Lakh / ₹Z. */
function formatINR(amount: number): string {
  if (amount >= 1_00_00_000) return `₹${(amount / 1_00_00_000).toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`;
  if (amount >= 1_00_000) return `₹${(amount / 1_00_000).toLocaleString("en-IN", { maximumFractionDigits: 2 })} Lakh`;
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

export default function SavingsCalculator() {
  const [priceLakh, setPriceLakh] = useState("50");

  const price = Number(priceLakh) * 1_00_000;
  const valid = priceLakh !== "" && Number.isFinite(price) && price > 0;

  const brokerCost = price * BROKER_PCT;
  const investorCost = price * INVESTOR_PCT;
  const saveVsBroker = Math.max(0, brokerCost - KHALIPLOT_FEE);
  const saveVsInvestor = Math.max(0, investorCost - KHALIPLOT_FEE);

  return (
    <div className="rounded-xl border-2 border-navy bg-white p-6 shadow-[6px_6px_0_0_var(--color-amber)] sm:p-8">
      <label htmlFor="calc-price" className="coord-label text-navy/60">
        Your plot price (₹ Lakh)
      </label>
      <div className="mt-1.5 flex items-center gap-2">
        <span className="font-display text-lg font-bold text-navy">₹</span>
        <input
          id="calc-price"
          type="number"
          min={0}
          inputMode="numeric"
          value={priceLakh}
          onChange={(e) => setPriceLakh(e.target.value)}
          className="w-40 rounded-md border border-line bg-white px-3 py-2.5 text-lg font-bold text-navy focus:border-green-bright"
        />
        <span className="text-sm text-muted">Lakh</span>
      </div>

      {valid ? (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-paper-dim px-4 py-3">
            <span className="text-sm text-ink">Broker (8% commission)</span>
            <span className="font-display font-bold text-red">−{formatINR(brokerCost)}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-paper-dim px-4 py-3">
            <span className="text-sm text-ink">Investor (3% commission)</span>
            <span className="font-display font-bold text-red">−{formatINR(investorCost)}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-green-bright bg-green-pale px-4 py-3">
            <span className="text-sm font-semibold text-navy">KhaliPlot (₹499, ₹0 commission)</span>
            <span className="font-display font-bold text-green">−₹499</span>
          </div>

          <div className="mt-4 rounded-lg bg-navy px-5 py-4 text-center text-paper">
            <p className="coord-label text-green-bright">You save vs a broker</p>
            <p className="mt-1 font-display text-3xl font-bold">{formatINR(saveVsBroker)}</p>
            <p className="mt-1 text-sm text-paper/70">
              and {formatINR(saveVsInvestor)} vs an investor
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted">Enter a plot price to see how much you keep.</p>
      )}
    </div>
  );
}
