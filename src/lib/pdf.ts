import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateReport(result: PredictionResponse) {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("GreenPermit AI", 14, 18);

  doc.setFontSize(12);
  doc.text("Industrial Sustainability Report", 14, 26);

  autoTable(doc, {
    startY: 36,
    head: [["Pollutant", "Predicted Value"]],
    body: [
      ["PM10", result.pm10],
      ["PM2.5", result.pm25],
      ["SO₂", result.so2],
      ["NO₂", result.no2],
      ["CO", result.co],
      ["VOC", result.voc],
    ],
  });

  doc.save("GreenPermit_Report.pdf");
}