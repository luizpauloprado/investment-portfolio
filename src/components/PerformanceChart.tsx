"use client"

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Investment } from "@/lib/types";
import { differenceInDays, parseISO } from 'date-fns';

interface PerformanceChartProps {
  data: Investment[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const performanceData = useMemo(() => {
    if (data.length === 0) return [];

    const sortedData = [...data].sort((a, b) => parseISO(a.data).getTime() - parseISO(b.data).getTime());
    
    const dateSet = new Set(sortedData.map(d => d.data));

    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    dateSet.add(todayString);

    const allDates = Array.from(dateSet).sort((a,b) => parseISO(a).getTime() - parseISO(b).getTime());
    
    if (allDates.length === 0) return [];
    
    return allDates.map(currentDateStr => {
        const currentDate = parseISO(currentDateStr);
        let cumulativeValue = 0;

        sortedData.forEach(investment => {
            const investmentDate = parseISO(investment.data);

            if (investmentDate <= currentDate) {
                const daysDiff = differenceInDays(currentDate, investmentDate);
                const yearsDiff = daysDiff / 365.25;
                const futureValue = investment.valor_investido * Math.pow(1 + investment.taxa_retorno_anual, yearsDiff);
                cumulativeValue += futureValue;
            }
        });

        return { date: currentDateStr, 'Total': cumulativeValue };
    });

  }, [data]);

  const formatCurrency = (value: number) => {
    if (value > 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value > 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  const tooltipFormatter = (value: number) => {
     return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Performance</CardTitle>
        <CardDescription>Valor cumulativo durante o tempo com base na taxa de retorno anual.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={performanceData}
            margin={{
              top: 5,
              right: 20,
              left: 30,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <YAxis tickFormatter={(value) => formatCurrency(value)} stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} domain={['dataMin', 'dataMax']}/>
            <Tooltip 
              formatter={(value: number) => tooltipFormatter(value)}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
            <Line type="monotone" dataKey="Total" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 2, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} animationDuration={500} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
