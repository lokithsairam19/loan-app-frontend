import React, { useState, useEffect } from "react";
import {
  getCustomers,
  addCustomer,
  updateCustomer,
  getCities,
  getStates,
  getCountries,
  getOccupations,
  deleteCustomer,
  getCustomersByCityName,
  getCustomersByGender,
  getCustomersBornBefore,
  getCustomerCountByCity,
  getCustomersWithPremiumAbove,
  getCustomersByOccupationId,
  getCustomersBornAfter,
  // Assuming a new API function exists for this query
  getCustomerById, 
} from "../api";

const Customers = () => {
  // State for all data lists
  const [customers, setCustomers] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [occupations, setOccupations] = useState([]);

  // State for form management
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "M",
    dob: "",
    mobileNumber: "",
    cityId: "",
    stateId: "",
    countryId: "",
    occupationId: "",
  });

  // State for JPQL queries
  const [queryResult, setQueryResult] = useState([]);
  const [queryCount, setQueryCount] = useState(null);
  const [queryForm, setQueryForm] = useState({
    customerId: "", // New state for the getCustomerById query
    cityName: "",
    gender: "M",
    bornBeforeDate: "",
    bornAfterDate: "",
    premiumAmount: "",
    occupationId: "",
  });

  // State for error handling and UI
  const [error, setError] = useState("");
  const [queryError, setQueryError] = useState("");
  
  // State for the custom delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDeleteId, setCustomerToDeleteId] = useState(null);

  // State for the custom alert message modal
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchCustomers();
    fetchCities();
    fetchStates();
    fetchCountries();
    fetchOccupations();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      setCustomers(response.data.customerListDTO || []);
    } catch (err) {
      setError("Error fetching customers");
    }
  };

  const fetchCities = async () => {
    try {
      const response = await getCities();
      setCities(response.data.cityListDTO || []);
    } catch (err) {
      setError("Error fetching cities");
    }
  };

  const fetchStates = async () => {
    try {
      const response = await getStates();
      setStates(response.data.stateListDTO || []);
    } catch (err) {
      setError("Error fetching states");
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await getCountries();
      setCountries(response.data.countryListDTO || []);
    } catch (err) {
      setError("Error fetching countries");
    }
  };

  const fetchOccupations = async () => {
    try {
      const response = await getOccupations();
      setOccupations(response.data.occupationListDTO || []);
    } catch (err) {
      setError("Error fetching occupations");
    }
  };

  /**
   * Validates the form data before submitting.
   * @returns {string|null} An error message if validation fails, otherwise null.
   */
  const validateForm = () => {
    const requiredFields = [
      { name: "First Name", value: form.firstName },
      { name: "Last Name", value: form.lastName },
      { name: "Gender", value: form.gender },
      { name: "Date of Birth", value: form.dob },
      { name: "Mobile Number", value: form.mobileNumber },
      { name: "City", value: form.cityId },
      { name: "State", value: form.stateId },
      { name: "Country", value: form.countryId },
      { name: "Occupation", value: form.occupationId },
    ];

    for (const field of requiredFields) {
      if (!field.value || field.value.toString().trim() === "") {
        return `${field.name} is required.`;
      }
    }

    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    if (!nameRegex.test(form.firstName)) {
      return "First Name must be 2-50 characters long and contain only letters and spaces.";
    }
    if (!nameRegex.test(form.lastName)) {
      return "Last Name must be 2-50 characters long and contain only letters and spaces.";
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(form.mobileNumber)) {
      return "Mobile Number must be exactly 10 digits.";
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(form.dob)) {
      return "Date of Birth must be in YYYY-MM-DD format.";
    }
    const dobDate = new Date(form.dob);
    const today = new Date();
    if (isNaN(dobDate.getTime()) || dobDate > today) {
      return "Date of Birth must be a valid past date.";
    }

    const minDate = new Date("1900-01-01");
    if (dobDate < minDate) {
      return "Date of Birth cannot be before 1900.";
    }

    return null;
  };

  // Function to show the custom alert modal
  const showAlert = (message) => {
    setAlertMessage(message);
    setIsAlertModalOpen(true);
  };

  const closeAlertModal = () => {
    setIsAlertModalOpen(false);
    setAlertMessage("");
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setIsSuccessModalOpen(true);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the form before proceeding
    const validationError = validateForm();
    if (validationError) {
      showAlert(validationError);
      return;
    }
    
    // Clear any previous errors
    setError("");

    try {
      const data = {
        ...form,
        cityId: parseInt(form.cityId),
        stateId: parseInt(form.stateId),
        countryId: parseInt(form.countryId),
        occupationId: parseInt(form.occupationId),
      };
      if (editingId) {
        await updateCustomer(editingId, data);
        showSuccess("Updated Successfully");
      } else {
        await addCustomer(data);
        showSuccess("Added Successfully");
      }
      fetchCustomers();
      setForm({
        firstName: "",
        lastName: "",
        gender: "M",
        dob: "",
        mobileNumber: "",
        cityId: "",
        stateId: "",
        countryId: "",
        occupationId: "",
      });
      setEditingId(null);
    } catch (err) {
      showAlert("Error saving customer.");
    }
  };

  const handleEdit = (customer) => {
    setForm({
      firstName: customer.firstName,
      lastName: customer.lastName,
      gender: customer.gender,
      dob: customer.dob,
      mobileNumber: customer.mobileNumber,
      cityId: customer.cityId || "",
      stateId: customer.stateId || "",
      countryId: customer.countryId || "",
      occupationId: customer.occupationId || "",
    });
    setEditingId(customer.customerId);
  };
  
  // New handler to open the delete confirmation modal
  const openDeleteModal = (customerId) => {
    setCustomerToDeleteId(customerId);
    setIsDeleteModalOpen(true);
  };

  // Handler to close the delete confirmation modal
  const closeDeleteModal = () => {
    setCustomerToDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  // New handler to perform the delete after confirmation
  const confirmDelete = async () => {
    if (customerToDeleteId) {
      try {
        await deleteCustomer(customerToDeleteId);
        fetchCustomers();
      } catch (err) {
        showAlert("Error deleting customer.");
      } finally {
        closeDeleteModal();
      }
    }
  };

  // --- JPQL QUERY HANDLERS ---
  const handleQueryChange = (e) => {
    const { name, value } = e.target;
    setQueryForm({ ...queryForm, [name]: value });
  };

  const runQuery = async (queryFunction, param) => {
    setQueryResult([]);
    setQueryCount(null);
    setQueryError("");
    try {
      const response = await queryFunction(param);
      
      if (response.data.customerDTO) {
        console.log("response.data",response.data);
        setQueryResult([response.data.customerDTO]);
      } 
      else if(response.data.customerListDTO){
        setQueryResult(response.data.customerListDTO);
      }
      else if (response.data.customerCount !== undefined) {
        setQueryCount(response.data.customerCount);
      } else if (response.data.customerId) {
        // If a single customer is returned, wrap it in an array for display
        setQueryResult([response.data]);
      }
    } catch (err) {
      setQueryError("Error executing query: " + (err.response?.data?.failureMessage || err.message));
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Customers</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">
            {editingId ? "Edit Customer" : "Add Customer"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="gender" className="form-label">Gender</label>
                <select
                  id="gender"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="form-select"
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="dob" className="form-label">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>
                <input
                  type="text"
                  id="mobileNumber"
                  value={form.mobileNumber}
                  onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="cityId" className="form-label">City</label>
                <select
                  id="cityId"
                  value={form.cityId}
                  onChange={(e) => setForm({ ...form, cityId: e.target.value })}
                  className="form-select"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.cityId} value={city.cityId}>
                      {city.cityName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="stateId" className="form-label">State</label>
                <select
                  id="stateId"
                  value={form.stateId}
                  onChange={(e) => setForm({ ...form, stateId: e.target.value })}
                  className="form-select"
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.stateId} value={state.stateId}>
                      {state.stateName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="countryId" className="form-label">Country</label>
                <select
                  id="countryId"
                  value={form.countryId}
                  onChange={(e) => setForm({ ...form, countryId: e.target.value })}
                  className="form-select"
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.countryId} value={country.countryId}>
                      {country.countryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="occupationId" className="form-label">Occupation</label>
                <select
                  id="occupationId"
                  value={form.occupationId}
                  onChange={(e) => setForm({ ...form, occupationId: e.target.value })}
                  className="form-select"
                >
                  <option value="">Select Occupation</option>
                  {occupations.map((occupation) => (
                    <option key={occupation.occupationId} value={occupation.occupationId}>
                      {occupation.occupationName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              {editingId ? "Update Customer" : "Add Customer"}
            </button>
          </form>
        </div>
      </div>

      {/* --- SECTION FOR JPQL QUERIES --- */}
      <hr className="my-5" />
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">Run JPQL Queries</h3>
          {queryError && <div className="alert alert-danger">{queryError}</div>}
          <div className="row g-3">
            {/* NEW Query: Get Customer by ID */}
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Customer ID"
                  name="customerId"
                  value={queryForm.customerId}
                  onChange={handleQueryChange}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => runQuery(getCustomerById, queryForm.customerId)}
                >
                  Get By ID
                </button>
              </div>
            </div>

            {/* Query 1: Customers by City */}
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="City Name"
                  name="cityName"
                  value={queryForm.cityName}
                  onChange={handleQueryChange}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => runQuery(getCustomersByCityName, queryForm.cityName)}
                >
                  By City
                </button>
              </div>
            </div>

            {/* Query 2: Customers by Gender */}
            <div className="col-md-6">
              <div className="input-group">
                <select
                  className="form-select"
                  name="gender"
                  value={queryForm.gender}
                  onChange={handleQueryChange}
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => runQuery(getCustomersByGender, queryForm.gender)}
                >
                  By Gender
                </button>
              </div>
            </div>
            
            {/* Query 3: Customers born before a date */}
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="date"
                  className="form-control"
                  name="bornBeforeDate"
                  value={queryForm.bornBeforeDate}
                  onChange={handleQueryChange}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => runQuery(getCustomersBornBefore, queryForm.bornBeforeDate)}
                >
                  Born Before
                </button>
              </div>
            </div>

            {/* Query 4: Customer count by city */}
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="City Name"
                  name="cityName"
                  value={queryForm.cityName}
                  onChange={handleQueryChange}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => runQuery(getCustomerCountByCity, queryForm.cityName)}
                >
                  Count By City
                </button>
              </div>
            </div>

            {/* Query 5: Customers with premium above a certain amount */}
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Premium Amount"
                  name="premiumAmount"
                  value={queryForm.premiumAmount}
                  onChange={handleQueryChange}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => runQuery(getCustomersWithPremiumAbove, queryForm.premiumAmount)}
                >
                  Premium Above
                </button>
              </div>
            </div>

            {/* Query 6: Customers by occupation ID */}
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Occupation ID"
                  name="occupationId"
                  value={queryForm.occupationId}
                  onChange={handleQueryChange}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => runQuery(getCustomersByOccupationId, queryForm.occupationId)}
                >
                  By Occupation ID
                </button>
              </div>
            </div>

            {/* Query 7: Customers born after a date */}
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="date"
                  className="form-control"
                  name="bornAfterDate"
                  value={queryForm.bornAfterDate}
                  onChange={handleQueryChange}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => runQuery(getCustomersBornAfter, queryForm.bornAfterDate)}
                >
                  Born After
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* --- SECTION FOR JPQL QUERY RESULTS --- */}
      {queryCount !== null && (
        <div className="card mt-4">
          <div className="card-body">
            <h4 className="card-title">Query Result: Count</h4>
            <p className="fs-3 text-primary">
              Number of customers: {queryCount}
            </p>
          </div>
        </div>
      )}

      {queryResult.length > 0 ? (
        <div className="card mt-4">
          <div className="card-body">
            <h4 className="card-title">Query Result: Customers</h4>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>DOB</th>
                  <th>Mobile</th>
                  <th>City</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {queryResult.map((customer, index) => (
                  <tr key={customer.customerId ?? `index-${index}`}>
                    <td>{customer.customerId || "N/A"}</td>
                    <td>{customer.firstName} {customer.lastName}</td>
                    <td>{customer.gender || "N/A"}</td>
                    <td>{customer.dob || "N/A"}</td>
                    <td>{customer.mobileNumber || "N/A"}</td>
                    <td>{customer.cityName || "N/A"}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(customer)}
                        className="btn btn-warning btn-sm"
                        disabled={!customer.customerId} // Disable edit if no customerId
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {queryResult.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card mt-4">
          <div className="card-body">
            <h4 className="card-title">Query Result: Customers</h4>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>DOB</th>
                  <th>Mobile</th>
                  <th>City</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="7" className="text-center">
                    No results found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card mt-4">
        <div className="card-body">
          <h3 className="card-title">Customer List</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>DOB</th>
                <th>Mobile</th>
                <th>City</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.customerId}>
                  <td>{customer.customerId}</td>
                  <td>{customer.firstName} {customer.lastName}</td>
                  <td>{customer.gender}</td>
                  <td>{customer.dob}</td>
                  <td>{customer.mobileNumber}</td>
                  <td>{customer.cityName}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(customer)}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(customer.customerId)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {isDeleteModalOpen && (
        <div className="modal-backdrop fade show"></div>
      )}
      <div
        className={`modal fade ${isDeleteModalOpen ? 'show d-block' : ''}`}
        tabIndex="-1"
        role="dialog"
        style={{ backgroundColor: isDeleteModalOpen ? 'rgba(0,0,0,0.5)' : 'transparent' }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Delete</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeDeleteModal}
              ></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete this customer?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- CUSTOM ALERT MODAL --- */}
      {isAlertModalOpen && (
        <div className="modal-backdrop fade show"></div>
      )}
      <div
        className={`modal fade ${isAlertModalOpen ? 'show d-block' : ''}`}
        tabIndex="-1"
        role="dialog"
        style={{ backgroundColor: isAlertModalOpen ? 'rgba(0,0,0,0.5)' : 'transparent' }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Error</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeAlertModal}
              ></button>
            </div>
            <div className="modal-body">
              {alertMessage}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={closeAlertModal}
              >
                OK
              </button>
            </div>
          </div>
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

export default Customers;
