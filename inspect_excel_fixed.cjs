const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join('c:', 'DEV', 'Cliente Stela - RODRIGO', 'stela-dashboard-app', 'public', 'data.xlsx');
console.log('Reading:', filePath);

try {
  const workbook = XLSX.readFile(filePath);
  console.log('Sheets:', workbook.SheetNames);
  
  workbook.SheetNames.forEach(name => {
    console.log(`\n--- ${name} ---`);
    const sheet = workbook.Sheets[name];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    console.log('Columns (Row 0):', data[0]);
    console.log('Sample Row 1:', data[1]);
  });
} catch (e) {
  console.error(e.message);
}
