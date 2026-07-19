import { motion } from "framer-motion";

export function EcoGauge({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 88;
  const circ = Math.PI * radius; // half circle
  const offset = circ - (clamped / 100) * circ;
  const color = clamped >= 75 ? "var(--success)" : clamped >= 55 ? "var(--warning)" : "var(--danger)";

  return (
    <div className="relative flex flex-col items-center">
      <svg width="220" height="130" viewBox="0 0 220 130">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.62 0.16 160)" />
            <stop offset="100%" stopColor="oklch(0.55 0.14 220)" />
          </linearGradient>
        </defs>
        <path d="M 22 110 A 88 88 0 0 1 198 110" fill="none" stroke="oklch(0.9 0.02 200)" strokeWidth="18" strokeLinecap="round" />
        <motion.path
          d="M 22 110 A 88 88 0 0 1 198 110"
          fill="none" stroke="url(#gaugeGrad)" strokeWidth="18" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </svg>
      <div className="-mt-14 text-center">
        <motion.div
          className="text-5xl font-bold gradient-text"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ color }}
        >
          {clamped}
        </motion.div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Eco Score</div>
      </div>
    </div>
  );
}