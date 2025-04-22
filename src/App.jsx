import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/medication')
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data); // 👈 LOG IT
        setMedicines(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching medicines:', error);
        setLoading(false);
      });
  }, []);
  
  

  const filteredMedicines = medicines.filter(medicine =>
    medicine.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase())
  );
    
  

  return (
    <div className="app">
      <header className="header">
        <div className="logo-container">
          <span className="logo-icon">💊</span>
          <h1 className="logo-text">medtnr</h1>
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
    <th>Medicine</th>
    <th>Timestamp</th> {/* 👈 New column */}
  </tr>
</thead>
<tbody>
  {filteredMedicines.map((medicine, index) => (
    <tr key={index}>
      <td>{medicine.brandName || '—'}</td>
      <td>{medicine.timestamp ? new Date(medicine.timestamp).toLocaleString() : '—'}</td> {/* 👈 Format nicely */}
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