const XLSX = require('xlsx');
const path = require('path');

const headers = ['수취인명', '전화번호', '택배사명', '운송장번호', '상품명'];
const data = [
  headers,
  ['홍길동', '010-1234-5678', 'CJ대한통운', '1234567890', '사과 5kg'], // Example row
];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(data);

// Set column widths
ws['!cols'] = [
  { wch: 10 }, // 수취인명
  { wch: 15 }, // 전화번호
  { wch: 15 }, // 택배사명
  { wch: 20 }, // 운송장번호
  { wch: 20 }, // 상품명
];

XLSX.utils.book_append_sheet(wb, ws, '배송정보');

const outputPath = path.join(__dirname, '../public/delivery_template.xlsx');
XLSX.writeFile(wb, outputPath);

console.log(`Template created at: ${outputPath}`);
