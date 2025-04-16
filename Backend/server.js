const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2/promise');
const fs = require('fs');
const csv = require('csv-parser');
const { v4: uuidv4 } = require('uuid');

const port = 3000;

app.use(cors());

// MySQL pool setup
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Password123',
  database: 'medtnr_inventory',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// =========================
// ⬇️ CSV Processing Helpers
// =========================

const dosageRegex = /(\d+\s?(mg|g|ml|mcg|IU)\b)|(tablet|capsule|injection)\b/i;

function cleanMedicationName(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim()
    .toUpperCase();
}

async function processRow(row) {
  const confidence = parseFloat(row.Confidence);
  if (confidence < 0.85) return;

  const raw = row.Text.trim();
  const normalizedText = cleanMedicationName(raw);
  const dosageMatch = normalizedText.match(dosageRegex);
  const dosage = dosageMatch ? dosageMatch[0] : 'N/A';

  let brandName = normalizedText.replace(dosage, '').trim();
  brandName = cleanMedicationName(brandName);

  if (!brandName || brandName.length < 3) return;

  try {
    const [results] = await pool.query(
      `SELECT COUNT(*) AS count FROM medication WHERE TRIM(UPPER(brandName)) = ? AND dosage = ?`,
      [brandName, dosage]
    );

    if (results[0].count === 0) {
      const medicineID = uuidv4().slice(0, 8);
      await pool.query(
        `INSERT INTO medication 
         (medicineID, brandName, dosage, barcode, manufacturer, storedAt) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [medicineID, brandName, dosage, 'N/A', null, null]
      );
      console.log(`✅ Inserted: ${brandName} | ${dosage}`);
    } else {
      console.log(`⚠️ Skipped duplicate: ${brandName} | ${dosage}`);
    }
  } catch (err) {
    console.error(`❌ Error processing ${brandName}:`, err);
  }
}

let processedLines = new Set();

async function watchCSV() {
  console.log('👀 Watching ocr_results.csv for updates...');

  fs.watchFile('ocr_results.csv', { interval: 1000 }, async () => {
    const rows = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream('ocr_results.csv')
        .pipe(csv())
        .on('data', (row) => rows.push(row))
        .on('end', resolve)
        .on('error', reject);
    });

    for (const row of rows) {
      const rowKey = `${row.Text.trim()}|${row.Confidence}`;
      if (!processedLines.has(rowKey)) {
        processedLines.add(rowKey);
        await processRow(row);
      }
    }
  });
}

// =========================
// ⬇️ API Endpoint
// =========================

app.get('/medication', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM medication');
    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching medications:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =========================
// ⬇️ Start Server + Watch CSV
// =========================

app.listen(port, async () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);

  try {
    await watchCSV(); // start continuous file watch
  } catch (err) {
    console.error('❌ CSV Watch Error:', err);
  }
});
