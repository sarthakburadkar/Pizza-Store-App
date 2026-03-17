import { useEffect, useState } from "react";
import { getRevenueInsights } from "../services/AdminService";

const RevenuePage = () => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInsights();
    }, []);

    const loadInsights = async () => {
        try {
            const res = await getRevenueInsights();
            setInsights(res.data);
        } catch (err) {
            console.error("Error loading revenue insights", err);
        } finally {
            setLoading(false);
        }
    };

    const avgOrderValue = insights?.deliveredOrders > 0
        ? (insights?.totalRevenue / insights?.deliveredOrders).toFixed(2)
        : 0;

    const cards = [
        { icon: "fa-solid fa-indian-rupee-sign", label: "Total Revenue", value: `RS ${insights?.totalRevenue || 0}`, color: "green" },
        { icon: "fa-solid fa-bag-shopping", label: "Total Orders", value: insights?.totalOrders || 0, color: "blue" },
        { icon: "fa-solid fa-truck", label: "Delivered Orders", value: insights?.deliveredOrders || 0, color: "teal" },
        { icon: "fa-solid fa-clock", label: "Pending Orders", value: insights?.pendingOrders || 0, color: "orange" },
        { icon: "fa-solid fa-xmark", label: "Cancelled Orders", value: insights?.cancelledOrders || 0, color: "red" },
        { icon: "fa-solid fa-chart-line", label: "Avg Order Value", value: `RS ${avgOrderValue}`, color: "purple" },
    ];

    if (loading) return (
        <div className="text-center mt-5 pt-5">
            <div className="spinner-border text-danger"></div>
            <p className="mt-3 text-muted">Loading insights...</p>
        </div>
    );

    return (
        <div style={{backgroundColor:"#f0f2f5", minHeight:"100vh", padding:"30px 0"}}>
            <div className="container">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 style={{fontWeight:"800", color:"#1a1a2e"}}>
                        <i className="fa-solid fa-chart-line me-2 text-danger"></i>
                        Revenue Insights
                    </h2>
                    <a href="/admin/dashboard" className="admin-back-btn">
                        <i className="fa-solid fa-arrow-left me-2"></i>Back to Dashboard
                    </a>
                </div>

                {/* Cards */}
                <div className="row">
                    {cards.map((card, i) => (
                        <div key={i} className="col-md-4 col-sm-6 mb-4">
                            <div style={{
                                background: "white",
                                borderRadius: "15px",
                                padding: "25px",
                                boxShadow: "0 3px 12px rgba(0,0,0,0.07)",
                                display: "flex",
                                alignItems: "center",
                                gap: "15px"
                            }}>
                                <div style={{
                                    width: "55px", height: "55px",
                                    borderRadius: "12px",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "1.4rem", flexShrink: 0,
                                    backgroundColor: {
                                        green: "#f0fff4", blue: "#f0f4ff",
                                        teal: "#e6fffe", orange: "#fff8f0",
                                        red: "#fff0f0", purple: "#f8f0ff"
                                    }[card.color],
                                    color: {
                                        green: "#2d6a4f", blue: "#4361ee",
                                        teal: "#0e7c7b", orange: "#f4a261",
                                        red: "#e63946", purple: "#7b2d8b"
                                    }[card.color]
                                }}>
                                    <i className={card.icon}></i>
                                </div>
                                <div>
                                    <div style={{fontSize:"0.8rem", color:"#6c757d", fontWeight:"600"}}>{card.label}</div>
                                    <div style={{fontSize:"1.5rem", fontWeight:"800", color:"#1a1a2e"}}>{card.value}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RevenuePage;