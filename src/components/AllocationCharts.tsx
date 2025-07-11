"use client"

import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Investment } from "@/lib/types";

interface AllocationChartsProps {
  data: Investment[];
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const CustomTooltipPie = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value, payload: itemPayload } = payload[0];
    const totalValue = itemPayload.data.reduce((sum: number, entry: any) => sum + entry.value, 0);
    const percent = totalValue > 0 ? (value / totalValue) * 100 : 0;

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

const CustomTooltipBar = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const totalForIssuer = payload.reduce((sum, entry) => sum + entry.value, 0);

    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="font-bold text-foreground mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => {
            if (entry.value === 0) return null;
            return (
                <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }}></div>
                    <span className="text-sm text-muted-foreground">{entry.name}:</span>
                </div>
                <span className="text-sm font-medium text-foreground">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entry.value)}
                    ({(entry.value / totalForIssuer * 100).toFixed(1)}%)
                </span>
                </div>
            )
          })}
        </div>
        <div className="border-t mt-2 pt-2 flex items-center justify-between font-bold">
            <span className="text-sm text-muted-foreground">Total:</span>
            <span className="text-sm text-foreground">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalForIssuer)}</span>
        </div>
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
    return Array.from(subtipoMap.entries()).map(([name, value]) => ({ name, value, data })).sort((a, b) => b.value - a.value);
  }, [data]);

  const { allocationByIssuer, allSubtipos } = useMemo(() => {
    const issuerMap = new Map<string, { [key: string]: number }>();
    const subtipos = new Set<string>();

    data.forEach(item => {
        subtipos.add(item.subtipo);
    });

    const allSubtiposArray = Array.from(subtipos);

    data.forEach(item => {
        if (!issuerMap.has(item.emissor)) {
            const initialData: { [key: string]: number } = {};
            allSubtiposArray.forEach(subtipo => {
                initialData[subtipo] = 0;
            });
            issuerMap.set(item.emissor, initialData);
        }
        const issuerData = issuerMap.get(item.emissor)!;
        issuerData[item.subtipo] = (issuerData[item.subtipo] || 0) + item.valor_investido;
    });

    const allocationByIssuer = Array.from(issuerMap.entries()).map(([name, values]) => ({
        name,
        ...values,
    }));
    
    return { allocationByIssuer, allSubtipos: allSubtiposArray };
  }, [data]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
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
              <Tooltip content={<CustomTooltipPie />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Alocação por Emissor</CardTitle>
          <CardDescription>Valor total investido por emissor, dividido por subtipo.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={allocationByIssuer} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tickFormatter={formatCurrency} stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={80} stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip content={<CustomTooltipBar />} cursor={{ fill: 'hsl(var(--muted))' }}/>
                <Legend />
                {allSubtipos.map((subtipo, index) => (
                  <Bar key={subtipo} dataKey={subtipo} name={subtipo} stackId="a" fill={COLORS[index % COLORS.length]} animationDuration={500} />
                ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}
