import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { clearCart, removeFromCart, updateCartItem } from "../services/CartService";
import { placeOrder } from "../services/OrderService";
import "../css/CartPage.css";
import { useAuth } from "../context/AuthContext";

const CartPage = () => {
    const { cartItems, dispatch, fetchCart } = useCart();
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [deliveryMode, setDeliveryMode] = useState("DELIVERY");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    

    const {auth} = useAuth();
    const userId = auth.userId;
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const totalAmount = cartItems.reduce((total, item) => {
        return total + (item.menuItem.price * item.quantity);
    }, 0);

    const handleRemove = async (cartId) => {
        try {
            await removeFromCart(cartId);
            dispatch({ type: "REMOVE_ITEM", payload: cartId });
        } catch (err) {
            console.error("Error removing item", err);
        }
    };

    const handleUpdateQty = async (cartId, newQty, stock) => {
        if (newQty < 1) return;
        if (newQty > stock) {
            setMessage(`Only ${stock} items available in stock!`);
            return;
        }
        try {
            await updateCartItem(cartId, newQty);
            dispatch({ type: "UPDATE_QTY", payload: { cartId, quantity: newQty } });
            setMessage("");
        } catch (err) {
            console.error("Error updating quantity", err);
        }
    };

    const handlePlaceOrder = async () => {
        if (!deliveryAddress) {
            setMessage("Please enter delivery address!");
            return;
        }
        if (!paymentMethod) {
            setMessage("Please select payment method!");
            return;
        }
        try {
            setLoading(true);
            await placeOrder(userId, deliveryAddress, deliveryMode);
            await clearCart(userId);
            dispatch({ type: "CLEAR_CART" });
            navigate("/orders");
        } catch (err) {
            console.error("Error placing order", err);
            setMessage("Failed to place order!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cart-page">
            <div className="container">
                {/* Header */}
                <div className="cart-header d-flex justify-content-between align-items-center mb-4">
                    <h2><i className="fa-solid fa-cart-shopping me-2 text-danger"></i>My Cart</h2>
                    <a href="/menu" className="back-btn">
                        <i className="fa-solid fa-arrow-left me-2"></i>Back to Menu
                    </a>
                </div>

                {/* Message */}
                
                {message && (
                    <div className="alert alert-warning d-flex align-items-center"
                        style={{borderRadius:"12px"}}>
                        <i className="fa-solid fa-triangle-exclamation me-2"></i>
                        {message}
                    </div>
                )}

                {/* Empty Cart */}
                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <i className="fa-solid fa-cart-shopping"></i>
                        <h4>Your cart is empty!</h4>
                        <p>Looks like you haven't added anything yet.</p>
                        <a href="/menu" className="browse-btn">
                            <i className="fa-solid fa-pizza-slice me-2"></i>Browse Menu
                        </a>
                    </div>
                ) : (
                    <div className="row">
                        {/* Cart Items — Left Side */}
                        <div className="col-lg-8 mb-4">
                            <h5 className="fw-bold mb-3 text-muted">
                                {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"} in Cart
                            </h5>
                            {cartItems.map(item => (
                                <div className="cart-item-card" key={item.id}>
                                    {/* Image */}
                                    {item.menuItem.imageUrl ? (
                                        <img
                                            src={item.menuItem.imageUrl}
                                            alt={item.menuItem.name}
                                            className="cart-item-img"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    ) : (
                                        <div className="cart-item-placeholder">🍕</div>
                                    )}

                                    {/* Details */}
                                    <div className="cart-item-details">
                                        <h6>{item.menuItem.name}</h6>
                                        <div className="item-price">RS {item.menuItem.price}</div>
                                        <div className="item-subtotal">
                                            Subtotal: RS {item.menuItem.price * item.quantity}
                                        </div>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="qty-controls">
                                        <button
                                            className="qty-btn"
                                            onClick={() => handleUpdateQty(item.id, item.quantity - 1, item.menuItem.stock)}>
                                            −
                                        </button>
                                        <span className="qty-value">{item.quantity}</span>
                                        <button
                                            className="qty-btn"
                                            onClick={() => handleUpdateQty(item.id, item.quantity + 1, item.menuItem.stock)}>
                                            +
                                        </button>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        className="remove-btn"
                                        onClick={() => handleRemove(item.id)}
                                        title="Remove item">
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary — Right Side */}
                        <div className="col-lg-4">
                            <div className="order-summary">
                                <h5>
                                    <i className="fa-solid fa-receipt me-2 text-danger"></i>
                                    Order Summary
                                </h5>

                                {/* Item breakdown */}
                                {cartItems.map(item => (
                                    <div className="summary-row" key={item.id}>
                                        <span>{item.menuItem.name} x{item.quantity}</span>
                                        <span>RS {item.menuItem.price * item.quantity}</span>
                                    </div>
                                ))}

                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>RS {totalAmount}</span>
                                </div>

                                {/* Delivery Form */}
                                <div className="delivery-form">
                                    <label>
                                        <i className="fa-solid fa-location-dot me-1 text-danger"></i>
                                        Delivery Address
                                    </label>
                                    <input
                                        type="text"
                                        className="delivery-input"
                                        placeholder="Enter delivery address"
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                    />

                                    <label>
                                        <i className="fa-solid fa-truck me-1 text-danger"></i>
                                        Delivery Mode
                                    </label>
                                    <select
                                        className="delivery-input"
                                        value={deliveryMode}
                                        onChange={(e) => setDeliveryMode(e.target.value)}>
                                        <option value="DELIVERY">🚚 Home Delivery</option>
                                        <option value="PICKUP">🏪 Pickup</option>
                                    </select>

                                    <label>
                                        <i className="fa-solid fa-wallet me-1 text-danger"></i>
                                        Payment Method
                                    </label>
                                    <select
                                        className="delivery-input"
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}>
                                        <option value="">Select Payment Method</option>
                                        <option value="COD">💵 Cash on Delivery</option>
                                    </select>

                                    <button
                                        className="place-order-btn"
                                        onClick={handlePlaceOrder}
                                        disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Placing Order...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-bag-shopping me-2"></i>
                                                Place Order
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            
        </div>
    );
};

export default CartPage;