import { useEffect, useState } from "react";
import { getAllOrders, getOrdersByStatus, updateOrderStatus, generateBill } from "../services/AdminOrderService";
import "../css/AdminOrderPage.css";

const STATUS_OPTIONS = ["ALL", "PENDING", "CONFIRMED", "PREPARING", "DELIVERED", "CANCELLED"];

const NEXT_STATUS = {
    PENDING: "CONFIRMED",
    CONFIRMED: "PREPARING",
    PREPARING: "DELIVERED"
};

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [billOrder, setBillOrder] = useState(null);

    useEffect(() => {
        loadOrders();
    }, [filter]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const res = filter === "ALL"
                ? await getAllOrders()
                : await getOrdersByStatus(filter);
            setOrders(res.data);
        } catch (err) {
            console.error("Error loading orders", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            setMessage(`Order #${orderId} updated to ${newStatus}`);
            loadOrders();
        } catch (err) {
            setMessage("Failed to update status.");
        }
    };

    const handleGenerateBill = async (orderId) => {
        try {
            const res = await generateBill(orderId);
            setBillOrder(res.data);
        } catch (err) {
            setMessage("Failed to generate bill.");
        }
    };

    return (
        <div className="admin-orders-page">
            <div className="container">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 admin-page-header">
                    <h2>
                        <i className="fa-solid fa-bag-shopping me-2 text-danger"></i>
                        Manage Orders
                    </h2>
                    <a href="/admin/dashboard" className="admin-back-btn">
                        <i className="fa-solid fa-arrow-left"></i>Back to Dashboard
                    </a>
                </div>

                {/* Message */}
                {message && (
                    <div className="alert alert-success mb-4" style={{borderRadius:"12px"}}>
                        <i className="fa-solid fa-check-circle me-2"></i>{message}
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="filter-tabs">
                    {STATUS_OPTIONS.map(s => (
                        <button
                            key={s}
                            className={`filter-tab ${filter === s ? (s === "ALL" ? "active" : `active-${s}`) : ""}`}
                            onClick={() => setFilter(s)}>
                            {s === "ALL" && <i className="fa-solid fa-list me-1"></i>}
                            {s === "PENDING" && <i className="fa-solid fa-clock me-1"></i>}
                            {s === "CONFIRMED" && <i className="fa-solid fa-check me-1"></i>}
                            {s === "PREPARING" && <i className="fa-solid fa-fire me-1"></i>}
                            {s === "DELIVERED" && <i className="fa-solid fa-truck me-1"></i>}
                            {s === "CANCELLED" && <i className="fa-solid fa-xmark me-1"></i>}
                            {s}
                        </button>
                    ))}
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-danger"></div>
                        <p className="mt-3 text-muted">Loading orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="admin-empty">
                        <i className="fa-solid fa-bag-shopping"></i>
                        <h5>No orders found</h5>
                        <p>No orders match the selected filter.</p>
                    </div>
                ) : (
                    orders.map(order => (
                        <div className="admin-order-card" key={order.id}>
                            {/* Card Header */}
                            <div className="admin-order-header">
                                <div className="order-info">
                                    <div className="order-id">
                                        <i className="fa-solid fa-hashtag me-1"></i>
                                        Order #{order.id}
                                    </div>
                                    <div className="order-meta">
                                        <span>
                                            <i className="fa-solid fa-user me-1"></i>
                                            User #{order.userId}
                                        </span>
                                        <span>
                                            <i className="fa-solid fa-clock me-1"></i>
                                            {new Date(order.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <span className={`status-badge status-${order.status}`}>
                                    {order.status}
                                </span>
                            </div>

                            {/* Card Body */}
                            <div className="admin-order-body">
                                {/* Items Table */}
                                <table className="admin-order-table">
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
                                                <td>
                                                    <i className="fa-solid fa-pizza-slice me-2 text-danger"></i>
                                                    {item.itemName}
                                                </td>
                                                <td>RS {item.price}</td>
                                                <td>{item.quantity}</td>
                                                <td style={{fontWeight:"700"}}>RS {item.price * item.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Footer */}
                                <div className="admin-order-footer">
                                    <div className="admin-order-meta">
                                        <div className="admin-order-meta-item">
                                            <i className="fa-solid fa-truck"></i>
                                            Mode: <span>{order.deliveryMode}</span>
                                        </div>
                                        <div className="admin-order-meta-item">
                                            <i className="fa-solid fa-location-dot"></i>
                                            Address: <span>{order.deliveryAddress || "Pickup"}</span>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-3 flex-wrap">
                                        <div className="admin-order-total">
                                            RS {order.totalAmount}
                                        </div>
                                        {NEXT_STATUS[order.status] && (
                                            <button
                                                className="advance-btn"
                                                onClick={() => handleUpdateStatus(order.id, NEXT_STATUS[order.status])}>
                                                <i className="fa-solid fa-arrow-right"></i>
                                                Mark as {NEXT_STATUS[order.status]}
                                            </button>
                                        )}
                                        {order.status === "DELIVERED" && (
                                            <button
                                                className="bill-btn"
                                                onClick={() => handleGenerateBill(order.id)}>
                                                <i className="fa-solid fa-receipt"></i>
                                                Generate Bill
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
            {billOrder && (
                <div className="modal show d-block" style={{backgroundColor:"rgba(0,0,0,0.5)"}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{borderRadius:"15px", overflow:"hidden"}}>
                            <div className="modal-header bill-modal-header">
                                <h5 className="modal-title">
                                    <i className="fa-solid fa-receipt me-2"></i>
                                    Bill — Order #{billOrder.id}
                                </h5>
                                <button className="btn-close" onClick={() => setBillOrder(null)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="bill-info">
                                    <p><strong><i className="fa-solid fa-user me-1"></i> Customer ID:</strong> {billOrder.userId}</p>
                                    <p><strong><i className="fa-solid fa-calendar me-1"></i> Date:</strong> {new Date(billOrder.createdAt).toLocaleString()}</p>
                                    <p><strong><i className="fa-solid fa-truck me-1"></i> Mode:</strong> {billOrder.deliveryMode}</p>
                                    <p><strong><i className="fa-solid fa-location-dot me-1"></i> Address:</strong> {billOrder.deliveryAddress || "Pickup"}</p>
                                </div>
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
                                <div className="bill-total-box">
                                    <h5>Total: RS {billOrder.totalAmount}</h5>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setBillOrder(null)}>Close</button>
                                <button className="print-btn" onClick={() => window.print()}>
                                    <i className="fa-solid fa-print"></i>Print Bill
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrdersPage;