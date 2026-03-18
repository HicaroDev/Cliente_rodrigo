import {
  Card, Box, Typography, Stack, Table, TableHead,
  TableRow, TableCell, TableBody, TableContainer, IconButton, alpha, LinearProgress, Tooltip
} from '@mui/material';
import { CheckCircle as CheckIcon, MoreVert, InfoOutlined, TrendingUp, TrendingDown } from '@mui/icons-material';
import { GREY, SUCCESS, WARNING, ERROR, RODRIGO_SHADOWS, INFO, PRIMARY } from '../theme';
import { formatCurrency, formatPercent, getVal } from '../utils/dataUtils';

const isPercentValue = (v) => {
  const n = Number(v);
  return !isNaN(n) && n > 0 && n <= 1;
};

const formatCellValue = (v) => {
  if (v === undefined || v === null || v === '' || v === 0) return '—';
  const n = Number(v);
  if (isNaN(n)) return String(v);
  if (isPercentValue(v)) return formatPercent(n);
  if (Math.abs(n) >= 1000) return formatCurrency(n);
  return String(n);
};

/**
 * DataTable — indicators table with Premium Edition standards
 */
export default function DataTable({ data = [], title = 'Painel de Indicadores', activeMonth = 'Todos' }) {
  const completed = data.filter((r) => {
    const real = getVal(r, activeMonth);
    const prev = r.PREVISTO || r.JANEIRO || r.__EMPTY_1 || 0;
    return Number(real) >= Number(prev) && Number(prev) > 0;
  }).length;

  return (
    <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: RODRIGO_SHADOWS.card, bgcolor: '#fff', border: `1px solid ${alpha(GREY[400], 0.05)}` }}>
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${alpha(GREY[300], 0.08)}`,
          background: `linear-gradient(to right, #ffffff, ${alpha(GREY[50], 0.3)})`
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 500, color: '#344767', fontSize: 16, fontFamily: "'Outfit', sans-serif", letterSpacing: -0.2 }}>
            {title}
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center" mt={0.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 0.8, py: 0.1, bgcolor: alpha(SUCCESS.main, 0.06), borderRadius: 1 }}>
               <CheckIcon sx={{ fontSize: 11, color: SUCCESS.dark }} />
               <Typography variant="caption" sx={{ color: SUCCESS.dark, fontWeight: 500, fontSize: 10, letterSpacing: 0.2 }}>
                 {completed} METAS ATINGIDAS
               </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: GREY[400], fontWeight: 300, fontSize: 10 }}>
              de {data.length} indicadores auditados
            </Typography>
          </Stack>
        </Box>
        <Tooltip title="Opções">
          <IconButton size="small" sx={{ bgcolor: alpha(GREY[200], 0.3), '&:hover': { bgcolor: GREY[200] } }}>
            <MoreVert sx={{ color: GREY[400], fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Table Area */}
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 300, color: GREY[400], py: 1.5, px: 3, fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', bgcolor: '#fff' }}>
                INDICADOR
              </TableCell>
              <TableCell sx={{ fontWeight: 300, color: GREY[400], fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', bgcolor: '#fff' }}>
                 DEPTO
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 300, color: GREY[400], fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', bgcolor: '#fff' }}>
                META
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 300, color: GREY[400], fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', bgcolor: '#fff' }}>
                REALIZADO
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 300, color: GREY[400], fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', bgcolor: '#fff' }}>
                PERFORMANCE
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <Stack alignItems="center" spacing={1}>
                    <InfoOutlined sx={{ fontSize: 32, color: GREY[100] }} />
                    <Typography variant="caption" sx={{ color: GREY[300], fontWeight: 300 }}>
                      Nenhum dado para exibir
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, i) => {
                const real = getVal(row, activeMonth);
                const prev = row.PREVISTO || row.JANEIRO || row.META || 0;
                const isMetaLong = typeof prev === 'number' && prev > 0;
                const atingiu = isMetaLong ? real >= prev : true;
                
                // Progress percentage
                const pctRaw = isMetaLong ? (real / prev) * 100 : 0;
                const pctDisplay = Math.min(Math.round(pctRaw), 100);

                return (
                  <TableRow
                    key={i}
                    hover
                    sx={{ 
                      '&:last-child td': { border: 0 },
                      '&:hover': { bgcolor: alpha(PRIMARY.main, 0.01) }
                    }}
                  >
                    <TableCell sx={{ py: 1.5, px: 3 }}>
                      <Typography sx={{ fontWeight: 400, color: '#344767', fontSize: 13 }}>
                        {row.INDICADOR || row.ITEM || row.__EMPTY || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ px: 0.8, py: 0.1, bgcolor: alpha(INFO.main, 0.04), borderRadius: 1, display: 'inline-block' }}>
                        <Typography variant="caption" sx={{ color: INFO.dark, fontWeight: 400, fontSize: 9, textTransform: 'uppercase' }}>
                          {row.DEPT || row.DEPTO || 'GERAL'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ color: GREY[400], fontWeight: 300, fontSize: 12 }}>
                        {formatCellValue(prev)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 500, color: '#344767', fontSize: 13 }}>
                        {formatCellValue(real)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {isMetaLong ? (
                        <Box sx={{ width: '100px', display: 'inline-block' }}>
                           <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.4}>
                              <Typography variant="caption" sx={{ fontWeight: 400, color: atingiu ? SUCCESS.dark : (pctDisplay > 50 ? WARNING.dark : ERROR.dark), fontSize: 10 }}>
                                 {pctRaw.toFixed(1)}%
                              </Typography>
                              {atingiu ? <TrendingUp sx={{ fontSize: 12, color: SUCCESS.main }} /> : <TrendingDown sx={{ fontSize: 12, color: pctDisplay > 50 ? WARNING.main : ERROR.main }} />}
                           </Stack>
                           <LinearProgress 
                              variant="determinate" 
                              value={pctDisplay} 
                              sx={{ 
                                height: 3, 
                                borderRadius: 4, 
                                bgcolor: alpha(GREY[400], 0.08),
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 4,
                                  bgcolor: atingiu ? SUCCESS.main : (pctDisplay > 50 ? WARNING.main : ERROR.main)
                                }
                              }} 
                           />
                        </Box>
                      ) : (
                        <Typography variant="caption" sx={{ color: GREY[200], fontStyle: 'italic', fontWeight: 300, fontSize: 10 }}>
                          SEM META
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
