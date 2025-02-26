import React from 'react';
import './App.css';

const medicines = [
  {
    name: 'Aspirin',
    dosage: '100mg',
    frequency: 'Daily',
    sideEffects: 'Nausea',
    category: 'Painkiller',
    manufacturer: 'Bayer',
    stock: 'In Stock',
    price: '$10',
  },
  {
    name: 'Ibuprofen',
    dosage: '200mg',
    frequency: 'Twice a day',
    sideEffects: 'Dizziness',
    category: 'Anti-inflammatory',
    manufacturer: 'Advil',
    stock: 'Out of Stock',
    price: '$15',
  },
  // Add more medicine objects as needed...
];

function App() {
  return (
    <div className="App">
      <header className="header">
        Medtnr
      </header>
      <main className="content">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Side Effects</th>
              <th>Category</th>
              <th>Manufacturer</th>
              <th>Stock</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine, index) => (
              <tr key={index}>
                <td>{medicine.name}</td>
                <td>{medicine.dosage}</td>
                <td>{medicine.frequency}</td>
                <td>{medicine.sideEffects}</td>
                <td>{medicine.category}</td>
                <td>{medicine.manufacturer}</td>
                <td>{medicine.stock}</td>
                <td>{medicine.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default App;
