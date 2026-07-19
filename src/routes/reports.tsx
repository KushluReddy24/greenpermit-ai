import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { mockAssessments } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — GreenPermit AI" }, { name: "description", content: "Download compliance-ready PDF reports for your assessments." }] }),
  component: Reports,
});

function Reports() {
  const download = (name: string) => toast.success("Preparing PDF", { description: `${name} — report will download shortly.` });
  return (
    <div>
      <PageHeader title="Reports" subtitle="Regulator-ready PDF reports with predicted emissions, compliance, and AI recommendations." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mockAssessments.map((a) => (
          <div key={a.id} className="glass-card rounded-3xl p-6 flex items-start gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-brand shrink-0">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-foreground">{a.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{a.industry} · {a.equipment} · {a.date}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs rounded-full bg-primary/10 text-primary px-2.5 py-1 border border-primary/20">Eco {a.ecoScore}</span>
                <span className="text-xs rounded-full bg-secondary/10 text-secondary px-2.5 py-1 border border-secondary/20">{a.risk} risk</span>
                <span className="text-xs rounded-full bg-success/10 text-success px-2.5 py-1 border border-success/20">{a.compliance.compliant}/{a.compliance.total} compliant</span>
              </div>
            </div>
            <Button onClick={() => download(a.name)} className="gradient-brand text-primary-foreground">
              <Download className="mr-1 h-4 w-4" /> PDF
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}