import React, { Suspense } from 'react';
import { Card, Box, Typography, Divider, alpha, CircularProgress } from '@mui/material';
import { Schedule } from '@mui/icons-material';
import Chart from 'react-apexcharts';
import { STELA_SHADOWS, GREY } from '../theme';

/**
 * ChartCard — Premium gradient chart container
 */
export default function ChartCard({ 
  title, 
  subtitle, 
  gradientStart, 
  gradientEnd, 
  series, 
  options = {}, 
  type = 'bar', 
  height = 200, // Reduced default height
}) {
  
  const defaultOptions = {
    chart: {
      toolbar: { show: false },
      background: 'transparent',
      parentHeightOffset: 0,
      fontFamily: "'Outfit', sans-serif",
      animations: { enabled: true, easing: 'easeinout', speed: 800 },
    },
    theme: { mode: 'light' },
    grid: {
      show: true,
      borderColor: 'rgba(255, 255, 255, 0.12)',
      strokeDashArray: 4,
      padding: { top: 10, right: 10, bottom: 0, left: 10 },
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2.5 },
    markers: { size: 3, strokeWidth: 2, hover: { size: 5 } },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        rotate: -45,
        rotateAlways: false,
        style: {
          colors: 'rgba(255, 255, 255, 0.85)',
          fontSize: '10px',
          fontWeight: 300,
        },
      },
      ...options?.xaxis,
    },
    yaxis: {
      labels: {
        style: {
          colors: 'rgba(255, 255, 255, 0.85)',
          fontSize: '10px',
          fontWeight: 300,
        },
      },
      ...options?.yaxis,
    },
    legend: { 
      show: true, 
      position: 'top', 
      horizontalAlign: 'right',
      labels: { colors: 'rgba(255,255,255,0.8)', useSeriesColors: false },
      markers: { radius: 12 }
    },
    tooltip: { 
      theme: 'dark',
      style: { fontSize: '12px', fontFamily: "'Outfit', sans-serif" }
    },
    ...options,
  };

  return (
    <Card sx={{ 
      position: 'relative', 
      overflow: 'visible', 
      mt: 4, 
      p: 2, 
      pt: 0,
      borderRadius: 4, 
      boxShadow: STELA_SHADOWS.card,
      border: 'none',
      background: '#fff',
      transition: 'transform 0.2s ease',
      '&:hover': { transform: 'translateY(-4px)' }
    }}>
      {/* Elevated Chart Box */}
      <Box sx={{ 
        position: 'relative',
        top: -24,
        background: `linear-gradient(195deg, ${gradientStart}, ${gradientEnd})`,
        borderRadius: 3,
        p: 2,
        boxShadow: `0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px ${alpha(gradientEnd, 0.4)}`,
        zIndex: 1,
      }}>
        <Suspense fallback={<Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress color="inherit" size={24} /></Box>}>
          <Chart options={defaultOptions} series={series} type={type} height={height} />
        </Suspense>
      </Box>

      {/* Content Area */}
      <Box sx={{ px: 2, pt: 3, pb: 2 }}> {/* Updated padding */}
        <Typography variant="h6" sx={{ 
          fontWeight: 600, 
          color: '#344767', 
          fontSize: '0.9rem',
          fontFamily: "'Outfit', sans-serif",
          textTransform: 'uppercase'
        }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ 
          color: GREY[500], 
          mt: 0.1,
          fontWeight: 300,
          fontSize: '0.8rem'
        }}>
          {subtitle}
        </Typography>
        
        <Divider sx={{ my: 2, borderColor: alpha(GREY[200], 0.6) }} /> {/* Updated divider */}
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Schedule sx={{ fontSize: 14, color: GREY[400] }} />
          <Typography variant="caption" sx={{ color: GREY[500], fontWeight: 300, fontSize: 11 }}>
            Atualizado agora mesmo
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
