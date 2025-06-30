import React, { useContext } from 'react'
import Menubar from './components/Menubar/Menubar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Explore from './pages/Explore/Explore'
import ContactUs from './pages/ContactUs/ContactUs'
import FoodDetails from './pages/FoodDetails/FoodDetails'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import { ToastContainer } from 'react-toastify';
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import MyOrders from './pages/MyOrders/MyOrders'
import { StoreContext } from './context/StoreContext'
import { Navigate } from 'react-router-dom';


const App = () => {
  const {token} = useContext(StoreContext)
  return (
    <div>
      <Menubar />
      <ScrollToTop />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/explore' element={<Explore />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/food/:id' element={<FoodDetails /> } />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={token ? <Navigate to="/" /> : <Login />} />
        <Route path='/register' element={token ? <Navigate to="/" /> : <Register />} />
        <Route path='/order' element={token ? <PlaceOrder /> : <Navigate to="/login" />} />
        <Route path='/myorders' element={<MyOrders /> } />
      </Routes>
    </div>
  )
}

export default App