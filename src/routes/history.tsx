import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { mockAssessments } from "@/lib/mock-data";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "Assessment History — GreenPermit AI" }, { name: "description", content: "Browse and revisit past environmental assessments." }] }),
  component: History,
});

function History() {
  return (
    <div>
      <PageHeader title="Assessment History" subtitle="Every assessment you've run — searchable, auditable." />
      <div className="glass-card rounded-3xl p-2 md:p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Eco Score</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Compliance</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAssessments.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.name}</TableCell>
                <TableCell>{a.industry}</TableCell>
                <TableCell>{a.date}</TableCell>
                <TableCell><span className="font-bold gradient-text">{a.ecoScore}</span></TableCell>
                <TableCell><span className="text-xs rounded-full border border-border px-2 py-0.5">{a.risk}</span></TableCell>
                <TableCell>{a.compliance.compliant}/{a.compliance.total}</TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="sm"><Link to="/results">Open <ArrowRight className="ml-1 h-3 w-3" /></Link></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}