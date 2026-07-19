import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Factory, Fuel, Gauge, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { industries, equipmentTypes, fuels, capacityUnits, fuelUnits, apcds } from "@/lib/mock-data";
import { predictAssessment } from "@/services/api";
import { usePredictionStore } from "@/store/predictionStore";
export const Route = createFileRoute("/new-assessment")({
  head: () => ({ meta: [{ title: "New Assessment — GreenPermit AI" }, { name: "description", content: "Create a new environmental impact assessment." }] }),
  component: NewAssessment,
});

const steps = [
  { id: 0, title: "Facility", icon: Factory },
  { id: 1, title: "Operations", icon: Gauge },
  { id: 2, title: "Fuel", icon: Fuel },
  { id: 3, title: "Controls", icon: ShieldCheck },
];

function NewAssessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [f, setF] = useState({
    industry: "Cement Manufacturing",
    equipment: "Rotary Kiln",
    fuel: "Pet Coke",
    ratedCapacity: "120",
    capacityUnit: "TPH",
    operatingHours: "20",
    daysPerYear: "330",
    loadFactor: "0.85",
    fuelConsumption: "3200",
    fuelUnit: "kg/h",
    apcd: "ESP",
    cems: true,
  });
  const set = (k: keyof typeof f) => (v: string | boolean) => setF({ ...f, [k]: v as never });
  const setPrediction = usePredictionStore(
  (state) => state.setPrediction );
  const next = () => (step < steps.length - 1 ? setStep(step + 1) : submit());
  const submit = async () => {
  try {
    toast.loading("Running AI prediction...", {
      id: "prediction",
    });

    const result = await predictAssessment({
      industry: f.industry,
      equipment: f.equipment,
      fuel: f.fuel,
      ratedCapacity: Number(f.ratedCapacity),
      capacityUnit: f.capacityUnit,
      operatingHours: Number(f.operatingHours),
      daysPerYear: Number(f.daysPerYear),
      loadFactor: Number(f.loadFactor),
      fuelConsumption: Number(f.fuelConsumption),
      fuelUnit: f.fuelUnit,
      apcd: f.apcd,
      cems: f.cems,
    });

    setPrediction(result);

    toast.success("Assessment Complete", {
      id: "prediction",
    });

    navigate({
      to: "/results",
    });
  } catch (err) {
    console.error(err);

    toast.error("Prediction Failed", {
      id: "prediction",
    });
  }
};

  return (
    <div>
      <PageHeader title="New Assessment" subtitle="Enter facility data to predict emissions and compliance." />

      <div className="glass-card rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex-1 flex items-center">
              <div className={`flex items-center gap-2 ${i === step ? "text-foreground" : i < step ? "text-success" : "text-muted-foreground"}`}>
                <div className={`grid h-9 w-9 place-items-center rounded-xl border ${i === step ? "gradient-brand text-primary-foreground border-transparent shadow-[var(--shadow-glow)]" : i < step ? "bg-success/15 border-success/30" : "bg-muted border-border"}`}>
                  {i < step ? <CheckCircle2 className="h-5 w-5" /> : <s.icon className="h-4 w-4" />}
                </div>
                <div className="hidden md:block">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Step {i + 1}</div>
                  <div className="text-sm font-semibold">{s.title}</div>
                </div>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 mx-3 h-px ${i < step ? "bg-success/40" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            {step === 0 && (
              <Grid>
                <Field label="Industry Type"><SelectField value={f.industry} onChange={set("industry")} options={industries} /></Field>
                <Field label="Equipment"><SelectField value={f.equipment} onChange={set("equipment")} options={equipmentTypes} /></Field>
              </Grid>
            )}
            {step === 1 && (
              <Grid>
                <Field label="Rated Capacity"><Input value={f.ratedCapacity} onChange={(e) => set("ratedCapacity")(e.target.value)} /></Field>
                <Field label="Capacity Unit"><SelectField value={f.capacityUnit} onChange={set("capacityUnit")} options={capacityUnits} /></Field>
                <Field label="Operating Hours / Day"><Input value={f.operatingHours} onChange={(e) => set("operatingHours")(e.target.value)} /></Field>
                <Field label="Days per Year"><Input value={f.daysPerYear} onChange={(e) => set("daysPerYear")(e.target.value)} /></Field>
                <Field label="Load Factor (0-1)"><Input value={f.loadFactor} onChange={(e) => set("loadFactor")(e.target.value)} /></Field>
              </Grid>
            )}
            {step === 2 && (
              <Grid>
                <Field label="Fuel Type"><SelectField value={f.fuel} onChange={set("fuel")} options={fuels} /></Field>
                <Field label="Fuel Consumption"><Input value={f.fuelConsumption} onChange={(e) => set("fuelConsumption")(e.target.value)} /></Field>
                <Field label="Fuel Unit"><SelectField value={f.fuelUnit} onChange={set("fuelUnit")} options={fuelUnits} /></Field>
              </Grid>
            )}
            {step === 3 && (
              <Grid>
                <Field label="Air Pollution Control Device (APCD)"><SelectField value={f.apcd} onChange={set("apcd")} options={apcds} /></Field>
                <Field label="Continuous Emissions Monitoring (CEMS)">
                  <div className="flex items-center gap-3 h-10">
                    <Switch checked={f.cems} onCheckedChange={(v) => set("cems")(v)} />
                    <span className="text-sm text-muted-foreground">{f.cems ? "Enabled" : "Not installed"}</span>
                  </div>
                </Field>
              </Grid>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          <Button onClick={next} className="gradient-brand text-primary-foreground shadow-[var(--shadow-glow)]">
            {step === steps.length - 1 ? "Run Assessment" : "Continue"} <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue /></SelectTrigger>
      <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
    </Select>
  );
}