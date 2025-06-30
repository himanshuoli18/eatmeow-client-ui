import React, { useState } from 'react'
import './Register.css'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { registerUser } from '../../services/authService'

const Register = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({
    name : "",
    "email" : "",
    "password" : ""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData(data => ({...data, [name]:value}))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!data.name || !data.email || !data.password) {
      toast.warn("Fill all fields");
      return;
    }
    try {
      const response = await registerUser(data)
      if (response.status === 201) {
        toast.success("Registered. Please login.");
        navigate("/login");
      } else {
        toast.error("Registration failed.");
      }
    } catch {
      toast.error("Registration failed.");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-image d-none d-md-block" />
        <div className="auth-form">
          <h4 className="mb-4 fw-bold text-center">Create Account</h4>
          <form onSubmit={onSubmitHandler}>
            <div className="form-floating mb-3">
              <input 
                type="text" 
                className="form-control" 
                id="registerName" 
                name="name" 
                onChange={onChangeHandler}
                value={data.name}
                placeholder="John Doe"
              />
              <label htmlFor="registerName">Full name</label>
            </div>
            <div className="form-floating mb-3">
              <input 
                type="email" 
                className="form-control" 
                id="registerEmail" 
                placeholder="jhondoe@example.com" 
                name='email'
                onChange={onChangeHandler}
                value={data.email}
              />
              <label htmlFor="registerEmail">Email address</label>
            </div>
            <div className="form-floating mb-4">
              <input 
                type="password" 
                className="form-control" 
                id="registerPassword" 
                placeholder="Password" 
                name='password'
                onChange={onChangeHandler}
                value={data.password}
              />
              <label htmlFor="registerPassword">Password</label>
            </div>
            <div className="d-grid mb-3">
              <button className="btn btn-primary btn-auth fw-semibold" type="submit">Register</button>
            </div>
            <div className="text-center small">
              Already have an account? <Link to="/login" className="mx-1">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
