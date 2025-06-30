export const calculateCardTotals = (cartItems, quantities) => {
    const subTotal = cartItems.reduce((acc, food) => acc + food.price * quantities[food.id], 0)
    const shippingCharge = subTotal === 0 ? 0 : 30
    const taxCharge = subTotal * 0.1
    const grandTotal = subTotal + shippingCharge + taxCharge
    return {subTotal, shippingCharge, taxCharge, grandTotal}
}