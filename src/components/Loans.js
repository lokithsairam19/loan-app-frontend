import React, { useState, useEffect } from 'react';
import { getLoans, addLoan, getCustomers, getCoverages, getLoanTypes } from '../api';

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [form, setForm] = useState({
    loanNumber: '',
    premium: '',
    coverageId: '',
    policyTypeId: '',
    customerId: '',
  });
  const [customers, setCustomers] = useState([]);
  const [coverages, setCoverages] = useState([]);
  const [loanTypes, setLoanTypes] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    fetchLoans();
    fetchCustomers();
    fetchCoverages();
    fetchLoanTypes();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await getLoans();
      setLoans(response.data.loanListDTO || []);
    } catch (err) {
      setError('Error fetching loans');
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      setCustomers(response.data.customerListDTO || []);
    } catch (err) {
      setError('Error fetching customers');
    }
  };

  const fetchCoverages = async () => {
    try {
      const response = await getCoverages();
      setCoverages(response.data.coverageListDTO || []);
    } catch (err) {
      setError('Error fetching coverages');
    }
  };

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
      await addLoan({
        ...form,
        premium: parseFloat(form.premium),
        coverageId: parseInt(form.coverageId),
        policyTypeId: parseInt(form.policyTypeId),
        customerId: parseInt(form.customerId),
      });
      showSuccess("Added Successfully");
      fetchLoans();
      setForm({
        loanNumber: '',
        premium: '',
        coverageId: '',
        policyTypeId: '',
        customerId: '',
      });
    } catch (err) {
      setError('Error saving loan');
    }
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
      <h2 className="mb-4">Manage Loans</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">Add Loan</h3>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="loanNumber" className="form-label">Loan Number</label>
                <input
                  type="text"
                  id="loanNumber"
                  value={form.loanNumber}
                  onChange={(e) => setForm({ ...form, loanNumber: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="premium" className="form-label">Premium</label>
                <input
                  type="number"
                  id="premium"
                  value={form.premium}
                  onChange={(e) => setForm({ ...form, premium: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="coverageId" className="form-label">Coverage</label>
                <select
                  id="coverageId"
                  value={form.coverageId}
                  onChange={(e) => setForm({ ...form, coverageId: e.target.value })}
                  className="form-select"
                >
                  <option value="">Select Coverage</option>
                  {coverages.map((coverage) => (
                    <option key={coverage.coverageId} value={coverage.coverageId}>
                      {coverage.coverageName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="policyTypeId" className="form-label">Loan Type</label>
                <select
                  id="policyTypeId"
                  value={form.policyTypeId}
                  onChange={(e) => setForm({ ...form, policyTypeId: e.target.value })}
                  className="form-select"
                >
                  <option value="">Select Loan Type</option>
                  {loanTypes.map((loanType) => (
                    <option key={loanType.typeId} value={loanType.typeId}>
                      {loanType.typeName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="customerId" className="form-label">Customer</label>
                <select
                  id="customerId"
                  value={form.customerId}
                  onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                  className="form-select"
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer.customerId} value={customer.customerId}>
                      {customer.firstName} {customer.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Add Loan
            </button>
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Loan List</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Loan Number</th>
                <th>Premium</th>
                <th>Coverage ID</th>
                <th>Loan Type ID</th>
                <th>Customer ID</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.loanId}>
                  <td>{loan.loanId}</td>
                  <td>{loan.loanNumber}</td>
                  <td>{loan.premium}</td>
                  <td>{loan.coverageId}</td>
                  <td>{loan.loanTypeId}</td>
                  <td>{loan.customerId}</td>
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

export default Loans;