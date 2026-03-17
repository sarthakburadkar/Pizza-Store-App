import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { auth, logout } = useAuth();
    const { cartItems } = useCart();
    const [showProfile, setShowProfile] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.profile-dropdown-wrapper')) {
                setShowProfile(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const hiddenRoutes = ["/", "/login", "/register"];
    if (hiddenRoutes.includes(location.pathname)) return null;

    return (
        <nav className="navbar navbar-dark bg-dark px-4 sticky-top">
            <span
                className="navbar-brand fs-4"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(auth.role === "ADMIN" ? "/admin/dashboard" : "/menu")}>
                🍕 PizzaStore
            </span>

            <div className="d-flex align-items-center gap-2">
                {auth.role === "USER" && (
                    <>
                        <button className="btn btn-outline-light btn-sm" onClick={() => navigate("/menu")}>Menu</button>
                        <button
                            className="btn btn-outline-light btn-sm position-relative"
                            onClick={() => navigate("/cart")}>
                            🛒 Cart
                            {cartItems.length > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {cartItems.length}
                                </span>
                            )}
                        </button>
                        <button className="btn btn-outline-light btn-sm" onClick={() => navigate("/orders")}>My Orders</button>
                    </>
                )}

                {auth.role === "ADMIN" && (
                    <>
                        <button className="btn btn-outline-light btn-sm" onClick={() => navigate("/admin/dashboard")}>Dashboard</button>
                        <button className="btn btn-outline-light btn-sm" onClick={() => navigate("/admin/menu")}>Manage Menu</button>
                        <button className="btn btn-outline-light btn-sm" onClick={() => navigate("/admin/orders")}>Manage Orders</button>
                    </>
                )}

                {/* Profile Dropdown */}
                <div className="position-relative profile-dropdown-wrapper">
                    <button
                        className="btn btn-outline-light btn-sm d-flex align-items-center gap-2"
                        style={{ height: "38px" }}
                        onClick={() => setShowProfile(!showProfile)}>
                        <i className="fa-solid fa-circle-user fs-5"></i>
                        <span>{auth.userName || "Profile"}</span>
                        <i className={`fa-solid fa-chevron-${showProfile ? "up" : "down"}`} style={{ fontSize: "0.7rem" }}></i>
                    </button>

                    {showProfile && (
                        <div className="profile-dropdown-wrapper" style={{
                            position: "absolute",
                            right: 0,
                            top: "110%",
                            backgroundColor: "white",
                            borderRadius: "12px",
                            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                            minWidth: "240px",
                            zIndex: 1000,
                            overflow: "hidden"
                        }}>
                            {/* Profile Header */}
                            <div style={{
                                backgroundColor: "#1a1a2e",
                                padding: "20px",
                                textAlign: "center"
                            }}>
                                <div style={{
                                    width: "55px", height: "55px",
                                    borderRadius: "50%",
                                    backgroundColor: "#e63946",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    margin: "0 auto 10px",
                                    fontSize: "1.5rem", color: "white", fontWeight: "800"
                                }}>
                                    {auth.userName?.charAt(0).toUpperCase() || "?"}
                                </div>
                                <div style={{ color: "white", fontWeight: "700", fontSize: "1rem" }}>
                                    {auth.userName || "User"}
                                </div>
                                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", marginTop: "4px" }}>
                                    {auth.email || ""}
                                </div>
                            </div>

                            {/* Profile Details */}
                            <div style={{ padding: "10px" }}>
                                <div style={{ padding: "10px 12px", fontSize: "0.85rem", color: "#555", borderBottom: "1px solid #f1f1f1" }}>
                                    <i className="fa-solid fa-id-badge me-2 text-danger"></i>
                                    <strong>ID:</strong> {auth.userId}
                                </div>
                                <div style={{ padding: "10px 12px", fontSize: "0.85rem", color: "#555", borderBottom: "1px solid #f1f1f1" }}>
                                    <i className="fa-solid fa-envelope me-2 text-danger"></i>
                                    <strong>Email:</strong> {auth.email}
                                </div>
                                <div style={{ padding: "10px 12px", fontSize: "0.85rem", color: "#555", borderBottom: "1px solid #f1f1f1" }}>
                                    <i className="fa-solid fa-user-tag me-2 text-danger"></i>
                                    <strong>Role:</strong> {auth.role}
                                </div>

                                {/* Logout */}
                                <button
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={handleLogout}
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        background: "none",
                                        border: "none",
                                        textAlign: "left",
                                        color: "#e63946",
                                        fontWeight: "600",
                                        fontSize: "0.85rem",
                                        cursor: "pointer",
                                        marginTop: "5px"
                                    }}>
                                    <i className="fa-solid fa-right-from-bracket me-2"></i>
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;