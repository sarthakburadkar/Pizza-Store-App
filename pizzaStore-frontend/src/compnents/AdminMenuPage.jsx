import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    getAllMenuItems, addMenuItem, updateMenuItem, deleteMenuItem,
    getCategories
} from "../services/AdminService";
import "../css/AdminMenuPage.css";

const AdminMenuPage = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState("");
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        loadMenuItems();
        loadCategories();
    }, []);

    const loadMenuItems = async () => {
        try {
            const res = await getAllMenuItems();
            setMenuItems(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Error loading menu items", err);
        }
    };

    const loadCategories = async () => {
        try {
            const res = await getCategories();
            setCategories(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Error loading categories", err);
        }
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            price: "",
            stock: "",
            categoryId: "",
            imageUrl: ""
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string()
                .min(2, "Name must be at least 2 characters")
                .required("Item name is required"),
            description: Yup.string(),
            price: Yup.number()
                .typeError("Price must be a number")
                .min(1, "Price must be greater than 0")
                .required("Price is required"),
            stock: Yup.number()
                .typeError("Stock must be a number")
                .min(0, "Stock cannot be negative")
                .required("Stock quantity is required"),
            categoryId: Yup.string()
                .required("Please select a category"),
            imageUrl: Yup.string().url("Must be a valid URL").nullable()
        }),
        onSubmit: async (values, { resetForm, setStatus }) => {
            try {
                const payload = {
                    name: values.name,
                    description: values.description,
                    price: parseFloat(values.price),
                    stock: Number(values.stock),
                    category: { id: parseInt(values.categoryId) },
                    imageUrl: values.imageUrl || null
                };

                if (editingItem) {
                    await updateMenuItem(editingItem.id, payload);
                    setMessage("Menu item updated successfully!");
                } else {
                    await addMenuItem(payload);
                    setMessage("Menu item added successfully!");
                }

                resetForm();
                setEditingItem(null);
                loadMenuItems();
            } catch (err) {
                console.error("Error saving menu item", err);
                setStatus("Failed to save menu item.");
            }
        }
    });

    const handleEdit = (item) => {
        setEditingItem(item);
        formik.setValues({
            name: item.name,
            description: item.description || "",
            price: item.price,
            stock: item.stock,
            categoryId: item.category.id,
            imageUrl: item.imageUrl || ""
        });
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            await deleteMenuItem(id);
            setMessage("Menu item deleted!");
            loadMenuItems();
        } catch (err) {
            console.error("Error deleting item", err);
            setMessage("Failed to delete item.");
        }
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        formik.resetForm();
        setMessage("");
    };

    const getStockBadge = (stock) => {
        if (stock === 0) return <span className="stock-badge stock-out">Out of Stock</span>;
        if (stock <= 5) return <span className="stock-badge stock-low">{stock} Low</span>;
        return <span className="stock-badge stock-ok">{stock} In Stock</span>;
    };

    return (
        <div className="admin-menu-page">
            <div className="container">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 admin-page-header">
                    <h2>
                        <i className="fa-solid fa-pizza-slice me-2 text-danger"></i>
                        Manage Menu
                    </h2>
                    <a href="/admin/dashboard" className="admin-back-btn">
                        <i className="fa-solid fa-arrow-left"></i>Back to Dashboard
                    </a>
                </div>

                {/* Messages */}
                {message && (
                    <div className="alert alert-success mb-4" style={{borderRadius:"12px"}}>
                        <i className="fa-solid fa-check-circle me-2"></i>{message}
                    </div>
                )}
                {formik.status && (
                    <div className="alert alert-danger mb-4" style={{borderRadius:"12px"}}>
                        <i className="fa-solid fa-circle-exclamation me-2"></i>{formik.status}
                    </div>
                )}

                <div className="row">
                    {/* Form — Left */}
                    <div className="col-lg-4 mb-4">
                        <div className="admin-form-card">
                            <h5>
                                <i className={editingItem ? "fa-solid fa-pen" : "fa-solid fa-plus"}></i>
                                {editingItem ? "Edit Item" : "Add New Item"}
                            </h5>

                            <form onSubmit={formik.handleSubmit}>
                                {/* Name */}
                                <div className="mb-3">
                                    <label className="admin-form-label">Item Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className={`admin-input ${formik.touched.name && formik.errors.name ? "is-invalid" : ""}`}
                                        placeholder="e.g. Margherita Pizza"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.name && formik.errors.name && (
                                        <div className="invalid-feedback d-block">{formik.errors.name}</div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="mb-3">
                                    <label className="admin-form-label">Description</label>
                                    <input
                                        type="text"
                                        name="description"
                                        className="admin-input"
                                        placeholder="Short description"
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>

                                {/* Price & Stock side by side */}
                                <div className="row">
                                    <div className="col-6 mb-3">
                                        <label className="admin-form-label">Price (RS) *</label>
                                        <input
                                            type="number"
                                            name="price"
                                            className={`admin-input ${formik.touched.price && formik.errors.price ? "is-invalid" : ""}`}
                                            placeholder="0"
                                            value={formik.values.price}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.price && formik.errors.price && (
                                            <div className="invalid-feedback d-block">{formik.errors.price}</div>
                                        )}
                                    </div>
                                    <div className="col-6 mb-3">
                                        <label className="admin-form-label">Stock *</label>
                                        <input
                                            type="text"
                                            name="stock"
                                            min="0"
                                            step="1"
                                            className={`admin-input ${formik.touched.stock && formik.errors.stock ? "is-invalid" : ""}`}
                                            placeholder="0"
                                            value={formik.values.stock}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.stock && formik.errors.stock && (
                                            <div className="invalid-feedback d-block">{formik.errors.stock}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="mb-3">
                                    <label className="admin-form-label">Category *</label>
                                    <select
                                        name="categoryId"
                                        className={`admin-input ${formik.touched.categoryId && formik.errors.categoryId ? "is-invalid" : ""}`}
                                        value={formik.values.categoryId}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}>
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {formik.touched.categoryId && formik.errors.categoryId && (
                                        <div className="invalid-feedback d-block">{formik.errors.categoryId}</div>
                                    )}
                                </div>

                                {/* Image URL */}
                                <div className="mb-3">
                                    <label className="admin-form-label">Image URL</label>
                                    <input
                                        type="text"
                                        name="imageUrl"
                                        className={`admin-input ${formik.touched.imageUrl && formik.errors.imageUrl ? "is-invalid" : ""}`}
                                        placeholder="https://..."
                                        value={formik.values.imageUrl}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.imageUrl && formik.errors.imageUrl && (
                                        <div className="invalid-feedback d-block">{formik.errors.imageUrl}</div>
                                    )}
                                    {/* Image Preview */}
                                    {formik.values.imageUrl && (
                                        <img
                                            src={formik.values.imageUrl}
                                            alt="Preview"
                                            style={{
                                                width: "100%", height: "120px",
                                                objectFit: "cover", borderRadius: "10px", marginTop: "8px"
                                            }}
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    )}
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        type="submit"
                                        className="admin-submit-btn"
                                        disabled={formik.isSubmitting}>
                                        <i className={editingItem ? "fa-solid fa-floppy-disk" : "fa-solid fa-plus"}></i>
                                        {editingItem ? "Update Item" : "Add Item"}
                                    </button>
                                    {editingItem && (
                                        <button
                                            type="button"
                                            className="admin-cancel-btn"
                                            onClick={handleCancelEdit}>
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Table — Right */}
                    <div className="col-lg-8 mb-4">
                        <div className="admin-table-card">
                            <h5>
                                <i className="fa-solid fa-list"></i>
                                Menu Items ({menuItems.length})
                            </h5>
                            <div className="table-responsive">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>Category</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {menuItems.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4 text-muted">
                                                    No menu items found.
                                                </td>
                                            </tr>
                                        ) : (
                                            menuItems.map(item => (
                                                <tr key={item.id}>
                                                    <td>
                                                        {item.imageUrl ? (
                                                            <img
                                                                src={item.imageUrl}
                                                                alt={item.name}
                                                                className="menu-item-img"
                                                                onError={(e) => e.target.style.display = 'none'}
                                                            />
                                                        ) : (
                                                            <div className="menu-item-placeholder">🍕</div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div style={{fontWeight:"600"}}>{item.name}</div>
                                                        <div style={{fontSize:"0.78rem", color:"#aaa"}}>{item.description}</div>
                                                    </td>
                                                    <td style={{fontWeight:"700", color:"#e63946"}}>
                                                        RS {item.price}
                                                    </td>
                                                    <td>{getStockBadge(item.stock)}</td>
                                                    <td>
                                                        <span className="category-tag">
                                                            {item.category?.name}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="edit-btn"
                                                            onClick={() => handleEdit(item)}>
                                                            <i className="fa-solid fa-pen me-1"></i>Edit
                                                        </button>
                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => handleDelete(item.id)}>
                                                            <i className="fa-solid fa-trash me-1"></i>Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMenuPage;