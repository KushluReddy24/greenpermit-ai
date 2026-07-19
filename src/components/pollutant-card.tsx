import { motion } from "framer-motion";
import type { Pollutant } from "@/lib/mock-data";

export function PollutantCard({ p, i = 0 }: { p: Pollutant; i?: number }) {
  const pct = Math.min(100, (p.value / p.limit) * 100);
  const status = pct < 60 ? "safe" : pct < 90 ? "watch" : "exceed";
  const color = status === "safe" ? "var(--success)" : status === "watch" ? "var(--warning)" : "var(--danger)";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
      className="glass-card rounded-2xl p-4"
    >
      <div className="flex items-baseline justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{p.label}</div>
        <div className="text-[10px] uppercase tracking-widest" style={{ color }}>
          {status === "safe" ? "Safe" : status === "watch" ? "Watch" : "Exceeded"}
        </div>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-2xl font-bold text-foreground">{p.value}</span>
        <span className="text-xs text-muted-foreground">{p.unit}</span>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, delay: i * 0.05 }}
          className="h-full rounded-full" style={{ backgroundColor: color }}
        />
      </div>
      <div className="mt-1 text-[10px] text-muted-foreground">Limit: {p.limit} {p.unit}</div>
    </motion.div>
  );
}