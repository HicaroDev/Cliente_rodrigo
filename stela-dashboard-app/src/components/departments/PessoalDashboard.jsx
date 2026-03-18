import React, { useMemo } from 'react';
import { Grid, Container, Box } from '@mui/material';
import {
  People as PeopleIcon,
  PersonAdd,
  PersonRemove,
  AssignmentLate as TurnoverIcon,
} from '@mui/icons-material';
import StatCard from '../StatCard';
import ChartCard from '../ChartCard';
import DataTable from '../DataTable';
import Header from '../Header';
import { findIndicator, formatPercent, calcVariation, getVal } from '../../utils/dataUtils';
import { WARNING, INFO, SUCCESS, ERROR, DARK, PRIMARY } from '../../theme';

export default function PessoalDashboard({ data = [], activeMonth = 'Todos', onMonthChange, months = [] }) {
  // Enhanced Indicator Discovery
  const headcount = findIndicator(data, 'HEADCOUNT')      || findIndicator(data, 'EFETIVO')      || findIndicator(data, 'TOTAL GERAL') || findIndicator(data, 'COLABORADORES');
  const turnover  = findIndicator(data, 'TURNOVER')       || findIndicator(data, 'ROTATIVIDADE') || findIndicator(data, 'TAXA DE SAÍDA');
  const admissoes = findIndicator(data, 'ADMISSÃO')       || findIndicator(data, 'CONTRATAÇÃO')  || findIndicator(data, 'ENTRADAS');
  const demissoes = findIndicator(data, 'DEMISSÃO')       || findIndicator(data, 'DESLIGAMENTO') || findIndicator(data, 'SAÍDAS');

  // Helper for trend object
  const getTrend = (row) => {
    if (!row) return null;
    const real = getVal(row, activeMonth);
    const prev = row.PREVISTO || row.META || row.JANEIRO;
    return calcVariation(real, prev);
  };

  // Value formatting helper
  const renderVal = (row) => {
    if (!row) return '—';
    const v = getVal(row, activeMonth);
    const n = Number(v);
    if (isNaN(n) || v === null || v === '') return String(v || '—');
    if (Math.abs(n) <= 1 && n !== 0) return formatPercent(n);
    return String(Math.round(n));
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
        formatter: (v) => Math.round(v),
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
        formatter: (v) => Math.round(v),
      },
    },
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Header 
        pageTitle="TALENTOS & HUMANOS" 
        breadcrumb="RH > Gestão de Pessoal" 
        activeMonth={activeMonth}
        onMonthChange={onMonthChange}
        months={months}
      />
      
      <Box sx={{ mt: 1, px: 0 }}>
        {/* KPI Row - Line 1 */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Efetivo Atual"
              value={renderVal(headcount)}
              trend={getTrend(headcount)}
              icon={<PeopleIcon />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Taxa de Turnover"
              value={renderVal(turnover)}
              trend={getTrend(turnover)}
              icon={<TurnoverIcon />}
              color="error"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Novas Entradas"
              value={renderVal(admissoes)}
              badge="Mês Vigente"
              icon={<PersonAdd />}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Desligamentos"
              value={renderVal(demissoes)}
              badge="Total Mensal"
              icon={<PersonRemove />}
              color="dark"
            />
          </Grid>
        </Grid>

        {/* Charts Row - Line 2 */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <ChartCard
              title="Quadro de Colaboradores"
              subtitle="Ativos por setor"
              gradientStart={INFO.main}
              gradientEnd={INFO.dark}
              series={[
                { name: 'Meta',  data: chartRows.map((r) => Number(r.PREVISTO || r.META || r.JANEIRO) || 0) },
                { name: 'Real', data: chartRows.map((r) => Number(getVal(r, activeMonth)) || 0) },
              ]}
              options={barOptions}
              type="bar"
              height={180}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartCard
              title="Fluxo de Contratações"
              subtitle="Tendência mensal de entradas"
              gradientStart={SUCCESS.main}
              gradientEnd={SUCCESS.dark}
              series={[{ name: 'Realizado', data: chartRows.map((r) => Number(getVal(r, activeMonth)) || 0) }]}
              options={areaOptions}
              type="area"
              height={180}
            />
          </Grid>
        </Grid>

        {/* Table Row - Line 3 */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DataTable data={data} activeMonth={activeMonth} title="Quadro de Indicadores DP — Ferreira Auditado" />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
