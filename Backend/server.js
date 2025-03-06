const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const port = 3000;

app.use(cors());

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Password123',
    database: 'medtnr_inventory'
});

connection.connect((err) => {
    if(err) {
        console.error('Error connecting to mysql:' + err.stack);
        return;
    }
    console.log('Connected to MySQL as ID');
});


app.get('/medication', (req, res) => {
    connection.query('SELECT * FROM Medication', (err, results) => {
        if(err) {
            console.error('Error: ', err);
            res.status(500).send('Database Query Error')
            return;
        }
        res.json(results);
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
