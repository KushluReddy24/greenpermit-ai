import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { AlertTriangle, ArrowRight, CheckCircle2, Sparkles, TrendingDown, Wind } from "lucide-react";
import { EcoGauge } from "@/components/eco-gauge";
import { PollutantCard } from "@/components/pollutant-card";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { mockAssessments, recommendations } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — GreenPermit AI" },
      { name: "description", content: "Live emissions, compliance, and AI recommendations for your industrial site." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const a = mockAssessments[0];
  return (
    <div>
      <PageHeader
        title="Sustainability Dashboard"
        subtitle="Real-time environmental performance across your industrial assets."
        actions={
          <Button asChild className="gradient-brand text-primary-foreground shadow-[var(--shadow-glow)]">
            <Link to="/new-assessment">New Assessment <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Overall Health</div>
            <RiskBadge risk={a.risk} />
          </div>
          <EcoGauge score={a.ecoScore} />
          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-success/10 border border-success/20 p-3">
              <div className="text-2xl font-bold text-success">{a.compliance.compliant}/{a.compliance.total}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Compliant</div>
            </div>
            <div className="rounded-xl bg-secondary/10 border border-secondary/20 p-3">
              <div className="text-2xl font-bold text-secondary">−18%</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">vs Last Qtr</div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-3xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Emissions Trend</div>
              <div className="text-lg font-semibold text-foreground">CO₂, NOx, SO₂ (last 8 months)</div>
            </div>
            <Wind className="h-5 w-5 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={a.emissionsSeries}>
              <defs>
                <linearGradient id="gCO2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.62 0.16 160)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.62 0.16 160)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gNOx" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.55 0.14 220)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.55 0.14 220)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.02 200)" />
              <XAxis dataKey="month" stroke="oklch(0.5 0.03 210)" fontSize={12} />
              <YAxis stroke="oklch(0.5 0.03 210)" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.9 0.02 200)", background: "oklch(1 0 0 / 0.95)" }} />
              <Legend />
              <Area type="monotone" dataKey="CO2" stroke="oklch(0.62 0.16 160)" strokeWidth={2} fill="url(#gCO2)" />
              <Area type="monotone" dataKey="NOx" stroke="oklch(0.55 0.14 220)" strokeWidth={2} fill="url(#gNOx)" />
              <Area type="monotone" dataKey="SO2" stroke="oklch(0.78 0.16 75)" strokeWidth={2} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="mt-6">
        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Pollutants</div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {a.pollutants.map((p, i) => <PollutantCard key={p.key} p={p} i={i} />)}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card rounded-3xl p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <div className="text-lg font-semibold text-foreground">AI Recommendations</div>
          </div>
          <div className="space-y-3">
            {recommendations.map((r, i) => (
              <motion.div key={r.title} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="glass-panel rounded-2xl p-4 flex items-start gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl gradient-brand shrink-0">
                  <TrendingDown className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold text-foreground">{r.title}</div>
                    <div className="text-xs font-bold text-success shrink-0">{r.impact}</div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">{r.detail}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Compliance Summary</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={a.pollutants.map(p => ({ name: p.label, value: Math.round((p.value / p.limit) * 100), limit: 100 }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.02 200)" />
              <XAxis dataKey="name" stroke="oklch(0.5 0.03 210)" fontSize={11} />
              <YAxis stroke="oklch(0.5 0.03 210)" fontSize={11} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.9 0.02 200)" }} formatter={(v) => `${v}% of limit`} />
              <Bar dataKey="value" fill="oklch(0.62 0.16 160)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-2">
            <ComplianceRow ok label="Air (CPCB)" />
            <ComplianceRow ok label="Water Consent" />
            <ComplianceRow label="Hazardous Waste Manifest" />
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const map: Record<string, string> = {
    Low: "bg-success/15 text-success border-success/30",
    Moderate: "bg-warning/15 text-[color:oklch(0.55_0.16_75)] border-warning/30",
    High: "bg-danger/15 text-danger border-danger/30",
    Critical: "bg-danger/25 text-danger border-danger/40",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${map[risk] || map.Moderate}`}>
      <AlertTriangle className="h-3 w-3" /> {risk} Risk
    </span>
  );
}
function ComplianceRow({ label, ok }: { label: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-foreground">{label}</span>
      {ok ? (
        <span className="inline-flex items-center gap-1 text-success"><CheckCircle2 className="h-4 w-4" /> Compliant</span>
      ) : (
        <span className="inline-flex items-center gap-1 text-warning"><AlertTriangle className="h-4 w-4" /> Review</span>
      )}
    </div>
  );
}