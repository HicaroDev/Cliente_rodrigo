import XLSX from 'xlsx';
import path from 'path';

const filePath = path.join('c:', 'DEV', 'Cliente Stela - RODRIGO', 'stela-dashboard-app', 'public', 'data.xlsx');

try {
  const workbook = XLSX.readFile(filePath);
  
  const targetSheets = ['ANALISES COMERCIAL', 'ANALISES FIN.', 'ANALISES SEPARACAO', 'DASH DP', 'BD'];
  
  targetSheets.forEach(name => {
    if (!workbook.Sheets[name]) {
      console.log(`\n!!! SHEET NOT FOUND: ${name} !!!`);
      return;
    }
    console.log(`\n--- SHEET DUMP: ${name} ---`);
    const sheet = workbook.Sheets[name];
    const data = XLSX.utils.sheet_to_json(sheet);
    if (data.length > 0) {
      console.log('ROWS COUNT:', data.length);
      console.log('KEYS (from first 5 rows):');
      const allKeys = new Set();
      data.slice(0, 5).forEach(r => Object.keys(r).forEach(k => allKeys.add(k)));
      console.log(Array.from(allKeys));
      console.log('SAMPLE DATA (First 10 rows):');
      data.slice(0, 10).forEach((r, i) => {
        console.log(`ROW ${i}:`, JSON.stringify(r));
      });
    } else {
      console.log('EMPTY SHEET');
    }
  });
} catch (e) {
  console.error('ERROR:', e.message);
}
