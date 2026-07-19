import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { mockAssessments } from "@/lib/mock-data";

export const Route = createFileRoute("/comparison")({
  head: () => ({ meta: [{ title: "Scenario Comparison — GreenPermit AI" }, { name: "description", content: "Compare two assessment scenarios side-by-side." }] }),
  component: Comparison,
});

function Comparison() {
  const [aId, setA] = useState("a-001");
  const [bId, setB] = useState("a-002");
  const A = mockAssessments.find((x) => x.id === aId)!;
  const B = mockAssessments.find((x) => x.id === bId)!;

  const rows = A.pollutants.map((p, i) => {
    const bv = B.pollutants[i].value;
    const delta = bv - p.value;
    const pct = p.value ? ((delta / p.value) * 100) : 0;
    return { name: p.label, A: p.value, B: bv, delta, pct, unit: p.unit };
  });

  return (
    <div>
      <PageHeader title="Scenario Comparison" subtitle="Side-by-side impact of two assessments — quantify what changes." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="glass-card rounded-2xl p-4">
          <Label className="text-xs uppercase tracking-widest text-muted-foreground">Scenario A</Label>
          <Select value={aId} onValueChange={setA}>
            <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
            <SelectContent>{mockAssessments.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
          </Select>
          <div className="mt-3 flex items-center gap-4">
            <div><div className="text-2xl font-bold gradient-text">{A.ecoScore}</div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Eco Score</div></div>
            <div><div className="text-2xl font-bold text-foreground">{A.risk}</div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Risk</div></div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <Label className="text-xs uppercase tracking-widest text-muted-foreground">Scenario B</Label>
          <Select value={bId} onValueChange={setB}>
            <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
            <SelectContent>{mockAssessments.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
          </Select>
          <div className="mt-3 flex items-center gap-4">
            <div><div className="text-2xl font-bold gradient-text">{B.ecoScore}</div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Eco Score</div></div>
            <div><div className="text-2xl font-bold text-foreground">{B.risk}</div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Risk</div></div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Pollutant Comparison</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.02 200)" />
            <XAxis dataKey="name" stroke="oklch(0.5 0.03 210)" fontSize={12} />
            <YAxis stroke="oklch(0.5 0.03 210)" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.9 0.02 200)" }} />
            <Legend />
            <Bar dataKey="A" name={A.name} fill="oklch(0.55 0.14 220)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="B" name={B.name} fill="oklch(0.62 0.16 160)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {rows.map((r) => {
          const better = r.pct < 0;
          return (
            <div key={r.name} className="glass-card rounded-2xl p-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{r.name}</div>
              <div className={`mt-2 flex items-center gap-1 text-lg font-bold ${better ? "text-success" : "text-danger"}`}>
                {better ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                {Math.abs(r.pct).toFixed(1)}%
              </div>
              <div className="text-[11px] text-muted-foreground">{r.A} → {r.B} {r.unit}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}