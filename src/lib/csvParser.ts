import { Investment } from '@/lib/types';

export function parseCSV(csvText: string): Investment[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file must have a header and at least one data row.');
  }

  const header = lines[0].split(',').map(h => h.trim());
  const expectedHeaders = ['data', 'subtipo', 'emissor', 'valor_investido', 'taxa_retorno_anual'];
  
  const hasAllHeaders = expectedHeaders.every(h => header.includes(h));

  if (!hasAllHeaders || header.length !== expectedHeaders.length) {
      throw new Error(`Invalid CSV headers. Expected: ${expectedHeaders.join(',')}. Found: ${header.join(',')}`);
  }
  
  const data: Investment[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row: any = {};
    for (let j = 0; j < header.length; j++) {
      row[header[j]] = values[j];
    }
    
    const valor_investido = parseFloat(row.valor_investido);
    if (isNaN(valor_investido)) {
        throw new Error(`Invalid numeric value for 'valor_investido' in row ${i+1}: ${row.valor_investido}`);
    }

    const taxa_retorno_anual = parseFloat(row.taxa_retorno_anual);
    if (isNaN(taxa_retorno_anual)) {
        throw new Error(`Invalid numeric value for 'taxa_retorno_anual' in row ${i+1}: ${row.taxa_retorno_anual}`);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(row.data)) {
        throw new Error(`Invalid date format for 'data' in row ${i+1}: ${row.data}. Expected YYYY-MM-DD.`);
    }

    data.push({
      data: row.data,
      subtipo: row.subtipo,
      emissor: row.emissor,
      valor_investido: valor_investido,
      taxa_retorno_anual: taxa_retorno_anual,
    });
  }
  
  return data;
}
