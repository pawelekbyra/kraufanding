const fs = require('fs');
const lines = fs.readFileSync('app/zrzutka/CampaignContent.tsx', 'utf8').split('\n');
console.log('--- Lines 150-185 ---');
for (let i = 149; i < 185; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
