"use client";

import { useState } from 'react';
import { Landmark, UploadCloud, FileWarning } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Investment } from '@/lib/types';
import { parseCSV } from '@/lib/csvParser';
import PortfolioOverview from '@/components/PortfolioOverview';
import AllocationCharts from '@/components/AllocationCharts';
import PerformanceChart from '@/components/PerformanceChart';
import InvestmentInsights from '@/components/InvestmentInsights';

export default function Home() {
  const [data, setData] = useState<Investment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        try {
          const parsedData = parseCSV(text);
          setData(parsedData);
          setError(null);
        } catch (err: any) {
          setError(err.message);
          setData([]);
        }
      };
      reader.readAsText(file);
    }
  };

  const hasData = data.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground px-4">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Landmark className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold font-headline">InvestView</h1>
        </div>
      </header>

      <main className="flex-1 container py-8">
        {!hasData ? (
          <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
            <Card className="w-full max-w-lg text-center shadow-lg animate-fade-in">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                  <UploadCloud className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="mt-4 text-2xl">Upload your Investment Data</CardTitle>
                <CardDescription>
                  Upload a .csv file to visualize your portfolio. <br />
                  Expected columns: `data,subtipo,emissor,valor_investido`
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <Input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="csv-upload" className="w-full">
                    <Button asChild className="w-full cursor-pointer">
                        <span>{fileName || "Choose a .csv file"}</span>
                    </Button>
                  </label>
                  {error && (
                    <div className="flex items-center gap-2 p-3 text-sm rounded-md bg-destructive/10 text-destructive">
                      <FileWarning className="w-5 h-5" />
                      <p>{error}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold font-headline">Portfolio Dashboard</h2>
                <Button variant="outline" onClick={() => { setData([]); setFileName(''); setError(null); }}>
                    <UploadCloud className="mr-2" />
                    Upload New File
                </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <PortfolioOverview data={data} />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <AllocationCharts data={data} />
            </div>
            <div className="grid gap-6">
              <PerformanceChart data={data} />
            </div>
            <div className="grid gap-6">
              <InvestmentInsights data={data} />
            </div>
          </div>
        )}
      </main>
      <footer className="py-4 mt-8 border-t">
        <div className="container text-center text-sm text-muted-foreground">
            InvestView - Your personal investment dashboard.
        </div>
      </footer>
    </div>
  );
}
