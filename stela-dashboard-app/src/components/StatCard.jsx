import React from 'react';
import { Card, Box, Typography, Divider, alpha } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { STELA_SHADOWS, GREY, FLOAT_SHADOW } from '../theme';

const StatCard = ({ title, value, badge, icon, color = 'primary', trend = null }) => {
  // Map color strings to theme gradients/colors
  const gradientMap = {
    primary: 'linear-gradient(195deg, #49a3f1, #1A73E8)',
    success: 'linear-gradient(195deg, #66BB6A, #43A047)',
    info:    'linear-gradient(195deg, #42a5f5, #1A73E8)',
    warning: 'linear-gradient(195deg, #FFA726, #FB8C00)',
    error:   'linear-gradient(195deg, #EF5350, #E53935)',
    dark:    'linear-gradient(195deg, #42424a, #191919)',
  };

  const mainColorMap = {
    primary: '#1A73E8',
    success: '#43A047',
    info:    '#1A73E8',
    warning: '#FB8C00',
    error:   '#E53935',
    dark:    '#191919',
  };

  return (
    <Card sx={{ 
      position: 'relative', 
      overflow: 'visible', 
      mt: 3, 
      p: 2, 
      pb: 1.2,
      borderRadius: 3.5, 
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02)',
      border: 'none',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      {/* Elevated Icon Box */}
      <Box sx={{ 
        position: 'absolute',
        top: -18,
        left: 16,
        width: 46,
        height: 46,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2.5,
        background: gradientMap[color] || gradientMap.primary,
        color: '#fff',
        boxShadow: FLOAT_SHADOW(mainColorMap[color] || '#000'),
        zIndex: 2,
      }}>
        {React.cloneElement(icon, { sx: { fontSize: 20 } })}
      </Box>

      {/* Content Area */}
      <Box sx={{ textAlign: 'right', pt: 0.5, px: 1 }}>
        <Typography sx={{ 
          fontSize: 13, 
          fontWeight: 300, 
          color: GREY[500],
          fontFamily: "'Outfit', sans-serif"
        }}>
          {title}
        </Typography>
        <Typography sx={{ 
          fontWeight: 600, 
          color: '#344767',
          fontSize: '1.5rem',
          letterSpacing: -0.5,
          fontFamily: "'Outfit', sans-serif"
        }}>
          {value || '0'}
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ my: 1.5, borderColor: alpha(GREY[200], 0.4) }} />

      {/* Footer / Trend */}
      <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 18 }}>
        {trend ? (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: trend.isPositive ? '#4CAF50' : '#F44336',
            fontWeight: 500,
            fontSize: 12
          }}>
            {trend.isPositive ? <TrendingUp sx={{ fontSize: 14, mr: 0.3 }} /> : <TrendingDown sx={{ fontSize: 14, mr: 0.3 }} />}
            <span style={{ marginRight: '4px' }}>{trend.value}</span>
            <Typography component="span" sx={{ color: GREY[400], fontWeight: 300, fontSize: 12, display: 'inline' }}>
              {trend.label}
            </Typography>
          </Box>
        ) : (
          <Typography sx={{ color: GREY[400], fontSize: 12, fontWeight: 300, letterSpacing: 0.3 }}>
             {badge || 'Mês vigente'}
          </Typography>
        )}
      </Box>
    </Card>
  );
};

export default StatCard;
