"use client";

import { useState, useTransition } from 'react';
import { Bot, Loader2, Sparkles } from 'lucide-react';

import { Investment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getInvestmentInsights } from '@/ai/flows/investment-insights';

interface InvestmentInsightsProps {
    data: Investment[];
}

export default function InvestmentInsights({ data }: InvestmentInsightsProps) {
    const [insights, setInsights] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleGetInsights = () => {
        startTransition(async () => {
            setError(null);
            setInsights(null);

            const totalValue = data.reduce((sum, item) => sum + item.valor_investido, 0);
            const subtipoMap = new Map<string, number>();
            data.forEach(item => {
                subtipoMap.set(item.subtipo, (subtipoMap.get(item.subtipo) || 0) + item.valor_investido);
            });
            const allocationBySubtipo = Array.from(subtipoMap.entries())
                .map(([name, value]) => `${name}: ${((value / totalValue) * 100).toFixed(2)}%`)
                .join(', ');

            const sortedData = [...data].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
            
            const portfolioSummary = `
                Total Investment Value: ${totalValue.toFixed(2)} BRL.
                Asset Allocation by Type: ${allocationBySubtipo}.
                The portfolio contains data from ${sortedData[0].data} to ${sortedData[sortedData.length-1].data}.
            `;

            try {
                const result = await getInvestmentInsights({ portfolioSummary });
                setInsights(result.insights);
            } catch (e) {
                console.error(e);
                setError('Failed to generate insights. Please try again.');
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Bot className="text-primary"/>
                            AI-Powered Insights
                        </CardTitle>
                        <CardDescription>
                            Get an AI-generated summary of your portfolio's performance.
                        </CardDescription>
                    </div>
                    <Button onClick={handleGetInsights} disabled={isPending} className="w-full sm:w-auto">
                        {isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        Generate Insights
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {isPending && (
                    <div className="flex items-center justify-center p-8 rounded-md bg-muted/50">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="ml-4 text-muted-foreground">Generating your insights...</p>
                    </div>
                )}
                {error && (
                    <div className="p-4 text-center text-destructive bg-destructive/10 rounded-md">
                        {error}
                    </div>
                )}
                {insights && (
                    <div className="p-4 border-l-4 rounded-r-md bg-primary/5 border-primary">
                        <p className="whitespace-pre-wrap text-card-foreground/90">{insights}</p>
                    </div>
                )}
                 {!insights && !isPending && !error && (
                    <div className="text-center p-8 border-2 border-dashed rounded-md text-muted-foreground">
                        Click "Generate Insights" to see an analysis of your portfolio.
                    </div>
                 )}
            </CardContent>
        </Card>
    );
}
