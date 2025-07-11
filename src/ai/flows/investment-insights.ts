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
  prompt: `Você é um assistente de IA especializado em fornecer insights sobre carteiras de investimentos. Sua resposta deve ser em português do Brasil.

  Com base no resumo do portfólio fornecido, gere insights que resumam o desempenho histórico do portfólio, destacando as principais tendências e possíveis áreas de melhoria. Não forneça aconselhamento financeiro direto ou recomendações de negociação específicas.

  Resumo do Portfólio: {{{portfolioSummary}}}

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
