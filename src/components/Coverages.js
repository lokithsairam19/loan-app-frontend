import React, { useState, useEffect } from 'react';
import { getCoverages, addCoverage, updateCoverage } from '../api';

const Coverages = () => {
  const [coverages, setCoverages] = useState([]);
  const [form, setForm] = useState({ coverageName: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    fetchCoverages();
  }, []);

  const fetchCoverages = async () => {
    try {
      const response = await getCoverages();
      setCoverages(response.data.coverageListDTO || []);
    } catch (err) {
      setError('Error fetching coverages');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCoverage(editingId, form);
        showSuccess("Updated Successfully");
      } else {
        await addCoverage(form);
        showSuccess("Added Successfully");
      }
      fetchCoverages();
      setForm({ coverageName: '' });
      setEditingId(null);
    } catch (err) {
      setError('Error saving coverage');
    }
  };

  const handleEdit = (coverage) => {
    setForm({ coverageName: coverage.coverageName });
    setEditingId(coverage.coverageId);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setIsSuccessModalOpen(true);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSuccessMessage("");
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Coverages</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">{editingId ? 'Edit Coverage' : 'Add Coverage'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="coverageName" className="form-label">Coverage Name</label>
              <input
                type="text"
                id="coverageName"
                value={form.coverageName}
                onChange={(e) => setForm({ coverageName: e.target.value })}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Coverage' : 'Add Coverage'}
            </button>
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Coverage List</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coverages.map((coverage) => (
                <tr key={coverage.coverageId}>
                  <td>{coverage.coverageId}</td>
                  <td>{coverage.coverageName}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(coverage)}
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
      
      {/* --- CUSTOM SUCCESS MODAL --- */}
      {isSuccessModalOpen && (
        <div className="modal-backdrop fade show"></div>
      )}
      <div
        className={`modal fade ${isSuccessModalOpen ? 'show d-block' : ''}`}
        tabIndex="-1"
        role="dialog"
        style={{ backgroundColor: isSuccessModalOpen ? 'rgba(0,0,0,0.5)' : 'transparent' }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">SUCCESS</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeSuccessModal}
              ></button>
            </div>
            <div className="modal-body">
              {successMessage}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={closeSuccessModal}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Coverages;