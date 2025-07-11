"use client"

import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Investment } from "@/lib/types";

interface AllocationChartsProps {
  data: Investment[];
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const CustomTooltip = ({ active, payload, data }: any) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    const totalValue = data.reduce((sum: number, entry: any) => sum + entry.value, 0);
    const percent = (value / totalValue) * 100;

    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="font-bold text-foreground">{name}</div>
        <div className="text-sm text-muted-foreground">
            Valor: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
        </div>
        <div className="text-sm text-muted-foreground">Alocação: {percent.toFixed(2)}%</div>
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

  const formatCurrency = (value: number) => {
    if (value > 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value > 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Alocação por Tipo de Ativo</CardTitle>
          <CardDescription>Distribuição da sua carteira por tipo de ativo (subtipo).</CardDescription>
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
              <Tooltip content={<CustomTooltip data={allocationBySubtipo} />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Alocação por Tipo de Ativo</CardTitle>
          <CardDescription>Gráfico de barras da sua carteira por tipo de ativo (subtipo).</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={allocationBySubtipo} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tickFormatter={formatCurrency} stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={80} stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip data={allocationBySubtipo} />} cursor={{ fill: 'hsl(var(--muted))' }}/>
                <Bar dataKey="value" name="Value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} animationDuration={500}>
                    {allocationBySubtipo.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}
