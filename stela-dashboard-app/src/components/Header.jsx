import React from 'react';
import { 
  Box, 
  Typography, 
  Breadcrumbs, 
  Link, 
  IconButton, 
  InputBase,
  MenuItem,
  Select,
  FormControl,
  alpha 
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Person, 
  Notifications, 
  Settings,
  CalendarMonth
} from '@mui/icons-material';
import { GREY, PRIMARY } from '../theme';
import { formatDate } from '../utils/dataUtils';

const Header = ({ pageTitle, breadcrumb, activeMonth, onMonthChange, months = [] }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      py: 1.5, 
      px: 3, 
      mb: 2.5,
      background: 'rgba(255, 255, 255, 0.4)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 15px rgba(0, 0, 0, 0.03)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
    }}>
      {/* Left: Breadcrumbs & Title */}
      <Box>
        <Breadcrumbs sx={{ 
          '& .MuiBreadcrumbs-separator': { color: GREY[400], fontSize: 9 },
          mb: 0.1
        }}>
          <Link underline="hover" color="inherit" href="/" sx={{ fontSize: 11, color: GREY[400], fontWeight: 300, letterSpacing: 0.5 }}>
             FERREIRA DIST.
          </Link>
          <Typography sx={{ fontSize: 11, color: GREY[700], fontWeight: 400, textTransform: 'uppercase', letterSpacing: 1 }}>
             {breadcrumb}
          </Typography>
        </Breadcrumbs>
        <Typography sx={{ 
          fontWeight: 600, 
          color: '#344767', 
          fontSize: '1.1rem',
          fontFamily: "'Outfit', sans-serif",
          letterSpacing: '-0.3px'
        }}>
          {pageTitle}
        </Typography>
      </Box>

      {/* Right: Tools & Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2.5 } }}>
        
        {/* Period Selector Integrated */}
        {months.length > 0 && (
          <Box sx={{ 
            display: { xs: 'none', sm: 'flex' }, 
            alignItems: 'center', 
            gap: 1.2,
            bgcolor: '#fff',
            px: 1.8,
            py: 0.4,
            borderRadius: 2.5,
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.02)',
            border: `1px solid ${alpha(GREY[300], 0.3)}`
          }}>
            <CalendarMonth sx={{ color: PRIMARY.main, fontSize: 16 }} />
            <FormControl variant="standard" sx={{ minWidth: 130 }}>
              <Select
                value={activeMonth}
                onChange={(e) => onMonthChange(e.target.value)}
                sx={{ 
                  fontSize: 12, 
                  fontWeight: 400, 
                  color: '#344767',
                  '&:before, &:after': { display: 'none' }
                }}
              >
                {months.map(m => (
                  <MenuItem key={m} value={m} sx={{ fontWeight: 300, fontSize: 12 }}>
                    {m === 'Todos' ? 'MÉTRICAS TOTAIS' : formatDate(m).toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Search sleek placeholder */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' }, 
          alignItems: 'center', 
          bgcolor: 'transparent',
          borderRadius: 2, 
          px: 1,
          border: `1px solid ${alpha(GREY[300], 0.3)}`,
        }}>
          <InputBase 
            placeholder="Pesquisar..." 
            sx={{ ml: 1, width: 100, fontSize: 11, color: GREY[800], fontWeight: 300 }} 
          />
          <IconButton size="small"><SearchIcon sx={{ fontSize: 16, color: GREY[400] }} /></IconButton>
        </Box>

        {/* Global Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton sx={{ color: '#344767' }} size="small"><Notifications sx={{ fontSize: 20 }} /></IconButton>
          <IconButton sx={{ color: '#344767' }} size="small"><Settings sx={{ fontSize: 20 }} /></IconButton>
          <IconButton sx={{ color: '#344767' }} size="small"><Person sx={{ fontSize: 20 }} /></IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
