import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api"
});

export const login = (username, password) =>api.get(`/user/login/${username}/${password}`);
export const register = (userData) => api.post("/user/register", userData);
export const resetPassword = (resetData) =>api.post("/user/reset-password", resetData);

export const getCustomers = () => api.get("/customers");
export const addCustomer = (data) => api.post("/customers", data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);

export const getCities = () => api.get("/cities");
export const addCity = (data) => api.post("/cities", data);
export const updateCity = (id, data) => api.put(`/cities/${id}`, data);
export const deleteCity = (id) => api.delete(`/cities/${id}`);


export const getStates = () => api.get("/states");
export const addStates = (data) => api.post("/states", data);
export const updateStates = (id, data) => api.put(`/states/${id}`, data);
export const deleteState = (id) => api.delete(`/states/${id}`);

export const getCountries = () => api.get("/countries");
export const addCountries = (data) => api.post("/countries", data);
export const updateCountries = (id, data) => api.put(`/countries/${id}`, data);
export const deleteCountry = (id) => api.delete(`/countries/${id}`);

export const getOccupations = () => api.get("/occupations");
export const addOccupations = (data) => api.post("/occupations", data);
export const updateOccupations = (id, data) => api.put(`/occupations/${id}`, data);
export const deleteOccupation = (id) => api.delete(`/Occupations/${id}`);

export const getCoverages = () => api.get("/coverages");
export const addCoverage = (data) => api.post("/coverages", data);
export const updateCoverage = (id, data) => api.put(`/coverages/${id}`, data);

export const getLoanTypes = () => api.get("/loans-types");
export const addLoanType = (data) => api.post("/loans-types", data);
export const updateLoanType = (id, data) => api.put(`/loans-types/${id}`, data);

export const getLoans = () => api.get("/loan");
export const addLoan = (data) => api.post("/loan", data);


export const getCustomersByCityName = (cityName) => api.get(`/customers/by-city/${cityName}`);
export const getCustomersByGender = (gender) => api.get(`/customers/by-gender/${gender}`);
export const getCustomersBornBefore = (date) => api.get(`/customers/born-before/${date}`);
export const getCustomerCountByCity = (cityName) => api.get(`/customers/count-by-city/${cityName}`);
export const getCustomersWithPremiumAbove = (amount) => api.get(`/customers/premium-above/${amount}`);
export const getCustomersByOccupationId = (occupationId) => api.get(`/customers/by-occupation/${occupationId}`);
export const getCustomersBornAfter = (date) => api.get(`/customers/born-after/${date}`);
export const getCustomerById = (id) =>api.get(`/customers/${id}`);
