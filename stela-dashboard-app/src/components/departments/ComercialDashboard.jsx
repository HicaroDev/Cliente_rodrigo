import React, { useMemo } from 'react';
import { Grid, Container, Box } from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  Group as GroupIcon,
  TrendingUp,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import StatCard from '../StatCard';
import ChartCard from '../ChartCard';
import DataTable from '../DataTable';
import Header from '../Header';
import { findIndicator, formatCurrency, formatPercent, calcVariation, getVal } from '../../utils/dataUtils';
import { PRIMARY, SUCCESS, WARNING, DARK, INFO } from '../../theme';

export default function ComercialDashboard({ data = [], activeMonth = 'Todos', onMonthChange, months = [] }) {
  // Enhanced Indicator Discovery based on actual Excel dump
  const fat      = findIndicator(data, 'FATURAMENTO BRUTO') || findIndicator(data, 'TOTAL GERAL') || findIndicator(data, 'FATURAMENTO');
  const pos      = findIndicator(data, 'POSITIVAÇÃO')        || findIndicator(data, 'POSITIVADOS')  || findIndicator(data, 'CLIENTE');
  const conv     = findIndicator(data, 'CONVERSÃO')         || findIndicator(data, 'EFICÁCIA')     || findIndicator(data, 'CONVERSAO');
  const destaque = findIndicator(data, 'VENDEDOR')          || findIndicator(data, 'DESTAQUE')     || findIndicator(data, 'ITEM');

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

  // Helper for trend object
  const getTrend = (row) => {
    if (!row) return null;
    const real = getVal(row, activeMonth);
    const prev = row.PREVISTO || row.META || row.JANEIRO;
    return calcVariation(real, prev);
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
    markers: { size: 5, strokeWidth: 3, strokeColors: SUCCESS.main },
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
        pageTitle="ANÁLISE COMERCIAL" 
        breadcrumb="Comercial > BI Estratégico" 
        activeMonth={activeMonth}
        onMonthChange={onMonthChange}
        months={months}
      />
      
      <Box sx={{ mt: 1, px: 0 }}>
        {/* KPI Row - Line 1 */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Faturamento Bruto"
              value={renderVal(fat)}
              trend={getTrend(fat)}
              icon={<MoneyIcon />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Índice Positivação"
              value={renderVal(pos)}
              badge="Unidades Positivadas"
              icon={<GroupIcon />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Conversão Real"
              value={renderVal(conv)}
              trend={getTrend(conv)}
              icon={<TrendingUp />}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Destaque de Vendas"
              value={getVal(destaque, activeMonth)}
              badge="Liderança de Carteira"
              icon={<TrophyIcon />}
              color="info"
            />
          </Grid>
        </Grid>

        {/* Charts Row - Line 2 */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <ChartCard
              title="Comparativo de Indicadores"
              subtitle="Meta vs Realizado acumulado"
              gradientStart={PRIMARY.main}
              gradientEnd={PRIMARY.dark}
              series={[
                { name: 'Meta', data: chartRows.map((r) => Number(r.PREVISTO || r.META || r.JANEIRO) || 0) },
                { name: 'Real', data: chartRows.map((r) => Number(getVal(r, activeMonth)) || 0) },
              ]}
              options={barOptions}
              type="bar"
              height={180}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartCard
              title="Curva de Faturamento"
              subtitle="Crescimento auditado"
              gradientStart={SUCCESS.main}
              gradientEnd={SUCCESS.dark}
              series={[{ name: 'Faturamento', data: chartRows.map((r) => Number(getVal(r, activeMonth)) || 0) }]}
              options={areaOptions}
              type="area"
              height={180}
            />
          </Grid>
        </Grid>

        {/* Table Row - Line 3 */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DataTable data={data} activeMonth={activeMonth} title="Base de Dados — Auditado Comercial" />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
