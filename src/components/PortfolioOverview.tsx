import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Investment } from "@/lib/types";
import { DollarSign, Wallet, Landmark } from 'lucide-react';

interface PortfolioOverviewProps {
  data: Investment[];
}

export default function PortfolioOverview({ data }: PortfolioOverviewProps) {
  const totalValue = data.reduce((sum, item) => sum + item.valor_investido, 0);
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
          <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          <p className="text-xs text-muted-foreground">Total value of all assets</p>
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Issuers</CardTitle>
          <Landmark className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalIssuers}</div>
          <p className="text-xs text-muted-foreground">Number of unique issuers</p>
        </CardContent>
      </Card>
    </>
  );
}
