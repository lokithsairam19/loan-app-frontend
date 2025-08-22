import React, { useState, useEffect } from 'react';
import { getLoanTypes, addLoanType, updateLoanType } from '../api';

const LoanTypes = () => {
  const [loanTypes, setLoanTypes] = useState([]);
  const [form, setForm] = useState({ typeName: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    fetchLoanTypes();
  }, []);

  const fetchLoanTypes = async () => {
    try {
      const response = await getLoanTypes();
      setLoanTypes(response.data.loansTypeListDTO || []);
    } catch (err) {
      setError('Error fetching loan types');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateLoanType(editingId, form);
        showSuccess("Updated Successfully");
      } else {
        await addLoanType(form);
        showSuccess("Added Successfully");
      }
      fetchLoanTypes();
      setForm({ typeName: '' });
      setEditingId(null);
    } catch (err) {
      setError('Error saving loan type');
    }
  };

  const handleEdit = (loanType) => {
    setForm({ typeName: loanType.typeName });
    setEditingId(loanType.typeId);
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
      <h2 className="mb-4">Manage Loan Types</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">{editingId ? 'Edit Loan Type' : 'Add Loan Type'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="typeName" className="form-label">Loan Type Name</label>
              <input
                type="text"
                id="typeName"
                value={form.typeName}
                onChange={(e) => setForm({ typeName: e.target.value })}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Loan Type' : 'Add Loan Type'}
            </button>
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Loan Type List</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loanTypes.map((loanType) => (
                <tr key={loanType.typeId}>
                  <td>{loanType.typeId}</td>
                  <td>{loanType.typeName}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(loanType)}
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

export default LoanTypes;