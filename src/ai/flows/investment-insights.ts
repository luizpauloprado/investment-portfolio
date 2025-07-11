'use server';

/**
 * @fileOverview AI-driven insights summarizing investment portfolio performance.
 *
 * - getInvestmentInsights - A function that provides AI-driven insights for investment portfolios.
 * - InvestmentInsightsInput - The input type for the getInvestmentInsights function.
 * - InvestmentInsightsOutput - The return type for the getInvestmentInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InvestmentInsightsInputSchema = z.object({
  portfolioSummary: z
    .string()
    .describe(
      'A summary of the investment portfolio, including asset allocation, total investment value, and historical performance data.'
    ),
});
export type InvestmentInsightsInput = z.infer<typeof InvestmentInsightsInputSchema>;

const InvestmentInsightsOutputSchema = z.object({
  insights: z
    .string()
    .describe(
      'AI-driven insights summarizing the investment portfolio’s historical performance, highlighting key trends and potential areas for improvement, without direct financial advice.'
    ),
});
export type InvestmentInsightsOutput = z.infer<typeof InvestmentInsightsOutputSchema>;

export async function getInvestmentInsights(input: InvestmentInsightsInput): Promise<InvestmentInsightsOutput> {
  return investmentInsightsFlow(input);
}

const investmentInsightsPrompt = ai.definePrompt({
  name: 'investmentInsightsPrompt',
  input: {schema: InvestmentInsightsInputSchema},
  output: {schema: InvestmentInsightsOutputSchema},
  prompt: `You are an AI assistant specializing in providing insights into investment portfolios.

  Based on the provided portfolio summary, generate insights summarizing the portfolio’s historical performance, highlighting key trends and potential areas for improvement. Do not provide direct financial advice or specific trading recommendations.

  Portfolio Summary: {{{portfolioSummary}}}

  Insights:`,
});

const investmentInsightsFlow = ai.defineFlow(
  {
    name: 'investmentInsightsFlow',
    inputSchema: InvestmentInsightsInputSchema,
    outputSchema: InvestmentInsightsOutputSchema,
  },
  async input => {
    const {output} = await investmentInsightsPrompt(input);
    return output!;
  }
);
