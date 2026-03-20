const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const https = require('https');

const zipUrl = 'https://v0chat-agent-data-prod.s3.us-east-1.amazonaws.com/vm-binary/q6cbKE9dY9X/e69842d518fcf5806fb742bd0d48aefbd903185ac80bf689f16cf267895fd319.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA52KF4VHQDTZ5RDMT%2F20260320%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260320T131502Z&X-Amz-Expires=3600&X-Amz-Signature=11d5975256d0658927a1f284c17a4b7b5241c1edb51a66f7f423c61a160256c4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject';

console.log('Pobieranie pliku ZIP...');

https.get(zipUrl, (response) => {
  const chunks = [];
  
  response.on('data', (chunk) => chunks.push(chunk));
  
  response.on('end', () => {
    const buffer = Buffer.concat(chunks);
    console.log('Pobrano:', buffer.length, 'bajtów');
    
    extractZip(buffer);
  });
}).on('error', (e) => {
  console.error('Błąd pobierania:', e.message);
});

function extractZip(buffer) {
  const outputDir = './wp-crowdfunding-extracted';
  
  // ZIP Local File Header signature: 0x04034b50
  const LOCAL_FILE_HEADER = 0x04034b50;
  const CENTRAL_DIR_HEADER = 0x02014b50;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let offset = 0;
  let fileCount = 0;
  const files = [];

  while (offset < buffer.length - 4) {
    const signature = buffer.readUInt32LE(offset);
    
    if (signature === LOCAL_FILE_HEADER) {
      const compressionMethod = buffer.readUInt16LE(offset + 8);
      const compressedSize = buffer.readUInt32LE(offset + 18);
      const fileNameLength = buffer.readUInt16LE(offset + 26);
      const extraFieldLength = buffer.readUInt16LE(offset + 28);
      
      const fileName = buffer.toString('utf8', offset + 30, offset + 30 + fileNameLength);
      const dataOffset = offset + 30 + fileNameLength + extraFieldLength;
      const compressedData = buffer.subarray(dataOffset, dataOffset + compressedSize);
      
      files.push({
        name: fileName,
        compressionMethod,
        compressedSize,
        data: compressedData
      });
      
      fileCount++;
      offset = dataOffset + compressedSize;
    } else if (signature === CENTRAL_DIR_HEADER) {
      break;
    } else {
      offset++;
    }
  }

  console.log(`Znaleziono ${fileCount} plików/folderów`);

  for (const file of files) {
    const filePath = path.join(outputDir, file.name);
    
    if (file.name.endsWith('/')) {
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
    } else {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      let content;
      if (file.compressionMethod === 0) {
        content = file.data;
      } else if (file.compressionMethod === 8) {
        try {
          content = zlib.inflateRawSync(file.data);
        } catch (e) {
          continue;
        }
      } else {
        continue;
      }
      
      fs.writeFileSync(filePath, content);
      console.log('FILE:', file.name);
    }
  }

  console.log('\nRozpakowano pomyślnie!');
  
  // List structure
  console.log('\nStruktura:');
  const listDir = (dir, indent = 0) => {
    try {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of items) {
        console.log('  '.repeat(indent) + item.name);
        if (item.isDirectory() && indent < 2) {
          listDir(path.join(dir, item.name), indent + 1);
        }
      }
    } catch(e) {}
  };
  listDir(outputDir);
}
