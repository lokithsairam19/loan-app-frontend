import React, { useState, useEffect } from 'react';
import { getCountries, addCountry, updateCountry } from '../api';

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [form, setForm] = useState({ countryName: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await getCountries();
      setCountries(response.data.countryListDTO || []);
    } catch (err) {
      setError('Error fetching countries');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCountry(editingId, form);
      } else {
        await addCountry(form);
      }
      fetchCountries();
      setForm({ countryName: '' });
      setEditingId(null);
    } catch (err) {
      setError('Error saving country');
    }
  };

  const handleEdit = (country) => {
    setForm({ countryName: country.countryName });
    setEditingId(country.countryId);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Countries</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">{editingId ? 'Edit Country' : 'Add Country'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="countryName" className="form-label">Country Name</label>
              <input
                type="text"
                id="countryName"
                value={form.countryName}
                onChange={(e) => setForm({ countryName: e.target.value })}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Country' : 'Add Country'}
            </button>
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Country List</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Country Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((country) => (
                <tr key={country.countryId}>
                  <td>{country.countryId}</td>
                  <td>{country.countryName}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(country)}
                      className="btn btn-warning btn-sm"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Countries;
