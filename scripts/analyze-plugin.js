import https from 'https';
import { Buffer } from 'buffer';

const ZIP_URL = 'https://v0.blob.core.windows.net/v0-user-uploads/af95e2b6-6ece-4f10-9cf4-6caf1f57d4d6/wp-crowdfunding.2.1.17.zip';

// Simple ZIP parser - reads file entries and extracts text content
async function fetchAndAnalyzeZip() {
  return new Promise((resolve, reject) => {
    https.get(ZIP_URL, (response) => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        console.log(`Downloaded ZIP: ${buffer.length} bytes`);
        
        // Parse ZIP central directory
        const files = parseZipDirectory(buffer);
        console.log(`\n=== FOUND ${files.length} FILES ===\n`);
        
        // List all PHP files
        const phpFiles = files.filter(f => f.name.endsWith('.php'));
        console.log(`PHP Files (${phpFiles.length}):`);
        phpFiles.forEach(f => console.log(`  - ${f.name}`));
        
        // Read key files
        const keyFiles = [
          'wp-crowdfunding/wp-crowdfunding.php',
          'wp-crowdfunding/includes/class-wpneo-crowdfunding.php',
          'wp-crowdfunding/includes/woocommerce/class-wpneo-frontend-hook.php',
          'wp-crowdfunding/includes/woocommerce/Dashboard.php',
          'wp-crowdfunding/templates/single-product.php',
          'wp-crowdfunding/templates/campaign-form.php',
          'wp-crowdfunding/templates/dashboard.php',
        ];
        
        console.log('\n=== KEY FILE CONTENTS ===\n');
        
        for (const keyFile of keyFiles) {
          const file = files.find(f => f.name === keyFile || f.name.includes(keyFile.split('/').pop()));
          if (file) {
            const content = extractFileContent(buffer, file);
            console.log(`\n--- ${file.name} ---`);
            console.log(content.substring(0, 8000)); // First 8000 chars
            console.log('\n[... truncated if longer ...]');
          }
        }
        
        // Also list templates
        const templates = files.filter(f => f.name.includes('/templates/'));
        console.log('\n=== TEMPLATE FILES ===');
        templates.forEach(f => console.log(`  - ${f.name}`));
        
        // List assets
        const assets = files.filter(f => f.name.includes('/assets/'));
        console.log('\n=== ASSET FILES ===');
        assets.slice(0, 30).forEach(f => console.log(`  - ${f.name}`));
        
        resolve();
      });
      response.on('error', reject);
    });
  });
}

function parseZipDirectory(buffer) {
  const files = [];
  
  // Find End of Central Directory
  let eocdOffset = buffer.length - 22;
  while (eocdOffset >= 0 && buffer.readUInt32LE(eocdOffset) !== 0x06054b50) {
    eocdOffset--;
  }
  
  if (eocdOffset < 0) {
    console.log('Could not find EOCD');
    return files;
  }
  
  const cdOffset = buffer.readUInt32LE(eocdOffset + 16);
  const cdEntries = buffer.readUInt16LE(eocdOffset + 10);
  
  let offset = cdOffset;
  for (let i = 0; i < cdEntries; i++) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) break;
    
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const uncompressedSize = buffer.readUInt32LE(offset + 24);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localHeaderOffset = buffer.readUInt32LE(offset + 42);
    const compressionMethod = buffer.readUInt16LE(offset + 10);
    
    const name = buffer.toString('utf8', offset + 46, offset + 46 + nameLength);
    
    files.push({
      name,
      compressedSize,
      uncompressedSize,
      localHeaderOffset,
      compressionMethod
    });
    
    offset += 46 + nameLength + extraLength + commentLength;
  }
  
  return files;
}

function extractFileContent(buffer, file) {
  const localOffset = file.localHeaderOffset;
  
  if (buffer.readUInt32LE(localOffset) !== 0x04034b50) {
    return '[Invalid local header]';
  }
  
  const nameLength = buffer.readUInt16LE(localOffset + 26);
  const extraLength = buffer.readUInt16LE(localOffset + 28);
  const dataOffset = localOffset + 30 + nameLength + extraLength;
  
  if (file.compressionMethod === 0) {
    // Stored (no compression)
    return buffer.toString('utf8', dataOffset, dataOffset + file.uncompressedSize);
  } else if (file.compressionMethod === 8) {
    // Deflate - need zlib
    const zlib = require('zlib');
    const compressed = buffer.slice(dataOffset, dataOffset + file.compressedSize);
    try {
      const decompressed = zlib.inflateRawSync(compressed);
      return decompressed.toString('utf8');
    } catch (e) {
      return `[Decompression error: ${e.message}]`;
    }
  }
  
  return `[Unknown compression method: ${file.compressionMethod}]`;
}

fetchAndAnalyzeZip().catch(console.error);
