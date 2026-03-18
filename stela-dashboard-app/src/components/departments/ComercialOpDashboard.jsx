import React, { useMemo } from 'react';
import { Grid, Container, Box } from '@mui/material';
import {
  Speed as SpeedIcon,
  ConfirmationNumber as TicketIcon,
  Timeline,
  Star as StarIcon,
} from '@mui/icons-material';
import StatCard from '../StatCard';
import ChartCard from '../ChartCard';
import DataTable from '../DataTable';
import Header from '../Header';
import { findIndicator, formatCurrency, autoFormat, getVal, calcVariation } from '../../utils/dataUtils';
import { WARNING, PRIMARY, SUCCESS, DARK, INFO, ERROR } from '../../theme';

export default function ComercialOpDashboard({ data = [], activeMonth = 'Todos', onMonthChange, months = [] }) {
  // Enhanced Indicator Discovery
  const ticketMedio = findIndicator(data, 'TICKET MÉDIO') || findIndicator(data, 'TICKET')      || findIndicator(data, 'VALOR MÉDIO');
  const pedidos     = findIndicator(data, 'PEDIDOS')      || findIndicator(data, 'QUANTIDADE')  || findIndicator(data, 'VENDAS');
  const produtiv    = findIndicator(data, 'VISITAS')      || findIndicator(data, 'PRODUTIVIDADE') || findIndicator(data, 'COBERTURA');
  const ranking     = findIndicator(data, 'VENDEDOR')     || findIndicator(data, 'CANAL')       || findIndicator(data, 'GESTOR');

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

  const radarOptions = {
    stroke: { width: 3, curve: 'smooth' },
    fill: { opacity: 0.4 },
    markers: { size: 5, strokeWidth: 2, strokeColors: WARNING.main },
    colors: ['#ffffff'],
    xaxis: {
      categories: labels,
      labels: { style: { colors: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 600 } }
    },
    yaxis: { show: false }
  };

  const barHorizOptions = {
    plotOptions: { bar: { horizontal: true, barHeight: '50%', borderRadius: 8 } },
    colors: ['#ffffff'],
    xaxis: {
      categories: labels,
      labels: { style: { colors: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 600 } },
    },
    yaxis: { labels: { style: { colors: 'rgba(255,255,255,0.7)', fontSize: '10px' } } },
    grid: { xaxis: { lines: { show: true } } }
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Header 
        pageTitle="ANÁLISE OPERACIONAL" 
        breadcrumb="Comercial > Gestão de Equipe" 
        activeMonth={activeMonth}
        onMonthChange={onMonthChange}
        months={months}
      />
      
      <Box sx={{ mt: 1, px: 0 }}>
        {/* KPI Row - Line 1 */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Ticket Médio"
              value={formatCurrency(getVal(ticketMedio, activeMonth))}
              trend={getTrend(ticketMedio)}
              icon={<TicketIcon />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Volume de Vendas"
              value={getVal(pedidos, activeMonth)}
              trend={getTrend(pedidos)}
              icon={<SpeedIcon />}
              color="error"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Cobertura / Visitas"
              value={autoFormat(getVal(produtiv, activeMonth))}
              trend={getTrend(produtiv)}
              icon={<Timeline />}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Performance Canal"
              value={getVal(ranking, activeMonth)}
              badge="Top Performance"
              icon={<StarIcon />}
              color="success"
            />
          </Grid>
        </Grid>

        {/* Charts Row - Line 2 */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <ChartCard
              title="Raio-X de Atuação"
              subtitle="Indicadores técnicos operacionais"
              gradientStart={WARNING.main}
              gradientEnd={WARNING.dark}
              series={[{ name: 'Realizado', data: chartRows.map((r) => Number(getVal(r, activeMonth)) || 0) }]}
              options={radarOptions}
              type="radar"
              height={180}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartCard
              title="Ranking Estratégico"
              subtitle="Vendas por canais"
              gradientStart={INFO.main}
              gradientEnd={INFO.dark}
              series={[{ name: 'Volume', data: chartRows.map((r) => Number(getVal(r, activeMonth)) || 0) }]}
              options={barHorizOptions}
              type="bar"
              height={180}
            />
          </Grid>
        </Grid>

        {/* Table Row - Line 3 */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DataTable data={data} activeMonth={activeMonth} title="Base de Dados Operacional — Ferreira Distribuidora" />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
