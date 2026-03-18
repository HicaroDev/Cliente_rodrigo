const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join('c:', 'DEV', 'Cliente Stela - RODRIGO', 'stela-dashboard-app', 'public', 'data.xlsx');
try {
  const workbook = xlsx.readFile(filePath);
  console.log('Sheets found:', workbook.SheetNames);
  
  workbook.SheetNames.forEach(sheetName => {
    console.log(`\n--- Sheet: ${sheetName} ---`);
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    console.log('First 5 rows:');
    console.log(JSON.stringify(data.slice(0, 5), null, 2));
    
    // Also try as objects to see keys
    const objects = xlsx.utils.sheet_to_json(sheet);
    if (objects.length > 0) {
      console.log('Object Keys:', Object.keys(objects[0]));
      console.log('Sample Row:', JSON.stringify(objects[0], null, 2));
    }
  });
} catch (e) {
  console.error('Error reading excel:', e.message);
}
