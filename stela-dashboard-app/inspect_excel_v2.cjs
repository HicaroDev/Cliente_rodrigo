const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'data.xlsx');
console.log('Reading:', filePath);

try {
  const workbook = XLSX.readFile(filePath);
  console.log('Sheets:', workbook.SheetNames);
  
  workbook.SheetNames.forEach(name => {
    console.log(`\n--- ${name} ---`);
    const sheet = workbook.Sheets[name];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    console.log('Length:', data.length);
    if (data.length > 0) {
      console.log('Headers (First Row):', data[0]);
    }
    if (data.length > 1) {
      console.log('Sample Data (Row 1):', data[1]);
    }
  });
} catch (e) {
  console.error('ERROR:', e.message);
}
