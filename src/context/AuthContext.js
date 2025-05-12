
import React, { createContext, useState } from 'react';
import axios from 'axios';

// Create context
export const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Store token in state
  const [token, setToken] = useState(null);
  
  const API_URL = 'http://localhost:5000';

  // Function to log in the user
  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      // Expecting response.data to have a "user" object and a "token"
      
      setUser(response.data.user);
      if(response.data.token) {
        setToken(response.data.token);
        // Optionally store in localStorage:
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  // Function to sign up a new user
  const signup = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, data, {
        headers: { 'Content-Type': 'application/json' }
      });
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Signup failed");
    }
  };
  

  // Function to log out the user
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
//jasnoor will be fixing this part of the code