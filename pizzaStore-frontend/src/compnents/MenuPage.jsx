import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { getAllMenuItems, getCategories, getMenuItemsByCategory } from "../services/MenuService";
import { addToCart } from "../services/CartService";
import "../css/MenuPage.css";
import { useAuth } from "../context/AuthContext";

const MenuPage = () => {
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const { dispatch } = useCart();
    const {auth} = useAuth();
    const userId = auth.userId;

    useEffect(() => {
        fetchCategories();
        fetchAllMenuItems();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await getCategories();
            setCategories(res.data);
        } catch (err) {
            console.error("Error fetching categories", err);
        }
    };

    const fetchAllMenuItems = async () => {
        try {
            setLoading(true);
            const res = await getAllMenuItems();
            setMenuItems(res.data);
        } catch (err) {
            console.error("Error fetching menu items", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = async (categoryId) => {
        try {
            setLoading(true);
            setSelectedCategory(categoryId);
            if (categoryId === null) {
                const res = await getAllMenuItems();
                setMenuItems(res.data);
            } else {
                const res = await getMenuItemsByCategory(categoryId);
                setMenuItems(res.data);
            }
        } catch (err) {
            console.error("Error filtering menu items", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (menuItem) => {
        if (menuItem.stock === 0) {
            setMessage(`${menuItem.name} is out of stock!`);
            setTimeout(() => setMessage(""), 2000);
            return;
        }
        try {
            const res = await addToCart(userId, menuItem.id, 1);
            dispatch({ type: "ADD_ITEM", payload: res.data });
            setMessage(`🛒 ${menuItem.name} added to cart!`);
            setTimeout(() => setMessage(""), 2000);
        } catch (err) {
            console.error("Error adding to cart", err);
        }
    };

    return (
        <div className="menu-page">
            <div className="container">
                {/* Header */}
                <div className="menu-header d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2>Our Menu 🍕</h2>
                        <p className="text-muted mb-0">Fresh and delicious, made just for you</p>
                    </div>
                </div>

                {/* Toast Message */}
                {message && (
                    <div className="alert alert-success toast-message">
                        {message}
                    </div>
                )}

                {/* Category Filter */}
                <div className="mb-4">
                    <button
                        className={`btn category-btn me-2 mb-2 ${selectedCategory === null ? "btn-dark" : "btn-outline-dark"}`}
                        onClick={() => handleCategoryClick(null)}>
                        🍽️ All
                    </button>
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`btn category-btn me-2 mb-2 ${selectedCategory === category.id ? "btn-dark" : "btn-outline-dark"}`}
                            onClick={() => handleCategoryClick(category.id)}>
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-danger" role="status"></div>
                        <p className="mt-2 text-muted">Loading menu...</p>
                    </div>
                )}

                {/* Menu Items Grid */}
                {!loading && (
                    <div className="row">
                        {menuItems.length === 0 ? (
                            <div className="text-center py-5">
                                <h5 className="text-muted">No items found!</h5>
                            </div>
                        ) : (
                            menuItems.map(item => (
                                <div key={item.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                                    <div className="menu-card card">
                                        {/* Image */}
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        ) : (
                                            <div className="placeholder-img">🍕</div>
                                        )}

                                        <div className="card-body">
                                            <h5 className="card-title">{item.name}</h5>
                                            <p className="card-description">{item.description}</p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="card-price">RS {item.price}</span>
                                                <span className="card-category">{item.category?.name}</span>
                                            </div>
                                            {/* Stock indicator */}
                                            <div className="mt-2">
                                                {item.stock > 0 ? (
                                                    <span className="stock-badge">✅ In Stock ({item.stock})</span>
                                                ) : (
                                                    <span className="out-of-stock">❌ Out of Stock</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="card-footer">
                                            <button
                                                className="btn add-to-cart-btn text-white w-100"
                                                onClick={() => handleAddToCart(item)}
                                                disabled={item.stock === 0}>
                                                {item.stock === 0 ? "Out of Stock" : "🛒 Add to Cart"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuPage;