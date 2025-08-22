import React, { useState, useEffect } from 'react';
import { getStates, addState, updateState } from '../api';

const States = () => {
  const [states, setStates] = useState([]);
  const [form, setForm] = useState({ stateName: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await getStates();
      setStates(response.data.stateListDTO || []);
    } catch (err) {
      setError('Error fetching states');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateState(editingId, form);
      } else {
        await addState(form);
      }
      fetchStates();
      setForm({ stateName: '' });
      setEditingId(null);
    } catch (err) {
      setError('Error saving state');
    }
  };

  const handleEdit = (state) => {
    setForm({ stateName: state.stateName });
    setEditingId(state.stateId);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage States</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">{editingId ? 'Edit State' : 'Add State'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="stateName" className="form-label">State Name</label>
              <input
                type="text"
                id="stateName"
                value={form.stateName}
                onChange={(e) => setForm({ stateName: e.target.value })}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update State' : 'Add State'}
            </button>
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">State List</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>State Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {states.map((state) => (
                <tr key={state.stateId}>
                  <td>{state.stateId}</td>
                  <td>{state.stateName}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(state)}
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

export default States;
