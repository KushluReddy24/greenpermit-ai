export type Pollutant = { key: string; label: string; value: number; unit: string; limit: number };

export type Assessment = {
  id: string;
  name: string;
  date: string;
  industry: string;
  equipment: string;
  fuel: string;
  ecoScore: number;
  risk: "Low" | "Moderate" | "High" | "Critical";
  pollutants: Pollutant[];
  compliance: { compliant: number; total: number };
  emissionsSeries: { month: string; CO2: number; NOx: number; SO2: number }[];
};

function mkAssessment(id: string, name: string, date: string, score: number, risk: Assessment["risk"], factor = 1): Assessment {
  const p = (v: number) => Math.round(v * factor * 10) / 10;
  return {
    id, name, date,
    industry: "Cement Manufacturing",
    equipment: "Rotary Kiln",
    fuel: "Pet Coke",
    ecoScore: score,
    risk,
    pollutants: [
      { key: "PM10", label: "PM10", value: p(48), unit: "µg/m³", limit: 100 },
      { key: "PM25", label: "PM2.5", value: p(32), unit: "µg/m³", limit: 60 },
      { key: "SO2", label: "SO₂", value: p(55), unit: "µg/m³", limit: 80 },
      { key: "NO2", label: "NO₂", value: p(62), unit: "µg/m³", limit: 80 },
      { key: "CO", label: "CO", value: p(1.8), unit: "mg/m³", limit: 4 },
      { key: "VOC", label: "VOC", value: p(120), unit: "µg/m³", limit: 200 },
    ],
    compliance: { compliant: risk === "Low" ? 6 : risk === "Moderate" ? 5 : 3, total: 6 },
    emissionsSeries: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"].map((m, i) => ({
      month: m,
      CO2: p(420 + Math.sin(i) * 40 + i * 6),
      NOx: p(58 + Math.cos(i) * 8 + i * 1.2),
      SO2: p(41 + Math.sin(i / 2) * 6),
    })),
  };
}

export const mockAssessments: Assessment[] = [
  mkAssessment("a-001", "Kiln Line 2 — Baseline", "2026-06-14", 72, "Moderate", 1),
  mkAssessment("a-002", "Kiln Line 2 — With SCR", "2026-06-28", 86, "Low", 0.6),
  mkAssessment("a-003", "Boiler House — Q2 Audit", "2026-05-02", 64, "Moderate", 1.15),
  mkAssessment("a-004", "Diesel Genset Backup", "2026-04-10", 48, "High", 1.5),
];

export const recommendations = [
  { title: "Install SCR on Kiln 2", impact: "-38% NOx", detail: "Selective catalytic reduction cuts NOx below CPCB limits with ~14 month payback." },
  { title: "Blend 15% Biomass Fuel", impact: "-22% CO₂", detail: "Partial substitution of pet coke with agri-residue reduces net CO₂ and SO₂." },
  { title: "Upgrade ESP to Bag Filter", impact: "-46% PM10", detail: "Fabric filter delivers <30 µg/m³ PM outlet — future-proofs compliance." },
  { title: "Enable Continuous CEMS", impact: "Compliance +2 params", detail: "Real-time reporting to SPCB dashboard avoids consent-to-operate risk." },
];

export const industries = ["Cement Manufacturing","Iron & Steel","Thermal Power","Petrochemicals","Textiles","Pulp & Paper","Sugar","Pharmaceuticals","Fertilizer"];
export const equipmentTypes = ["Rotary Kiln","Boiler","DG Set","Furnace","Reactor","Dryer","Calciner","Turbine"];
export const fuels = ["Pet Coke","Coal","Natural Gas","Diesel","Furnace Oil","Biomass","LPG"];
export const capacityUnits = ["TPH","MW","kg/h","m³/h"];
export const fuelUnits = ["kg/h","L/h","m³/h","tonnes/day"];
export const apcds = ["ESP","Bag Filter","Scrubber","SCR","SNCR","Cyclone","None"];