import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Investment } from "@/lib/types";
import { DollarSign, Wallet, Landmark, TrendingUp } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

interface PortfolioOverviewProps {
  data: Investment[];
}

export default function PortfolioOverview({ data }: PortfolioOverviewProps) {
  const today = new Date();

  const totalInvested = data.reduce((sum, item) => sum + item.valor_investido, 0);
  
  const currentValue = data.reduce((sum, item) => {
    const investmentDate = parseISO(item.data);
    const daysDiff = differenceInDays(today, investmentDate);
    const yearsDiff = daysDiff / 365.25;
    const futureValue = item.valor_investido * Math.pow(1 + item.taxa_retorno_anual, yearsDiff);
    return sum + futureValue;
  }, 0);

  const totalAssets = new Set(data.map(item => `${item.emissor}-${item.subtipo}`)).size;
  const totalIssuers = new Set(data.map(item => item.emissor)).size;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Value</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(currentValue)}</div>
          <p className="text-xs text-muted-foreground">Total portfolio value today</p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
          <p className="text-xs text-muted-foreground">Total value of all contributions</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAssets}</div>
          <p className="text-xs text-muted-foreground">Number of unique assets</p>
        </CardContent>
      </Card>
    </>
  );
}
