import React, { useState, useEffect } from 'react';
import { getOccupations, addOccupation, updateOccupation } from '../api';

const Occupations = () => {
  const [occupations, setOccupations] = useState([]);
  const [form, setForm] = useState({ occupationName: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOccupations();
  }, []);

  const fetchOccupations = async () => {
    try {
      const response = await getOccupations();
      setOccupations(response.data.occupationListDTO || []);
    } catch (err) {
      setError('Error fetching occupations');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateOccupation(editingId, form);
      } else {
        await addOccupation(form);
      }
      fetchOccupations();
      setForm({ occupationName: '' });
      setEditingId(null);
    } catch (err) {
      setError('Error saving occupation');
    }
  };

  const handleEdit = (occupation) => {
    setForm({ occupationName: occupation.occupationName });
    setEditingId(occupation.occupationId);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Occupations</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">{editingId ? 'Edit Occupation' : 'Add Occupation'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="occupationName" className="form-label">Occupation Name</label>
              <input
                type="text"
                id="occupationName"
                value={form.occupationName}
                onChange={(e) => setForm({ occupationName: e.target.value })}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Occupation' : 'Add Occupation'}
            </button>
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Occupation List</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Occupation Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {occupations.map((occupation) => (
                <tr key={occupation.occupationId}>
                  <td>{occupation.occupationId}</td>
                  <td>{occupation.occupationName}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(occupation)}
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

export default Occupations;
