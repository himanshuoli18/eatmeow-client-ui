import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { Link, useNavigate } from 'react-router-dom'
import { calculateCardTotals } from '../../util/CardUtils'

const Cart = () => {
    const navigate = useNavigate()
    const { foodList, quantities, increaseQty, decreaseQty, removeFromCart } = useContext(StoreContext)
    const cartItems = foodList.filter(food => quantities[food.id] > 0)
    const {subTotal, shippingCharge, taxCharge, grandTotal} = calculateCardTotals(cartItems,quantities)
    return (
        <div className="cart-wrapper">
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="mb-0">Shopping Cart</h4>
                            <span className="text-muted">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
                        </div>

                        {cartItems.length === 0 ? (
                            <p>Your cart is empty</p>
                        ) : (
                            <div className="d-flex flex-column gap-3">
                                <div className="product-card p-3 shadow-sm">
                                    {cartItems.map(food => (
                                        <div key={food.id} className="row align-items-center mb-3">
                                            <div className="col-md-2">
                                                <img src={food.imageUrl} alt={food.name} className="product-image" />
                                            </div>
                                            <div className="col-md-4">
                                                <h6 className="mb-1">{food.name}</h6>
                                                <p className="text-muted mb-0">{food.category}</p>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="d-flex align-items-center gap-2">
                                                    <button className="quantity-btn" onClick={() => decreaseQty(food.id)}>-</button>
                                                    <input
                                                        type="number"
                                                        className="quantity-input"
                                                        value={quantities[food.id]}
                                                        min="1"
                                                        readOnly
                                                    />
                                                    <button className="quantity-btn" onClick={() => increaseQty(food.id)}>+</button>
                                                </div>
                                            </div>
                                            <div className="col-md-2 fw-bold text-end">
                                                ₹{food.price * quantities[food.id]}
                                            </div>
                                            <div className="col-md-1">
                                                <button style={{border:'none', borderRadius:'5px'}} onClick={() => removeFromCart(food.id)}>
                                                    <i className="bi bi-trash-fill remove-btn"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <Link to='/' className='btn btn-secondary my-5 btn-sm'><i className='bi bi-arrow-left mx-2'></i>Continue Shopping</Link>
                    </div>

                    <div className="col-lg-4">
                        <div className="summary-card p-4 shadow-sm">
                            <h5 className="mb-4">Order Summary</h5>

                            {[
                                { label: 'Subtotal', value: subTotal },
                                { label: 'Tax', value: taxCharge },
                                { label: 'Shipping', value: shippingCharge },
                            ].map(({ label, value }) => (
                                <div key={label} className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">{label}</span>
                                    <span>₹{value.toFixed(2)}</span>
                                </div>
                            ))}

                            <hr />
                            <div className="d-flex justify-content-between mb-4 fw-bold">
                                <span>Total</span>
                                <span>₹{grandTotal.toFixed(2)}</span>
                            </div>

                            <div className="mb-4">
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Promo code" />
                                    <button className="btn btn-outline-secondary" type="button">Apply</button>
                                </div>
                            </div>

                            <button 
                                className="btn btn-primary checkout-btn w-100 mb-3" 
                                disabled={cartItems.length === 0}
                                onClick={() => navigate('/order')}
                            >
                                Proceed to Checkout
                            </button>

                            <div className="d-flex justify-content-center gap-2">
                                <i className="bi bi-shield-check text-success"></i>
                                <small className="text-muted">Secure checkout</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart
