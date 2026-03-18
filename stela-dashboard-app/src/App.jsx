import React, { useState, useEffect, useMemo } from 'react';
import { Box, LinearProgress, Card, Typography, Button, alpha, Fade, Container } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { fetchExcel, parseExcel, SHEET_MAP } from './utils/dataUtils';
import Sidebar from './components/Sidebar';
import ComercialDashboard    from './components/departments/ComercialDashboard';
import ComercialOpDashboard  from './components/departments/ComercialOpDashboard';
import FinanceiroDashboard   from './components/departments/FinanceiroDashboard';
import PessoalDashboard      from './components/departments/PessoalDashboard';
import { GREY, PRIMARY, DRAWER_WIDTH } from './theme';

const getSheetOrDeptData = (workbook, flatData, sheetName, deptKeyword) => {
  if (workbook[sheetName] && workbook[sheetName].length) return workbook[sheetName];
  const key = Object.keys(workbook).find(k => k.toUpperCase().includes(sheetName.toUpperCase()));
  if (key && workbook[key].length) return workbook[key];
  return flatData.filter(r => (r.DEPT || r.DEPTO || '').toString().toLowerCase().includes(deptKeyword.toLowerCase()));
};

export default function App() {
  const [workbook, setWorkbook] = useState({});
  const [loading,  setLoading]  = useState(false);
  const [activeTab, setActiveTab] = useState('comercial_estrat');
  const [activeMonth, setActiveMonth] = useState('Todos');

  const loadData = async () => {
    setLoading(true);
    try {
      const sheets = await fetchExcel('/data.xlsx');
      setWorkbook(sheets);
      
      const allRows = Object.values(sheets).flat();
      const availableMonths = new Set();
      allRows.forEach(r => {
        const d = r.DATA || r.Data || r.Mês || r.MES;
        if (d) availableMonths.add(String(d));
      });
      
      if (availableMonths.size > 0 && activeMonth === 'Todos') {
        const sorted = Array.from(availableMonths).sort();
        setActiveMonth(sorted[sorted.length - 1]);
      }
    } catch (e) {
      console.error('Stela Sync Error:', e);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => { loadData(); }, []);

  const flatData = useMemo(() => Object.values(workbook).flat(), [workbook]);
  const months = useMemo(() => {
    const m = new Set(['Todos']);
    flatData.forEach(r => {
      const d = r.DATA || r.Data || r.Mês || r.MES;
      if (d) m.add(String(d));
    });
    return Array.from(m).sort();
  }, [flatData]);

  const hasData = flatData.length > 0;

  const getFiltered = (data) => {
    if (activeMonth === 'Todos') return data;
    return data.filter(r => {
      const rowDate = r.DATA || r.Data || r.Mês || r.MES;
      if (!rowDate) return true;
      return String(rowDate) === activeMonth;
    });
  };

  const dataEstr = useMemo(() => getFiltered(getSheetOrDeptData(workbook, flatData, SHEET_MAP.COMERCIAL_STRAT, 'comercial')), [workbook, flatData, activeMonth]);
  const dataOp   = useMemo(() => getFiltered(getSheetOrDeptData(workbook, flatData, SHEET_MAP.COMERCIAL_OP,    'comercial')), [workbook, flatData, activeMonth]);
  const dataFin  = useMemo(() => getFiltered(getSheetOrDeptData(workbook, flatData, SHEET_MAP.FINANCEIRO,      'financ')),    [workbook, flatData, activeMonth]);
  const dataRh   = useMemo(() => getFiltered(getSheetOrDeptData(workbook, flatData, SHEET_MAP.PESSOAL,        'dp')),        [workbook, flatData, activeMonth]);

  const dashProps = { activeMonth, onMonthChange: setActiveMonth, months };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {loading && (
        <Fade in={loading}>
          <LinearProgress 
            sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, height: 2, bgcolor: alpha(PRIMARY.main, 0.1) }} 
            color="primary" 
          />
        </Fade>
      )}

      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onRefresh={loadData} />

      <Box sx={{ 
        flexGrow: 1, 
        pt: 0, 
        pb: 4,
        transition: 'all 0.3s ease',
        minHeight: '100vh',
        overflowX: 'hidden'
      }}>
        {!hasData && !loading ? (
          <Fade in={true}>
            <Container maxWidth="md" sx={{ py: 10 }}>
              <Card sx={{ p: 6, textAlign: 'center', borderRadius: 6, bgcolor: '#fff', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: `1px solid ${alpha(GREY[200], 0.5)}` }}>
                <CloudUpload sx={{ fontSize: 48, color: PRIMARY.main, mb: 2, opacity: 0.8 }} />
                <Typography variant="h5" sx={{ fontWeight: 500, mb: 1, color: '#344767' }}>Sincronizar Dashboard</Typography>
                <Typography variant="body2" sx={{ color: GREY[500], mb: 4, fontWeight: 300 }}>
                  Carregue a planilha oficial para gerar os KPIs em tempo real.
                </Typography>
                <Button variant="contained" component="label" sx={{ px: 4, py: 1.2, borderRadius: 2, textTransform: 'none', fontWeight: 500, boxShadow: '0 4px 12px rgba(73, 163, 241, 0.3)' }}>
                  Selecionar Planilha .xlsx
                  <input type="file" hidden accept=".xlsx,.xls" onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      setLoading(true);
                      const sheets = await parseExcel(e.target.files[0]);
                      setWorkbook(sheets);
                      setTimeout(() => setLoading(false), 800);
                    }
                  }} />
                </Button>
              </Card>
            </Container>
          </Fade>
        ) : (
          <Box sx={{ pl: '8px', pr: 3, width: '100%', transition: 'all 0.3s' }}>
            <Fade in={!loading} timeout={400}>
              <Box>
                {activeTab === 'comercial_estrat' && <ComercialDashboard   data={dataEstr} {...dashProps} />}
                {activeTab === 'comercial_op'     && <ComercialOpDashboard data={dataOp}   {...dashProps} />}
                {activeTab === 'financeiro'      && <FinanceiroDashboard  data={dataFin}  {...dashProps} />}
                {activeTab === 'pessoal'         && <PessoalDashboard     data={dataRh}   {...dashProps} />}
              </Box>
            </Fade>
          </Box>
        )}
      </Box>
    </Box>
  );
}
