import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Divider, alpha, Button } from '@mui/material';
import { 
  Assessment, 
  Settings, 
  People, 
  ReceiptLong, 
  Dashboard, 
  RocketLaunch,
  AutoGraph
} from '@mui/icons-material';
import { DRAWER_WIDTH, PRIMARY, GREY, RODRIGO_SHADOWS } from '../theme';

const Sidebar = ({ activeTab, onTabChange, onRefresh }) => {
  const menuItems = [
    { id: 'comercial_estrat', label: 'Dashboard Estratégico', icon: <Assessment />, color: '#49a3f1' },
    { id: 'comercial_op',    label: 'Dashboard Operacional', icon: <AutoGraph />, color: '#66BB6A' },
    { id: 'financeiro',      label: 'Gestão Financeira',    icon: <ReceiptLong />, color: '#EF5350' },
    { id: 'pessoal',         label: 'Gestão de Pessoal',    icon: <People />, color: '#FFA726' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          height: '100vh',
          boxSizing: 'border-box',
          bgcolor: '#ffffff',
          color: '#344767',
          border: 'none',
          borderRight: `1px solid ${alpha(GREY[200], 0.5)}`,
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
        },
      }}
    >
      {/* Brand Section */}
      <Box sx={{ pt: 5, pb: 4, px: 3, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 1.5 }}>
           <Box sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: '#344767', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 8px rgba(0,0,0,0.08)'
           }}>
             <RocketLaunch sx={{ color: '#fff', fontSize: 16 }} />
           </Box>
           <Typography sx={{ fontWeight: 500, letterSpacing: 0.5, fontSize: 18, color: '#344767', fontFamily: "'Outfit', sans-serif" }}>
             RODRIGO PRO
           </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: GREY[400], fontWeight: 300, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase' }}>
           Ferreira Distribuidora
        </Typography>
      </Box>

      <Divider sx={{ mx: 4, borderColor: alpha(GREY[200], 0.3) }} />

      {/* Navigation List */}
      <List sx={{ px: 2, py: 4, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <ListItem
              key={item.id}
              onClick={() => onTabChange(item.id)}
              sx={{
                borderRadius: 2,
                mb: 1.2,
                px: 2,
                py: 1,
                cursor: 'pointer',
                bgcolor: isActive ? (item.color || PRIMARY.main) : 'transparent',
                color: isActive ? '#fff' : GREY[600],
                boxShadow: isActive ? `0 4px 10px -2px ${alpha(item.color || PRIMARY.main, 0.3)}` : 'none',
                transition: 'all 0.25s ease',
                '&:hover': {
                   bgcolor: isActive ? item.color : alpha(GREY[100], 0.6),
                   color: isActive ? '#fff' : '#344767'
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                {React.cloneElement(item.icon, { sx: { fontSize: 18, opacity: isActive ? 1 : 0.7 } })}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ 
                  fontWeight: isActive ? 500 : 300,
                  fontSize: 14,
                  fontFamily: "'Outfit', sans-serif",
                  letterSpacing: 0.2
                }} 
              />
            </ListItem>
          );
        })}
      </List>

      {/* Footer Settings */}
      <Box sx={{ p: 3 }}>
        <Divider sx={{ mb: 3, borderColor: alpha(GREY[300], 0.4) }} />
        <Button
          fullWidth
          variant="text"
          onClick={onRefresh}
          sx={{
            justifyContent: 'flex-start',
            color: GREY[600],
            textTransform: 'none',
            borderRadius: 2,
            px: 2,
            fontWeight: 600,
            '&:hover': { bgcolor: alpha(GREY[200], 0.4), color: '#344767' }
          }}
          startIcon={<Settings />}
        >
          Sincronizar Dados
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
