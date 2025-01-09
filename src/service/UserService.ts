import axios from "axios";

const API_URL = "http://localhost:8080";

interface Response {
  status: string;
  data: string;
}

interface RegisterRequest {
  firstName: string;
  lastName: string;
  userEmail: string;
  password: string;
}

export const login = async (user: { userEmail: string; password: string; }) => { 
  const response = await axios.post(`${API_URL}/user/login`, user); 
  return response.data; 
};

export const registerUser = async (userData: RegisterRequest): Promise<Response> => {
  const response = await axios.post<Response>(`${API_URL}/user/register`, userData);
  return response.data;
};

export const getAllUsers = async () => { 
  const response = await axios.get(`${API_URL}/user/allUsers`); 
  return response.data; 
}; 

export const deleteUser = async (id: string) => { 
  const response = await axios.delete(`${API_URL}/user/delete/${id}`); 
  return response.data; 
};

export const getUserByEmail = async (userEmail: string | null) => { 
  const response = await axios.get(`${API_URL}/user/getUserByEmail/${userEmail}`); 
  return response.data; 
}; 