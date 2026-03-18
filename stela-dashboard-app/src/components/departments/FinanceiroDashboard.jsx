import React, { useMemo } from 'react';
import { Grid, Container, Box } from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  AccountBalance,
  TrendingUp,
  PieChart as PieIcon,
} from '@mui/icons-material';
import StatCard from '../StatCard';
import ChartCard from '../ChartCard';
import DataTable from '../DataTable';
import Header from '../Header';
import { findIndicator, formatCurrency, formatPercent, calcVariation, getVal } from '../../utils/dataUtils';
import { SUCCESS, WARNING, INFO, PRIMARY, DARK, ERROR } from '../../theme';

export default function FinanceiroDashboard({ data = [], activeMonth = 'Todos', onMonthChange, months = [] }) {
  // Enhanced Indicator Discovery
  const fatBruto   = findIndicator(data, 'FATURAMENTO BRUTO') || findIndicator(data, 'RECEBIMENTOS')    || findIndicator(data, 'TOTAL GERAL');
  const inadimp    = findIndicator(data, 'INADIMPLÊNCIA')    || findIndicator(data, 'TAXA DE ATRASO')   || findIndicator(data, 'VENCIDOS');
  const lucroOper  = findIndicator(data, 'LUCRO OPERACIONAL') || findIndicator(data, 'EBITDA')           || findIndicator(data, 'LUCRO');
  const margem     = findIndicator(data, 'MARGEM DE CONTRIBUIÇÃO') || findIndicator(data, 'MARGEM BRUTA') || findIndicator(data, 'MARGEM %');

  // Helper for trend object
  const getTrend = (row) => {
    if (!row) return null;
    const real = getVal(row, activeMonth);
    const prev = row.PREVISTO || row.META || row.JANEIRO;
    return calcVariation(real, prev);
  };

  // Premium Value Rendering
  const renderVal = (row) => {
    if (!row) return '—';
    const v = getVal(row, activeMonth);
    const n = Number(v);
    if (isNaN(n) || v === null || v === '') return String(v || '—');
    if (Math.abs(n) <= 1 && n !== 0) return formatPercent(n);
    if (Math.abs(n) >= 100) return formatCurrency(n);
    return String(n);
  };

  // Chart Data Slicing
  const chartRows = useMemo(() => data.slice(0, 10), [data]);
  const labels = chartRows.map((r) => (r.INDICADOR || r.ITEM || r['RÓTULOS DE LINHA'] || r.__EMPTY || '').toString().substring(0, 15));

  const barOptions = {
    plotOptions: { bar: { columnWidth: '45%', borderRadius: 8 } },
    colors: ['rgba(255,255,255,0.3)', '#ffffff'],
    xaxis: {
      categories: labels,
      labels: { style: { colors: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 600 } },
    },
    yaxis: {
      labels: {
        style: { colors: 'rgba(255,255,255,0.7)' },
        formatter: (v) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)),
      },
    },
  };

  const areaOptions = {
    stroke: { curve: 'smooth', width: 4 },
    colors: ['#ffffff'],
    fill: { 
      type: 'gradient', 
      gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0, stops: [0, 90, 100] } 
    },
    markers: { size: 5, strokeWidth: 3, strokeColors: INFO.main },
    xaxis: {
      categories: labels,
      labels: { style: { colors: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 600 } },
    },
    yaxis: {
      labels: {
        style: { colors: 'rgba(255,255,255,0.7)' },
        formatter: (v) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)),
      },
    },
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Header 
        pageTitle="CONTROLE FINANCEIRO" 
        breadcrumb="Financeiro > Gestão de Fluxo" 
        activeMonth={activeMonth}
        onMonthChange={onMonthChange}
        months={months}
      />
      
      <Box sx={{ mt: 1, px: 0 }}>
        <Grid container spacing={4}>

          {/* KPI Row */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Recebimentos Totais"
              value={renderVal(fatBruto)}
              trend={getTrend(fatBruto)}
              icon={<MoneyIcon />}
              color="success"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Taxa Inadimplência"
              value={renderVal(inadimp)}
              trend={getTrend(inadimp)}
              icon={<TrendingUp />}
              color="error"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Lucro Operacional"
              value={renderVal(lucroOper)}
              badge="Métrica EBITDA"
              icon={<AccountBalance />}
              color="primary"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Margem de Lucro"
              value={renderVal(margem)}
              trend={getTrend(margem)}
              icon={<PieIcon />}
              color="info"
            />
          </Grid>

          {/* Charts Row */}
          <Grid item xs={12} md={7}>
            <ChartCard
              title="Análise de Performance"
              subtitle="Consolidado Real vs Planejado"
              gradientStart={SUCCESS.main}
              gradientEnd={SUCCESS.dark}
              series={[
                { name: 'Previsto',  data: chartRows.map((r) => Number(r.PREVISTO || r.META || r.JANEIRO) || 0) },
                { name: 'Realizado', data: chartRows.map((r) => Number(getVal(r, activeMonth)) || 0) },
              ]}
              options={barOptions}
              type="bar"
              height={180}
            />
          </Grid>

          <Grid item xs={12} md={5}>
            <ChartCard
              title="Evolução Financeira"
              subtitle="Curva de receita auditada"
              gradientStart={INFO.main}
              gradientEnd={INFO.dark}
              series={[{ name: 'Realizado', data: chartRows.map((r) => Number(getVal(r, activeMonth)) || 0) }]}
              options={areaOptions}
              type="area"
              height={180}
            />
          </Grid>

          {/* Table Row */}
          <Grid item xs={12}>
            <DataTable data={data} activeMonth={activeMonth} title="Balanço Consolidado — Ferreira Distribuidora" />
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
}
