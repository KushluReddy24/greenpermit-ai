import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { CheckCircle2, Download, GitCompareArrows, Sparkles } from "lucide-react";
import { EcoGauge } from "@/components/eco-gauge";
import { PollutantCard } from "@/components/pollutant-card";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { generateReport } from "@/lib/pdf";

import { usePredictionStore } from "@/store/predictionStore";
export const Route = createFileRoute("/results")({
  head: () => ({ meta: [{ title: "Assessment Results — GreenPermit AI" }, { name: "description", content: "AI-predicted emissions, sustainability score, and compliance for your latest assessment." }] }),
  component: Results,
});

function Results() {
  const prediction = usePredictionStore((state) => state.prediction);

if (!prediction) {
  
  return (
    <div className="p-10 text-center">
      <h2 className="text-2xl font-bold">No Assessment Found</h2>
      <p className="text-muted-foreground mt-2">
        Please complete an assessment first.
      </p>

      <Button asChild className="mt-6">
        <Link to="/new-assessment">
          New Assessment
        </Link>
      </Button>
    </div>
  );
}
const a = {
  industry: prediction.industry,
  equipment: prediction.equipment,
  fuel: prediction.fuel,

  ecoScore: prediction.ecoScore,
risk: prediction.risk,
confidence: prediction.confidence,
recommendations: prediction.recommendations,

  pollutants: [
    {
      key: "pm10",
      label: "PM10",
      value: prediction.pm10,
      limit: 100,
      unit: "µg/m³",
    },
    {
      key: "pm25",
      label: "PM2.5",
      value: prediction.pm25,
      limit: 60,
      unit: "µg/m³",
    },
    {
      key: "so2",
      label: "SO₂",
      value: prediction.so2,
      limit: 80,
      unit: "µg/m³",
    },
    {
      key: "no2",
      label: "NO₂",
      value: prediction.no2,
      limit: 80,
      unit: "µg/m³",
    },
    {
      key: "co",
      label: "CO",
      value: prediction.co,
      limit: 10,
      unit: "mg/m³",
    },
    {
      key: "voc",
      label: "VOC",
      value: prediction.voc,
      limit: 5,
      unit: "mg/m³",
    },
  ],
};
  const radarData = a.pollutants.map((p) => ({ pollutant: p.label, value: Math.round((p.value / p.limit) * 100) }));
  const barData = [
  { name: "PM10", v: prediction.pm10 },
  { name: "PM2.5", v: prediction.pm25 },
  { name: "SO₂", v: prediction.so2 },
  { name: "NO₂", v: prediction.no2 },
  { name: "CO", v: prediction.co },
  { name: "VOC", v: prediction.voc },
];
console.log(barData);



  return (
    <div>
      <PageHeader
        title="Assessment Results"
        subtitle={`${a.industry} · ${a.equipment} · ${a.fuel}`}
        actions={
          <>
            <Button asChild variant="outline"><Link to="/comparison"><GitCompareArrows className="mr-1 h-4 w-4" /> Compare</Link></Button>
            <Button asChild className="gradient-brand text-primary-foreground"><Link to="/reports"><Download className="mr-1 h-4 w-4" /> Export</Link></Button>
            <Button onClick={() => generateReport(prediction)}>
    Download Report
</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center">
  <EcoGauge score={a.ecoScore} />

  <div className="mt-2 text-sm text-muted-foreground">
    Predicted sustainability score
  </div>

  <div className="mt-4 text-center">
    <div className="text-sm text-muted-foreground">
      Risk Level
    </div>

    <div
      className={`mt-1 text-xl font-bold ${
        a.risk === "LOW"
          ? "text-green-600"
          : a.risk === "MEDIUM"
          ? "text-yellow-600"
          : "text-red-600"
      }`}
    >
      {a.risk}
    </div>

    <div className="mt-2 text-sm text-muted-foreground">
      Confidence: {(a.confidence * 100).toFixed(0)}%
    </div>
  </div>
</div>

        <div className="glass-card rounded-3xl p-6 lg:col-span-2">
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Pollutant vs Regulatory Limit</div>
          <ResponsiveContainer width="100%" height={260}>
  <BarChart data={barData}>
    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.02 200)" />
    <XAxis
      dataKey="name"
      stroke="oklch(0.5 0.03 210)"
      fontSize={12}
    />
    <YAxis
      stroke="oklch(0.5 0.03 210)"
      fontSize={12}
    />
    <Tooltip
      contentStyle={{
        borderRadius: 12,
        border: "1px solid oklch(0.9 0.02 200)",
      }}
    />
    <Bar
      dataKey="v"
      fill="oklch(0.55 0.14 220)"
      radius={[8, 8, 0, 0]}
    />
  </BarChart>
</ResponsiveContainer>
            
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {a.pollutants.map((p, i) => <PollutantCard key={p.key} p={p} i={i} />)}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-3xl p-6">
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Annual Emissions (tonnes)</div>
          <ResponsiveContainer width="100%" height={260}>
            
             <BarChart data={barData}></BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">AI Recommendations</div>
          </div>
           <div className="space-y-3">
  {a.recommendations.map((r, i) => (
    <motion.div
      key={r.title}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.08 }}
      className="rounded-2xl border border-border/60 p-4 bg-background/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="font-semibold">{r.title}</div>

        <span className="text-xs font-bold text-success">
          {r.impact}
        </span>
      </div>

      <div className="text-sm text-muted-foreground mt-1">
        {r.detail}
      </div>
    </motion.div>
  ))}
</div>
          
          <div className="mt-4 flex items-center gap-2 text-sm text-success">
            <CheckCircle2 className="h-4 w-4" /> Model confidence: {(a.confidence * 100).toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
}