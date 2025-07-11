"use client"

import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Investment } from "@/lib/types";

interface AllocationChartsProps {
  data: Investment[];
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const { percent } = payload[0].payload;
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="font-bold text-foreground">{payload[0].name}</div>
          <div className="text-sm text-muted-foreground">
            Value: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[0].value)}
          </div>
           <div className="text-sm text-muted-foreground">Allocation: {(percent * 100).toFixed(2)}%</div>
        </div>
      );
    }
  
    return null;
};

export default function AllocationCharts({ data }: AllocationChartsProps) {
  const allocationBySubtipo = useMemo(() => {
    const subtipoMap = new Map<string, number>();
    data.forEach(item => {
      subtipoMap.set(item.subtipo, (subtipoMap.get(item.subtipo) || 0) + item.valor_investido);
    });
    return Array.from(subtipoMap.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [data]);

  const allocationByEmissor = useMemo(() => {
    const emissorMap = new Map<string, number>();
    data.forEach(item => {
      emissorMap.set(item.emissor, (emissorMap.get(item.emissor) || 0) + item.valor_investido);
    });
    return Array.from(emissorMap.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [data]);
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Allocation by Asset Type</CardTitle>
          <CardDescription>Distribution of your portfolio by asset type (subtipo).</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={allocationBySubtipo}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                animationDuration={500}
              >
                {allocationBySubtipo.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Allocation by Issuer</CardTitle>
          <CardDescription>Distribution of your portfolio by asset issuer (emissor).</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={allocationByEmissor}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                animationDuration={500}
              >
                {allocationByEmissor.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}
