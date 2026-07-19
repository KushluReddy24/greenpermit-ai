import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — GreenPermit AI" }, { name: "description", content: "Organization, API, and notification preferences." }] }),
  component: Settings,
});

function Settings() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your organization, API keys, and preferences." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="glass-card rounded-3xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Organization</h2>
          <div className="space-y-1.5"><Label>Company name</Label><Input defaultValue="Terraform Cement Ltd." /></div>
          <div className="space-y-1.5"><Label>Site location</Label><Input defaultValue="Gujarat, India" /></div>
          <div className="space-y-1.5"><Label>Regulator</Label><Input defaultValue="Central Pollution Control Board (CPCB)" /></div>
        </section>

        <section className="glass-card rounded-3xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Backend Integration</h2>
          <div className="space-y-1.5"><Label>FastAPI endpoint</Label><Input placeholder="https://api.greenpermit.ai" /></div>
          <div className="space-y-1.5"><Label>API key</Label><Input type="password" placeholder="sk-•••••••••••••••" /></div>
          <p className="text-xs text-muted-foreground">Currently using mock data. Configure your FastAPI backend to enable live predictions.</p>
        </section>

        <section className="glass-card rounded-3xl p-6 space-y-4 lg:col-span-2">
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          <Toggle label="Alert on non-compliance" desc="Email me when any pollutant exceeds regulatory limits." defaultOn />
          <Toggle label="Weekly summary report" desc="Send a rolled-up PDF every Monday." defaultOn />
          <Toggle label="AI recommendation digest" desc="Notify me when new optimization opportunities are detected." />
        </section>

        <div className="lg:col-span-2 flex justify-end">
          <Button onClick={() => toast.success("Settings saved")} className="gradient-brand text-primary-foreground shadow-[var(--shadow-glow)]">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, desc, defaultOn }: { label: string; desc: string; defaultOn?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-border/50 last:border-0">
      <div>
        <div className="font-medium text-foreground">{label}</div>
        <div className="text-sm text-muted-foreground">{desc}</div>
      </div>
      <Switch defaultChecked={defaultOn} />
    </div>
  );
}