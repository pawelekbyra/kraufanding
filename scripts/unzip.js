import { execSync } from 'child_process';
import path from 'path';

const zipFile = path.join(process.cwd(), 'wp-crowdfunding.2.1.17.zip');
const outputDir = path.join(process.cwd(), 'wp-crowdfunding-extracted');

console.log('Rozpakowywanie pliku ZIP...');
console.log('Plik źródłowy:', zipFile);
console.log('Katalog docelowy:', outputDir);

try {
  execSync(`unzip -o "${zipFile}" -d "${outputDir}"`, { stdio: 'inherit' });
  console.log('Rozpakowano pomyślnie!');
} catch (error) {
  console.error('Błąd podczas rozpakowywania:', error.message);
}
