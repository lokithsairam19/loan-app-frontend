import React, { useState, useEffect } from 'react';
import {
  getCities,
  addCity,
  updateCity,
  getStates,
  addStates,
  updateStates,
  getCountries,
  addCountries,
  updateCountries,
  getOccupations,
  addOccupations,
  updateOccupations,
  deleteCity,
  deleteState,
  deleteCountry,
  deleteOccupation,
} from '../api';

const Cities = () => {
  const [cities, setCities] = useState([]);
  const [cityForm, setCityForm] = useState({ cityName: '' });
  const [cityEditingId, setCityEditingId] = useState(null);
  const [cityError, setCityError] = useState('');
  const [states, setStates] = useState([]);
  const [stateForm, setStateForm] = useState({ stateName: '' });
  const [stateEditingId, setStateEditingId] = useState(null);
  const [stateError, setStateError] = useState('');
  const [countries, setCountries] = useState([]);
  const [countryForm, setCountryForm] = useState({ countryName: '' });
  const [countryEditingId, setCountryEditingId] = useState(null);
  const [countryError, setCountryError] = useState('');
  const [occupations, setOccupations] = useState([]);
  const [occupationForm, setOccupationForm] = useState({ occupationName: '' });
  const [occupationEditingId, setOccupationEditingId] = useState(null);
  const [occupationError, setOccupationError] = useState('');
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  useEffect(() => {
    fetchCities();
    fetchStates();
    fetchCountries();
    fetchOccupations();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await getCities();
      setCities(response.data.cityListDTO || []);
    } catch (err) {
      setCityError('Error fetching cities');
    }
  };

  const handleCitySubmit = async (e) => {
    e.preventDefault();
    try {
      if (cityEditingId) {
        await updateCity(cityEditingId, cityForm);
        showSuccess("Updated Successfully");
      } else {
        await addCity(cityForm);
        showSuccess("Added Successfully");
      }
      fetchCities();
      setCityForm({ cityName: '' });
      setCityEditingId(null);
    } catch (err) {
      setCityError('Error saving city');
    }
  };

  const handleCityEdit = (city) => {
    setCityForm({ cityName: city.cityName });
    setCityEditingId(city.cityId);
  };
  
  const handleCityDelete = async (cityId) => {
    if (window.confirm(`Are you sure you want to delete city with ID: ${cityId}?`)) {
      try {
        await deleteCity(cityId);
        fetchCities(); 
      } catch (err) {
        setCityError('Error deleting city');
      }
    }
  };

  const fetchStates = async () => {
    try {
      const response = await getStates();
      setStates(response.data.stateListDTO || []);
    } catch (err) {
      setStateError('Error fetching states');
    }
  };

  const handleStateSubmit = async (e) => {
    e.preventDefault();
    try {
      if (stateEditingId) {
        await updateStates(stateEditingId, stateForm);
        showSuccess("Updated Successfully");
      } else {
        await addStates(stateForm);
        showSuccess("Added Successfully");
      }
      fetchStates();
      setStateForm({ stateName: '' });
      setStateEditingId(null);
    } catch (err) {
      setStateError('Error saving state');
    }
  };

  const handleStateEdit = (state) => {
    setStateForm({ stateName: state.stateName });
    setStateEditingId(state.stateId);
  };
  
  const handleStateDelete = async (stateId) => {
    if (window.confirm(`Are you sure you want to delete state with ID: ${stateId}?`)) {
      try {
        await deleteState(stateId);
        fetchStates();
      } catch (err) {
        setStateError('Error deleting state');
      }
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await getCountries();
      setCountries(response.data.countryListDTO || []);
    } catch (err) {
      setCountryError('Error fetching countries');
    }
  };

  const handleCountrySubmit = async (e) => {
    e.preventDefault();
    try {
      if (countryEditingId) {
        await updateCountries(countryEditingId, countryForm);
        showSuccess("Updated Successfully");
      } else {
        await addCountries(countryForm);
        showSuccess("Added Successfully");
      }
      fetchCountries();
      setCountryForm({ countryName: '' });
      setCountryEditingId(null);
    } catch (err) {
      setCountryError('Error saving country');
    }
  };

  const handleCountryEdit = (country) => {
    setCountryForm({ countryName: country.countryName });
    setCountryEditingId(country.countryId);
  };
  
  const handleCountryDelete = async (countryId) => {
    if (window.confirm(`Are you sure you want to delete country with ID: ${countryId}?`)) {
      try {
        await deleteCountry(countryId);
        fetchCountries(); 
      } catch (err) {
        setCountryError('Error deleting country');
      }
    }
  };

  const fetchOccupations = async () => {
    try {
      const response = await getOccupations();
      setOccupations(response.data.occupationListDTO || []);
    } catch (err) {
      setOccupationError('Error fetching occupations');
    }
  };

  const handleOccupationSubmit = async (e) => {
    e.preventDefault();
    try {
      if (occupationEditingId) {
        await updateOccupations(occupationEditingId, occupationForm);
        showSuccess("Updated Successfully");
      } else {
        await addOccupations(occupationForm);
        showSuccess("Added Successfully");
      }
      fetchOccupations();
      setOccupationForm({ occupationName: '' });
      setOccupationEditingId(null);
    } catch (err) {
      setOccupationError('Error saving occupation');
    }
  };

  const handleOccupationEdit = (occupation) => {
    setOccupationForm({ occupationName: occupation.occupationName });
    setOccupationEditingId(occupation.occupationId);
  };
  
  const handleOccupationDelete = async (occupationId) => {
    if (window.confirm(`Are you sure you want to delete occupation with ID: ${occupationId}?`)) {
      try {
        await deleteOccupation(occupationId);
        fetchOccupations(); 
      } catch (err) {
        setOccupationError('Error deleting occupation');
      }
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
      {/* Cities Section */}
      <h2 className="mb-4">Manage Cities</h2>
      {cityError && <div className="alert alert-danger">{cityError}</div>}
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">{cityEditingId ? 'Edit City' : 'Add City'}</h3>
          <form onSubmit={handleCitySubmit}>
            <div className="mb-3">
              <label htmlFor="cityName" className="form-label">City Name</label>
              <input
                type="text"
                id="cityName"
                value={cityForm.cityName}
                onChange={(e) => setCityForm({ cityName: e.target.value })}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {cityEditingId ? 'Update City' : 'Add City'}
            </button>
          </form>
        </div>
      </div>
      <div className="card mb-5">
        <div className="card-body">
          <h3 className="card-title">City List</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city) => (
                <tr key={city.cityId}>
                  <td>{city.cityId}</td>
                  <td>{city.cityName}</td>
                  <td>
                    <button
                      onClick={() => handleCityEdit(city)}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Edit
                    </button>
                    {/* --- NEW DELETE BUTTON --- */}
                    <button
                      onClick={() => handleCityDelete(city.cityId)}
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

      {/* States Section */}
      <h2 className="mb-4">Manage States</h2>
      {stateError && <div className="alert alert-danger">{stateError}</div>}
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">{stateEditingId ? 'Edit State' : 'Add State'}</h3>
          <form onSubmit={handleStateSubmit}>
            <div className="mb-3">
              <label htmlFor="stateName" className="form-label">State Name</label>
              <input
                type="text"
                id="stateName"
                value={stateForm.stateName}
                onChange={(e) => setStateForm({ stateName: e.target.value })}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {stateEditingId ? 'Update State' : 'Add State'}
            </button>
          </form>
        </div>
      </div>
      <div className="card mb-5">
        <div className="card-body">
          <h3 className="card-title">State List</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
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
                      onClick={() => handleStateEdit(state)}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Edit
                    </button>
                    {/* --- NEW DELETE BUTTON --- */}
                    <button
                      onClick={() => handleStateDelete(state.stateId)}
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

      {/* Countries Section */}
      <h2 className="mb-4">Manage Countries</h2>
      {countryError && <div className="alert alert-danger">{countryError}</div>}
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">{countryEditingId ? 'Edit Country' : 'Add Country'}</h3>
          <form onSubmit={handleCountrySubmit}>
            <div className="mb-3">
              <label htmlFor="countryName" className="form-label">Country Name</label>
              <input
                type="text"
                id="countryName"
                value={countryForm.countryName}
                onChange={(e) => setCountryForm({ countryName: e.target.value })}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {countryEditingId ? 'Update Country' : 'Add Country'}
            </button>
          </form>
        </div>
      </div>
      <div className="card mb-5">
        <div className="card-body">
          <h3 className="card-title">Country List</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
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
                      onClick={() => handleCountryEdit(country)}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Edit
                    </button>
                    {/* --- NEW DELETE BUTTON --- */}
                    <button
                      onClick={() => handleCountryDelete(country.countryId)}
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

      {/* Occupations Section */}
      <h2 className="mb-4">Manage Occupations</h2>
      {occupationError && <div className="alert alert-danger">{occupationError}</div>}
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">{occupationEditingId ? 'Edit Occupation' : 'Add Occupation'}</h3>
          <form onSubmit={handleOccupationSubmit}>
            <div className="mb-3">
              <label htmlFor="occupationName" className="form-label">Occupation Name</label>
              <input
                type="text"
                id="occupationName"
                value={occupationForm.occupationName}
                onChange={(e) => setOccupationForm({ occupationName: e.target.value })}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {occupationEditingId ? 'Update Occupation' : 'Add Occupation'}
            </button>
          </form>
        </div>
      </div>
      <div className="card mb-5">
        <div className="card-body">
          <h3 className="card-title">Occupation List</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
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
                      onClick={() => handleOccupationEdit(occupation)}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Edit
                    </button>
                    {/* --- NEW DELETE BUTTON --- */}
                    <button
                      onClick={() => handleOccupationDelete(occupation.occupationId)}
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

export default Cities;