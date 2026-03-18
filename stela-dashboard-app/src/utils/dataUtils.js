import * as XLSX from 'xlsx';

const parseWorkbook = (data) => {
  const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
  const sheets = {};
  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    // Convert to JSON and clean keys immediately
    const raw = XLSX.utils.sheet_to_json(worksheet);
    sheets[sheetName] = raw.map(row => {
      const cleanRow = {};
      Object.keys(row).forEach(key => {
        cleanRow[key.trim().toUpperCase()] = row[key];
      });
      return cleanRow;
    });
  });
  return sheets;
};

export const fetchExcel = async (url) => {
  const response = await fetch(url);
  const data = await response.arrayBuffer();
  return parseWorkbook(data);
};

export const parseExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(parseWorkbook(e.target.result));
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

export const excelDateToJS = (serial) => {
  if (isNaN(Number(serial))) return String(serial);
  const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
  return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
};

export const formatCurrency = (value) => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9,-]/g, '').replace(',', '.')) : Number(value);
  if (value === undefined || value === null || isNaN(num)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
};

export const formatPercent = (value, decimals = 1) => {
  let num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9,-]/g, '').replace(',', '.')) : Number(value);
  if (isNaN(num)) return '0%';
  const pct = (num <= 1.5 && num >= -1.5) ? num * 100 : num; // Heuristic for decimal vs percent
  return `${pct.toFixed(decimals)}%`;
};

export const formatDate = (value) => {
  if (!value) return '-';
  if (!isNaN(Number(value))) return excelDateToJS(value);
  return new Date(value).toLocaleDateString('pt-BR');
};

export const SHEET_MAP = {
  COMERCIAL_STRAT: 'ANALISES COMERCIAL',
  COMERCIAL_OP:    'BASE DADOS COMERCIAL',
  FINANCEIRO:      'ANALISES FIN.',
  FINANCEIRO_BASE: 'BASE. FIN.',
  PESSOAL:         'DASH DP',
  LOGISTICA_REC:   'ANALISES RECEB',
  LOGISTICA_SEP:   'ANALISES SEPARACAO',
  LOGISTICA_CONF:  'ANALISES CONF',
};

const MONTH_MAP = {
  'jan': ['JANEIRO', 'JAN', '01'],
  'fev': ['FEVEREIRO', 'FEV', '02'],
  'mar': ['MARÇO', 'MAR', '03'],
  'abr': ['ABRIL', 'ABR', '04'],
  'mai': ['MAIO', 'MAI', '05'],
  'jun': ['JUNHO', 'JUN', '06'],
  'jul': ['JULHO', 'JUL', '07'],
  'ago': ['AGOSTO', 'AGO', '08'],
  'set': ['SETEMBRO', 'SET', '09'],
  'out': ['OUTUBRO', 'OUT', '10'],
  'nov': ['NOVEMBRO', 'NOV', '11'],
  'dez': ['DEZEMBRO', 'DEZ', '12'],
};

export const getVal = (row, monthLabel = 'Todos') => {
  if (!row) return 0;
  
  // Try direct key match if monthLabel is provided (e.g. "JANEIRO")
  if (monthLabel && monthLabel !== 'Todos') {
    const rawMatch = row[monthLabel.toUpperCase()];
    if (rawMatch !== undefined && rawMatch !== '') return rawMatch;

    // Try substring matching (e.g. "set" matches "SETEMBRO")
    const m = monthLabel.toLowerCase().substring(0, 3);
    const possibleCols = MONTH_MAP[m] || [];
    for (const col of possibleCols) {
      if (row[col] !== undefined && row[col] !== '') return row[col];
    }
  }

  // Fallback chain — prefers Realized columns if present
  const keys = Object.keys(row);
  const reservedKeys = ['INDICADOR', 'ITEM', 'INDICADORES', 'RÓTULOS DE LINHA', '__EMPTY', 'DEPT', 'DEPTO'];
  
  // Try to find a total or realized column that isn't a label
  const betterKey = keys.find(k => 
    (k.includes('TOTAL') || k.includes('ACUM') || k.includes('REAL') || k.includes('VALOR')) && 
    !reservedKeys.includes(k)
  );
  
  const lastKey = keys[keys.length - 1];
  const fallbackKey = reservedKeys.includes(lastKey) ? keys.find(k => !reservedKeys.includes(k)) : lastKey;

  return row['REALIZADO'] ?? row['REAL'] ?? row['VALOR'] ?? row[betterKey] ?? row[fallbackKey] ?? 0;
};

export const findIndicator = (data, keyword) => {
  if (!data || !data.length) return null;
  const kw = keyword.toUpperCase();
  
  return data.find((r) => {
    const name = (
      r.INDICADOR || 
      r.ITEM || 
      r.INDICADORES || 
      r['RÓTULOS DE LINHA'] || 
      r.__EMPTY || 
      ''
    ).toString().toUpperCase();
    return name === kw || name.includes(kw);
  }) || null;
};

export const autoFormat = (value) => {
  const num = Number(value);
  if (isNaN(num) || value === '' || value === null || value === undefined) return String(value ?? '—');
  if (Math.abs(num) <= 1 && num !== 0) return formatPercent(num);
  if (Math.abs(num) >= 100) return formatCurrency(num);
  return String(num);
};

export const calcVariation = (realizado, previsto) => {
  const r = typeof realizado === 'string' ? parseFloat(realizado.replace(/[^0-9,-]/g, '').replace(',', '.')) : Number(realizado);
  const p = typeof previsto === 'string' ? parseFloat(previsto.replace(/[^0-9,-]/g, '').replace(',', '.')) : Number(previsto);
  
  if (!p || isNaN(r) || isNaN(p) || p === 0) return null;
  const pct = ((r - p) / p) * 100;
  return {
    value: `${Math.abs(pct).toFixed(1)}%`,
    isPositive: pct >= 0,
    label: r >= p ? 'atingiu a meta' : 'abaixo da meta'
  };
};
