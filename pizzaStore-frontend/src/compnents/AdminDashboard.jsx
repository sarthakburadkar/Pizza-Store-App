import { useNavigate } from "react-router-dom";
import "../css/AdminDashboard.css";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const navCards = [
        {
            icon: "fa-solid fa-pizza-slice",
            color: "red",
            title: "Manage Menu",
            desc: "Add, edit or delete menu items, set prices and manage stock.",
            btn: "Go to Menu",
            path: "/admin/menu"
        },
        {
            icon: "fa-solid fa-bag-shopping",
            color: "blue",
            title: "Manage Orders",
            desc: "View all orders, update status and generate bills for customers.",
            btn: "Go to Orders",
            path: "/admin/orders"
        },
        {
            icon: "fa-solid fa-chart-line",
            color: "green",
            title: "Revenue Insights",
            desc: "View total revenue, order stats and business performance.",
            btn: "Go to Revenue",
            path: "/admin/revenue"
        }
    ];

    return (
        <div className="admin-dashboard-page">
            <div className="container">
                {/* Header */}
                <div className="admin-dashboard-header mb-5">
                    <h2>Welcome back, Admin! 👋</h2>
                    <p>Manage your pizza store from here.</p>
                </div>

                {/* Navigation Cards */}
                <div className="row">
                    {navCards.map((card, i) => (
                        <div key={i} className="col-md-4 mb-4">
                            <div
                                className="admin-nav-card"
                                onClick={() => navigate(card.path)}>
                                <div className={`admin-nav-card-icon ${card.color}`}>
                                    <i className={card.icon}></i>
                                </div>
                                <h5>{card.title}</h5>
                                <p>{card.desc}</p>
                                <button className="admin-nav-card-btn">
                                    {card.btn}
                                    <i className="fa-solid fa-arrow-right ms-2"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;