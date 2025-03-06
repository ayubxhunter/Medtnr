import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/medication') // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        setMedicines(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching medicines:', error);
        setLoading(false);
      });
  }, []);

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <header className="header">
        <div className="logo-container">
          <span className="logo-icon">💊</span>
          <h1 className="logo-text">Medtnr</h1>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search medicines or manufacturers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </header>

      <main className="content">
        <div className="card">
          <div className="card-header">
            <h2>Medication Inventory</h2>
            <div className="medicine-count">
              {filteredMedicines.length} medication{filteredMedicines.length !== 1 ? 's' : ''} found
            </div>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading medication data...</p>
            </div>
          ) : (
            <div className="table-container">
              {filteredMedicines.length > 0 ? (
                <table className="medicines-table">
                  <thead>
                    <tr>
                      <th>Medicine ID</th>
                      <th>Name</th>
                      <th>Dosage</th>
                      <th>Barcode</th>
                      <th>Manufacturer</th>
                      <th>Storage Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMedicines.map((medicine, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                        <td><span className="medicine-id">{medicine.medicineID}</span></td>
                        <td>{medicine.name}</td>
                        <td>{medicine.dosage}</td>
                        <td>{medicine.barcode}</td>
                        <td>{medicine.manufacturer}</td>
                        <td>
                          {medicine.storedAt ? (
                            <div className="storage-badge">{medicine.storedAt}</div>
                          ) : (
                            <div className="storage-badge empty">Not specified</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-results">
                  <p>No medications found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <footer className="footer">
        <p>© 2025 Medtnr - Medication Inventory System</p>
      </footer>
    </div>
  );
}

export default App;