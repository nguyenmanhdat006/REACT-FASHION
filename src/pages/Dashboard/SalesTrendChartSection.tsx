import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LuChevronDown } from "react-icons/lu";
import { useEffect, useState } from 'react';
import dashboardService from '@/services/dashboard/dashboardService';
import type { SalesDataPoint } from '@/types/dashboard';

import gradient from "./gradient.svg";
import oulineGraph from "./ouline-graph.svg";
import point from "./point.svg";

const defaultXAxisLabels = [
  '5k', '10k', '15k', '20k', '25k', '30k',
  '35k', '40k', '45k', '50k', '55k', '60k',
];

const yAxisLabels = ["100%", "80%", "60%", "40%", "20%"];

export const SalesTrendChartSection = (): JSX.Element => {
  const [dataPoints, setDataPoints] = useState<SalesDataPoint[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    void (async () => {
      try {
        const resp = await dashboardService.getSalesChart();
        if (mounted && resp?.data?.data) setDataPoints(resp.data.data);
      } catch (err) {
        // ignore — keep static UI
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Card 
      className="w-full overflow-hidden rounded-[14px] border-none bg-white shadow-[6px_6px_54px_#0000000d]"
      aria-labelledby="sales-details-heading"
    >
      <CardHeader className="flex flex-row items-center justify-between px-6 pb-8 pt-6">
        <CardTitle 
          id="sales-details-heading"
          className="font-sans text-xl font-bold tracking-tight text-[#202224] sm:text-2xl"
        >
          Sales Details
        </CardTitle>
        
        {/* Dropdown Button sử dụng Lucide Icon thay cho shape.svg */}
        <button
          type="button"
          className="flex h-8 items-center gap-2 rounded border border-neutral-300 bg-[#fcfcfc] px-3 transition-colors hover:bg-neutral-100"
          aria-label="Selected month: October"
        >
          <span className="font-sans text-xs font-semibold text-[#2b303466]">
            October
          </span>
          <LuChevronDown className="h-4 w-4 text-[#2b303466]" aria-hidden="true" />
        </button>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        {/* Chart Container */}
        <div 
          className="flex h-[280px] w-full gap-4 sm:h-[350px]"
          aria-label="Sales trend line chart showing percentages from 20 to 100 and sales values from 5k to 60k for October"
        >
          
          {/* Y-Axis */}
          <div className="flex h-full flex-col justify-between pb-[30px] font-sans text-xs font-semibold text-[#2b303466]">
            {yAxisLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>

          {/* Chart Area */}
          <div className="relative flex flex-1 flex-col">
            
            {/* Horizontal Grid Lines thay thế cho các file line.svg */}
            <div className="absolute inset-0 flex flex-col justify-between pb-[30px]" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full border-b border-neutral-200" />
              ))}
            </div>

            {/* Graph Data Layers */}
            <div className="relative h-[calc(100%-30px)] w-full">
              <img
                className="absolute inset-0 h-full w-full object-fill opacity-70 pointer-events-none"
                alt=""
                src={gradient}
                aria-hidden="true"
              />
              <img
                className="absolute inset-0 h-full w-full object-fill pointer-events-none"
                alt=""
                src={oulineGraph}
                aria-hidden="true"
              />
              <img
                className="absolute left-[30%] top-[25%] -translate-x-1/2 -translate-y-1/2 h-10 w-10 pointer-events-none"
                alt=""
                src={point}
                aria-hidden="true"
              />

              {/* CSS Tooltip thay thế cho combined-shape.svg */}
              <div
                className="absolute left-[30%] top-[25%] -translate-x-1/2 -translate-y-full"
                aria-label="Highlighted value 64,3664.77"
              >
                <div className="relative flex h-7 items-center justify-center rounded-md bg-[#202224] px-3 shadow-md">
                  <span className="font-sans text-xs font-bold tracking-[0] text-white">
                    {loading ? 'Loading...' : (dataPoints && dataPoints[0] ? dataPoints[0].sales.toLocaleString() : '0')}
                  </span>
                  {/* Tooltip Arrow */}
                  <div className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-[#202224]" />
                </div>
              </div>
            </div>

            {/* X-Axis */}
            <div className="absolute bottom-0 left-0 flex w-full justify-between pt-4 font-sans text-xs font-semibold text-[#2b303466]">
              {(dataPoints ? dataPoints.map(d => d.label) : defaultXAxisLabels).map((label) => (
                <span key={label} className="w-8 text-center sm:-ml-4 sm:first:ml-0 sm:last:-mr-4">
                  {label}
                </span>
              ))}
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  );
};