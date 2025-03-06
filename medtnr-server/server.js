const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS so your React app can talk to this server

// 1. Create a connection to your MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',         // change to your MySQL username
  password: 'password', // change to your MySQL password
  database: 'mydatabase'
});

// 2. Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL');
});

// 3. Define an endpoint to retrieve medicines
app.get('/medicines', (req, res) => {
  const query = `
    SELECT name, dosage, frequency, sideEffects, category, manufacturer, stock, price
    FROM medicines
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching medicines: ', err);
      return res.status(500).send('Database error');
    }
    res.json(results);
  });
});

// 4. Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

