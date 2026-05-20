import React from "react";
import { KpiCardsSummarySection } from "./KpiCardsSummarySection";
import { SalesTrendChartSection } from "./SalesTrendChartSection";
import { TopProductsTableSection } from "./TopProductsTableSection";

interface DashboardSection {
  id: string;
  label: string;
  component: React.ComponentType;
}

const dashboardSections: DashboardSection[] = [
  {
    id: "kpi-cards-summary-section",
    label: "KPI cards summary",
    component: KpiCardsSummarySection,
  },
  {
    id: "sales-trend-chart-section",
    label: "Sales trend chart",
    component: SalesTrendChartSection,
  },
  {
    id: "top-products-table-section",
    label: "Top products table",
    component: TopProductsTableSection,
  },
];

export const FrameScreen: React.FC = () => {
  return (
    <main
      className="relative mx-auto flex w-full max-w-7xl flex-col items-start gap-4 overflow-hidden p-4 md:gap-6 md:p-8"
      aria-label="Dashboard overview"
    >
      {dashboardSections.map(({ id, label, component: SectionComponent }) => (
        <section 
          key={id} 
          aria-label={label} 
          className="w-full"
        >
          <SectionComponent />
        </section>
      ))}
    </main>
  );
};

export default FrameScreen;