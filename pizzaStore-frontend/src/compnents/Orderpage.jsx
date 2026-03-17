import { useEffect, useState } from "react";
import { cancelOrder, getOrders } from "../services/OrderService";
import "../css/OrderPage.css";
import { useAuth } from "../context/AuthContext";
import { generateBill } from "../services/AdminOrderService";

const STATUSES = ["PENDING", "CONFIRMED", "PREPARING", "DELIVERED"];

const Orderspage = () => {
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [billOrder, setBillOrder] = useState(null);
    const [showBill, setShowBill] = useState(false);

    const {auth} = useAuth();
    const userId = auth.userId;

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const res = await getOrders(userId);
            setOrders(Array.isArray(res.data) ? res.data : [res.data]);
        } catch (err) {
            console.error("Error fetching orders", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (orderId) => {
        try {
            await cancelOrder(orderId);
            setMessage("Order cancelled successfully!");
            loadOrders();
        } catch (err) {
            setMessage("Cannot cancel this order.");
        }
    };
    const handleViewBill = async (orderId) => {
        try{
            const res = await generateBill(orderId);
            setBillOrder(res.data);
            setShowBill(true);
        } catch (err) {
            setMessage("Failed to load bill.");
        }
    }

    const getTimelineStatus = (orderStatus, stepStatus) => {
        if (orderStatus === "CANCELLED") return "";
        const orderIndex = STATUSES.indexOf(orderStatus);
        const stepIndex = STATUSES.indexOf(stepStatus);
        if (stepIndex < orderIndex) return "completed";
        if (stepIndex === orderIndex) return "active";
        return "";
    };

    if (loading) return (
        <div className="text-center mt-5 pt-5">
            <div className="spinner-border text-danger" role="status"></div>
            <p className="mt-3 text-muted">Loading your orders...</p>
        </div>
    );

    return (
        <div className="orders-page">
            <div className="container">
                {/* Header */}
                <div className="orders-header d-flex justify-content-between align-items-center mb-4">
                    <h2>
                        <i className="fa-solid fa-bag-shopping me-2 text-danger"></i>My Orders
                    </h2>
                    <a href="/menu" className="back-btn">
                        <i className="fa-solid fa-arrow-left me-2"></i>Back to Menu
                    </a>
                </div>

                {/* Message */}
                {message && (
                    <div className="alert alert-info" style={{borderRadius:"12px"}}>
                        <i className="fa-solid fa-circle-info me-2"></i>{message}
                    </div>
                )}

                {/* Empty State */}
                {orders.length === 0 ? (
                    <div className="empty-orders">
                        <i className="fa-solid fa-bag-shopping"></i>
                        <h4>No orders yet!</h4>
                        <p>You haven't placed any orders. Start ordering now!</p>
                        <a href="/menu" className="browse-btn">
                            <i className="fa-solid fa-pizza-slice me-2"></i>Browse Menu
                        </a>
                    </div>
                ) : (
                    orders.map(order => (
                        <div className="order-card" key={order.id}>
                            {/* Card Header */}
                            <div className="order-card-header">
                                <div>
                                    <div className="order-id">
                                        <i className="fa-solid fa-hashtag me-1"></i>
                                        Order #{order.id}
                                    </div>
                                    <div className="order-date">
                                        <i className="fa-solid fa-clock me-1"></i>
                                        {new Date(order.createdAt).toLocaleString()}
                                    </div>
                                </div>
                                <span className={`status-badge status-${order.status}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="order-card-body">
                                {/* Status Timeline — hide if cancelled */}
                                {order.status !== "CANCELLED" && (
                                    <div className="status-timeline mb-3">
                                        {STATUSES.map(step => {
                                            const state = getTimelineStatus(order.status, step);
                                            return (
                                                <div className="timeline-step" key={step}>
                                                    <div className={`timeline-dot ${state}`}>
                                                        {state === "completed" ? (
                                                            <i className="fa-solid fa-check"></i>
                                                        ) : (
                                                            <i className="fa-solid fa-circle"></i>
                                                        )}
                                                    </div>
                                                    <div className={`timeline-label ${state}`}>
                                                        {step}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Order Items Table */}
                                <table className="order-items-table">
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Price</th>
                                            <th>Qty</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.orderItems.map(item => (
                                            <tr key={item.id}>
                                                <td className="item-name-cell">
                                                    <i className="fa-solid fa-pizza-slice me-2 text-danger"></i>
                                                    {item.itemName}
                                                </td>
                                                <td>RS {item.price}</td>
                                                <td>{item.quantity}</td>
                                                <td>RS {item.price * item.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Order Footer */}
                                <div className="order-footer">
                                    <div className="order-meta">
                                        <div className="order-meta-item">
                                            <i className="fa-solid fa-truck"></i>
                                            Mode: <span>{order.deliveryMode}</span>
                                        </div>
                                        <div className="order-meta-item">
                                            <i className="fa-solid fa-location-dot"></i>
                                            Address: <span>{order.deliveryAddress || "Pickup"}</span>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-3">
                                        <div className="order-total">
                                            RS {order.totalAmount}
                                        </div>
                                        {order.status === "PENDING" && (
                                            <button
                                                className="cancel-btn"
                                                onClick={() => handleCancel(order.id)}>
                                                <i className="fa-solid fa-xmark me-1"></i>
                                                Cancel Order
                                            </button>
                                        )}
                                        {order.status==="DELIVERED" && (
                                            <button 
                                            className="cancel-btn"
                                            style ={{borderColor:"#28a745", color:"#28a745"}}
                                            onClick={() => handleViewBill(order.id)}>
                                                <i className="fa-solid fa-receipt me-1"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {/* Bill Modal */}
            {showBill && billOrder && (
                <div className="modal show d-block" style={{backgroundColor:"rgba(0,0,0,0.5)"}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{borderRadius:"15px", overflow:"hidden"}}>
                            <div className="modal-header" style={{backgroundColor:"#1a1a2e", color:"white"}}>
                                <h5 className="modal-title">
                                    <i className="fa-solid fa-receipt me-2"></i>
                                    Bill — Order #{billOrder.id}
                                </h5>
                                <button className="btn-close" style={{filter:"invert(1)"}} onClick={() => setShowBill(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Date:</strong> {new Date(billOrder.createdAt).toLocaleString()}</p>
                                <p><strong>Mode:</strong> {billOrder.deliveryMode}</p>
                                <p><strong>Address:</strong> {billOrder.deliveryAddress || "Pickup"}</p>
                                <p><strong>Payment:</strong> Cash on Delivery</p>
                                <hr />
                                <table className="table table-sm">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Item</th>
                                            <th>Qty</th>
                                            <th>Price</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {billOrder.orderItems.map(item => (
                                            <tr key={item.id}>
                                                <td>{item.itemName}</td>
                                                <td>{item.quantity}</td>
                                                <td>RS {item.price}</td>
                                                <td>RS {item.price * item.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div style={{backgroundColor:"#fff5f5", borderRadius:"10px", padding:"15px", textAlign:"right"}}>
                                    <h5 style={{color:"#e63946", margin:0}}>Total: RS {billOrder.totalAmount}</h5>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowBill(false)}>Close</button>
                                <button
                                    style={{backgroundColor:"#1a1a2e", border:"none", borderRadius:"8px", padding:"10px 20px", color:"white", fontWeight:"600", cursor:"pointer"}}
                                    onClick={() => window.print()}>
                                    <i className="fa-solid fa-print me-2"></i>Print Bill
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orderspage;