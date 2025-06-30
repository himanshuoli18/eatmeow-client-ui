import React, { useContext, useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../../services/authService';
import {StoreContext} from "../../context/StoreContext"

const Login = () => {
  const {setToken, loadCartData } = useContext(StoreContext)
  const [data, setData] = useState({
    "email" : "",
    "password" : ""
  });
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!data.email || !data.password) {
      toast.warn('Fill all fields');
      return;
    }
    try {
      const response = await loginUser(data)
      if (response.status === 200) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        await loadCartData(response.data.token)
        toast.success('Logged in');
        navigate('/');
      }
      else {
        toast.error('Login failed')
      }
    } catch {
      toast.error('Login failed')
    }
  }

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData((data) => ({...data, [name]:value}))
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-image d-none d-md-block" />
        <div className="auth-form">
          <h4 className="mb-4 fw-bold text-center">Welcome</h4>
          <form onSubmit={onSubmitHandler}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="loginEmail"
                placeholder="name@example.com"
                name='email'
                value={data.email}
                onChange={onChangeHandler}
              />
              <label htmlFor="loginEmail">Email address</label>
            </div>
            <div className="form-floating mb-4">
              <input
                type="password"
                className="form-control"
                id="loginPassword"
                placeholder="Password"
                name='password'
                value={data.password}
                onChange={onChangeHandler}
              />
              <label htmlFor="loginPassword">Password</label>
            </div>
            <div className="d-grid mb-3">
              <button className="btn btn-primary btn-auth fw-semibold" type="submit">
                Sign In
              </button>
            </div>
            <div className="text-center small">
              Don't have an account? <Link to="/register" className="mx-1">Register</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
