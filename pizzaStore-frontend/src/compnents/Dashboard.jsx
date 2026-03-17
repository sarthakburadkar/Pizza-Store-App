import { useNavigate } from "react-router-dom";
import "../css/Dashboard.css";

const Dashboard = () => {
    const navigate = useNavigate();

    const features = [
    { icon: "fa-solid fa-pizza-slice", title: "Wide Menu", desc: "Choose from pizzas, sides, drinks and desserts made fresh daily." },
    { icon: "fa-solid fa-motorcycle", title: "Fast Delivery", desc: "Hot and fresh delivery straight to your doorstep in no time." },
    { icon: "fa-solid fa-hand-holding-dollar", title: "Easy Payment", desc: "Simple cash on delivery — no complicated payment hassles." },
    { icon: "fa-solid fa-box-open", title: "Track Orders", desc: "Track your order status in real time from placed to delivered." },
];

    const steps = [
    { icon: "fa-solid fa-user-plus", title: "Register / Login", desc: "Create your account or login to get started." },
    { icon: "fa-solid fa-magnifying-glass", title: "Browse Menu", desc: "Explore our wide range of pizzas and more." },
    { icon: "fa-solid fa-cart-shopping", title: "Add to Cart", desc: "Select your favorites and add them to your cart." },
    { icon: "fa-solid fa-check-circle", title: "Place Order", desc: "Confirm your order and wait for delivery!" },
];

    const menuPreviews = [
        { name: "Margherita", price: 299, img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400" },
        { name: "Farmhouse", price: 349, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400" },
        { name: "Chocolate Lava Cake", price: 199, img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400" },
    ];

    return (
        <div>
            {/* Navbar */}
            <nav className="landing-navbar">
                <div className="brand">Pizza<span>Store</span></div>
                <div className="d-flex gap-2">
                    <button className="hero-btn outline py-2 px-4" onClick={() => navigate("/login")}>Login</button>
                    <button className="hero-btn py-2 px-4" onClick={() => navigate("/register")}>Register</button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="hero-section">
                <i className="fa-solid fa-pizza-slice hero-icon"></i>
                <h1>Craving Something <span>Delicious?</span></h1>
                <p>Order your favorite pizzas, sides and desserts delivered hot and fresh to your door!</p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <button className="hero-btn" onClick={() => navigate("/register")}>Order Now</button>
                    <button className="hero-btn outline" onClick={() => navigate("/login")}>Login</button>
                </div>
            </div>

            {/* Stats Section */}
            
            {/* <div className="stats-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-3 col-6 text-center mb-3 mb-md-0">
                            <div className="stat-item">
                                <i className="fa-solid fa-utensils mb-2" style={{fontSize:"1.5rem"}}></i>
                                <h3>50+</h3>
                                <p>Menu Items</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-6 text-center mb-3 mb-md-0">
                            <div className="stat-item">
                                <i className="fa-solid fa-users mb-2" style={{fontSize:"1.5rem"}}></i>
                                <h3>1000+</h3>
                                <p>Happy Customers</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-6 text-center">
                            <div className="stat-item">
                                <i className="fa-solid fa-clock mb-2" style={{fontSize:"1.5rem"}}></i>
                                <h3>30 min</h3>
                                <p>Avg Delivery Time</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-6 text-center">
                            <div className="stat-item">
                                <i className="fa-solid fa-star mb-2" style={{fontSize:"1.5rem"}}></i>
                                <h3>4.8</h3>
                                <p>Customer Rating</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Features Section */}
            <div className="features-section">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2>Why Choose PizzaStore?</h2>
                        <p className="text-muted">We deliver more than just pizza</p>
                    </div>
                    <div className="row">
                        {features.map((f, i) => (
                            <div key={i} className="col-md-3 col-sm-6 mb-4">
                                <div className="feature-card">
                                    <i className={`${f.icon} feature-icon`}></i>
                                    <h5>{f.title}</h5>
                                    <p>{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Menu Preview */}
            <div className="menu-preview-section">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2>Popular Items 🔥</h2>
                        <p className="text-muted">Our customer favorites</p>
                    </div>
                    <div className="row justify-content-center">
                        {menuPreviews.map((item, i) => (
                            <div key={i} className="col-md-4 mb-4">
                                <div className="preview-card card">
                                    <img src={item.img} alt={item.name} />
                                    <div className="card-body d-flex justify-content-between align-items-center">
                                        <h6 className="card-title mb-0">{item.name}</h6>
                                        <span className="price">RS {item.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-3">
                        <button className="hero-btn" onClick={() => navigate("/register")}>
                            View Full Menu
                        </button>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="how-it-works">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2>How It Works</h2>
                        <p className="text-muted">Order in just 4 simple steps</p>
                    </div>
                    <div className="row">
                        {steps.map((step, i) => (
                            <div key={i} className="col-md-3 col-sm-6 mb-4">
                                <div className="step-card">
                                    <div className="step-number">
                                        <i className={step.icon}></i>
                                    </div>
                                    <h5>{step.title}</h5>
                                    <p>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="cta-section">
                <div className="container">
                    <h2>Ready to Order? 🍕</h2>
                    <p>Join thousands of happy customers and order your favorite pizza today!</p>
                    <button className="hero-btn" onClick={() => navigate("/register")}>
                        Get Started — It's Free!
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="landing-footer">
                <div className="container">
                    <p>© 2026 Pizza<span>Store</span>. Made with ❤️ and 🍕</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;