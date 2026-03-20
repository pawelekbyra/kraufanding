const fs = require('fs');
const path = require('path');

const sourceDir = './wp-crowdfunding-extracted';
const files = {};

function readAllFiles(dir, relativePath = '') {
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      const relPath = path.join(relativePath, item.name);
      
      if (item.isDirectory()) {
        readAllFiles(fullPath, relPath);
      } else {
        // Only read PHP, JS, CSS files
        if (/\.(php|js|css|txt|pot)$/.test(item.name)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            files[relPath] = content;
          } catch (e) {}
        }
      }
    }
  } catch (e) {
    console.error('Error reading directory:', e.message);
  }
}

readAllFiles(sourceDir);

// Output as JSON for analysis
console.log('=== FILES FOUND ===');
console.log(Object.keys(files).length, 'files');
console.log('\n=== KEY FILES ===\n');

// Show main plugin file
if (files['wp-crowdfunding/wp-crowdfunding.php']) {
  console.log('=== wp-crowdfunding.php ===');
  console.log(files['wp-crowdfunding/wp-crowdfunding.php'].substring(0, 5000));
}

// Show main Functions
if (files['wp-crowdfunding/includes/Functions.php']) {
  console.log('\n=== Functions.php ===');
  console.log(files['wp-crowdfunding/includes/Functions.php'].substring(0, 8000));
}

// Show Single Campaign Block
if (files['wp-crowdfunding/includes/blocks/Single_Campaign.php']) {
  console.log('\n=== Single_Campaign.php ===');
  console.log(files['wp-crowdfunding/includes/blocks/Single_Campaign.php'].substring(0, 5000));
}
