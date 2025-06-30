import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import { calculateCardTotals } from '../../util/CardUtils';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const billingFields = [
    { label: 'First name', name: 'firstName', type: 'text', placeholder: 'John', col: 'col-sm-6' },
    { label: 'Last name', name: 'lastName', type: 'text', placeholder: 'Doe', col: 'col-sm-6' },
    { label: 'Email', name: 'email', type: 'email', placeholder: 'johndoe@example.com', col: 'col-12', prefix: '@' },
    { label: 'Phone Number', name: 'phoneNumber', type: 'tel', placeholder: '1234567890', col: 'col-12' },
    { label: 'Address', name: 'address', type: 'text', placeholder: '1234 Main St', col: 'col-12' }
];

const PlaceOrder = () => {
    const navigate = useNavigate()
    const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_ACCESS_KEY
    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        state: '',
        city: '',
        zip: ''
    });

    const { foodList, quantities, token, setQuantities } = useContext(StoreContext);
    const cartItems = foodList.filter(food => quantities[food.id] > 0);
    const { subTotal, shippingCharge, taxCharge, grandTotal } = calculateCardTotals(cartItems, quantities);

    const onChangeHandler = ({ target: { name, value } }) => {
        setData(prev => ({ ...prev, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const orderData = { 
            userAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.state}, ${data.zip}`, 
            phoneNumber: data.phoneNumber, 
            email: data.email, 
            orderedItems: cartItems.map(item => ({ 
                foodId: item.foodId, 
                quantity: quantities[item.id], 
                price: item.price * quantities[item.id], 
                category: item.category, 
                imageUrl: item.imageUrl, 
                description: item.description, 
                name: item.name 
            })), 
            amount: grandTotal.toFixed(2), 
            orderStatus: "Preparing" 
        }
        try {
            const response = await axios.post(
                'https://eatmeow-api-production.up.railway.app/api/orders/create',
                orderData,
                {headers:{"Authorization": `Bearer ${token}`}}
            )
            if (response.status === 201 && response.data.razorpayOrderId ) {
                initiateRazorpayPayment(response.data)
            }
            else {
                toast.error("Unable to place order. Please try again")
            }
        } catch {
            toast.error("Unable to place order. Please try again")
        }
    };

    const initiateRazorpayPayment = (order) => {
        const options = {
            key: RAZORPAY_KEY,
            amount: order.amount,
            currency: "INR",
            name: "Food Land",
            description: "Food Order Payment",
            order_id: order.razorpayOrderId,
            handler: async function(razorpayResponse) {
                await verifyPayment(razorpayResponse)
            },
            prefill: {
                name: `${data.firstName} ${data.lastName}`,
                email: data.email,
                contact: data.phoneNumber
            },
            theme: {color: "#3399cc"},
            modal: {
                ondismiss: async function() {
                    toast.error("Payment cancelled")
                    await deleteOrder(order.id)
                },
            },
        }
        const razorpay = new window.Razorpay(options)
        razorpay.open()
    }
    const verifyPayment = async (razorpayResponse) => {
        const paymentData = {
            razorpay_payment_id:razorpayResponse.razorpay_payment_id,
            razorpay_order_id:razorpayResponse.razorpay_order_id,
            razorpay_signature:razorpayResponse.razorpay_signature
        }
        try {
            const response = await axios.post(
                'https://eatmeow-api-production.up.railway.app/api/orders/verify',
                paymentData,
                {headers: {'Authorization' : `Bearer ${token}`}}
            )
            if (response.status === 200) {
                toast.success("Payment Successful.")
                await clearCart()
                navigate('/myorders')
            }
            else {
                toast.error("Payment failed. Please try again.")
                navigate('/')
            }
        } catch {
            toast.error("Payment failed. Please try again.")
        }
    }
    const deleteOrder = async(orderId) => {
        try {
            await axios.delete(
                'https://eatmeow-api-production.up.railway.app/api/orders/'+orderId,
                {headers: {"Authorization" : `Bearer ${token}`}}
            )
        } catch {
            toast.error("Something went wrong, Contact support.")
        }
    }
    const clearCart = async() => {
        try {
            await axios.delete(
                'https://eatmeow-api-production.up.railway.app/api/cart',
                {headers: {"Authorization" : `Bearer ${token}`}}
            )
            setQuantities({})
        } catch {
            toast.error("Error while clearing the cart.")
        }
    }

    return (
        <div className="container mt-5">
            <div className="row g-5">

                {/* Cart Summary */}
                <div className="col-md-5 col-lg-5 order-md-last">
                    <h4 className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-primary">Your cart</span>
                        <span className="badge bg-primary rounded-pill">{cartItems.length}</span>
                    </h4>
                    <ul className="list-group mb-3">
                        {cartItems.map(food => (
                        <li key={food.id} className="list-group-item d-flex justify-content-between lh-sm">
                            <div>
                            <h6 className="my-0">{food.name}</h6>
                            <small className="text-muted">Qty: {quantities[food.id]}</small><br />
                            <small className="text-muted">{food.description}</small>
                            </div>
                            <span className="text-muted text-nowrap">
                            ₹{food.price} × {quantities[food.id]} = ₹{(food.price * quantities[food.id]).toFixed(2)}
                            </span>
                        </li>
                        ))}
                        <li className="list-group-item d-flex justify-content-between"><span>Subtotal</span><strong>₹{subTotal.toFixed(2)}</strong></li>
                        <li className="list-group-item d-flex justify-content-between"><span>Shipping</span><strong>₹{shippingCharge.toFixed(2)}</strong></li>
                        <li className="list-group-item d-flex justify-content-between"><span>Tax (10%)</span><strong>₹{taxCharge.toFixed(2)}</strong></li>
                        <li className="list-group-item d-flex justify-content-between"><span>Total (INR)</span><strong className="bg-success-subtle p-1 rounded">₹{grandTotal.toFixed(2)}</strong></li>
                    </ul>
                </div>

                {/* Billing Form */}
                <div className="col-md-7 col-lg-7">
                    <h4 className="mb-3">Billing address</h4>
                    <form className="needs-validation" onSubmit={onSubmitHandler}>
                        <div className="row g-3">
                            {billingFields.map(({ label, name, type, placeholder, col, prefix }) => (
                            <div className={col} key={name}>
                                <label htmlFor={name} className="form-label">{label}</label>
                                {prefix ? (
                                    <div className="input-group">
                                    <span className="input-group-text">{prefix}</span>
                                    <input
                                        type={type}
                                        className="form-control"
                                        id={name}
                                        name={name}
                                        value={data[name]}
                                        onChange={onChangeHandler}
                                        placeholder={placeholder}
                                        required
                                    />
                                    </div>
                                ) : (
                                    <input
                                    type={type}
                                    className="form-control"
                                    id={name}
                                    name={name}
                                    value={data[name]}
                                    onChange={onChangeHandler}
                                    placeholder={placeholder}
                                    required
                                    />
                                )}
                                </div>
                            ))}

                            <div className="col-md-5">
                                <label htmlFor="city" className="form-label">City</label>
                                <select className="form-select" id="city" name="city" value={data.city} onChange={onChangeHandler} required>
                                <option value="">Choose...</option>
                                <option>Chandigarh</option>
                                <option>Haldwani</option>
                                <option>Zirakpur</option>
                                <option>Panchkula</option>
                                <option>Mohali</option>
                                <option>Amritsar</option>
                                <option>Hisar</option>
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label htmlFor="state" className="form-label">State</label>
                                <select className="form-select" id="state" name="state" value={data.state} onChange={onChangeHandler} required>
                                <option value="">Choose...</option>
                                <option>Punjab</option>
                                <option>Haryana</option>
                                <option>Uttarakhand</option>
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label htmlFor="zip" className="form-label">Zip</label>
                                <input type="number" className="form-control" id="zip" name="zip" value={data.zip} onChange={onChangeHandler} required />
                            </div>
                        </div>

                        <hr className="my-4" />
                        <button className="w-100 btn btn-primary btn-lg" type="submit" disabled={cartItems.length === 0}>
                            Continue to checkout
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;