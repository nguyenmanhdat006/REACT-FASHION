import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { KpiCardsSummaryCard } from './components/KpiCardsSummaryCard';
import dashboardService from '@/services/dashboard/dashboardService';
import { LineChart, Package, ShoppingCart, Users } from 'lucide-react';
import type { DashboardStatsResponse } from '@/types/dashboard';

export const KpiCardsSummarySection = (): JSX.Element => {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const resp = await dashboardService.getStats();
        if (mounted && resp?.data) setStats(resp.data);
      } catch (err) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const cards = stats
    ? [
        {
          title: 'Total Pending',
          value: String(stats.totalPending.formattedValue),
          Icon: Package,
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-500',
          trendValue: `${stats.totalPending.percentageChange}%`,
          trendLabel: stats.totalPending.changeText || '',
          trendType: (stats.totalPending.changeDirection === 'up' ? 'up' : 'down') as 'up' | 'down',
        },
        {
          title: 'Total Sales',
          value: String(stats.totalSales.formattedValue),
          Icon: LineChart,
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-500',
          trendValue: `${stats.totalSales.percentageChange}%`,
          trendLabel: stats.totalSales.changeText || '',
          trendType: (stats.totalSales.changeDirection === 'up' ? 'up' : 'down') as 'up' | 'down',
        },
        {
          title: 'Total Order',
          value: String(stats.totalOrders.formattedValue),
          Icon: ShoppingCart,
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-500',
          trendValue: `${stats.totalOrders.percentageChange}%`,
          trendLabel: stats.totalOrders.changeText || '',
          trendType: (stats.totalOrders.changeDirection === 'up' ? 'up' : 'down') as 'up' | 'down',
        },
        {
          title: 'Total User',
          value: String(stats.totalUsers.formattedValue),
          Icon: Users,
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-500',
          trendValue: `${stats.totalUsers.percentageChange}%`,
          trendLabel: stats.totalUsers.changeText || '',
          trendType: (stats.totalUsers.changeDirection === 'up' ? 'up' : 'down') as 'up' | 'down',
        },
      ]
    : [
        {
          title: 'Total Pending',
          value: '0',
          Icon: Package,
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-500',
          trendValue: '0%',
          trendLabel: '',
          trendType: 'up' as 'up' | 'down',
        },
        {
          title: 'Total Sales',
          value: '$0',
          Icon: LineChart,
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-500',
          trendValue: '0%',
          trendLabel: '',
          trendType: 'up' as 'up' | 'down',
        },
        {
          title: 'Total Order',
          value: '0',
          Icon: ShoppingCart,
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-500',
          trendValue: '0%',
          trendLabel: '',
          trendType: 'up' as 'up' | 'down',
        },
        {
          title: 'Total User',
          value: '0',
          Icon: Users,
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-500',
          trendValue: '0%',
          trendLabel: '',
          trendType: 'up' as 'up' | 'down',
        },
      ];

  return (
    <section aria-label="Key performance indicators" className="w-full">
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <KpiCardsSummaryCard key={card.title} card={card} />
        ))}
      </div>
    </section>
  );
};