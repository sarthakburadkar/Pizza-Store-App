import { useNavigate } from "react-router-dom";
import {  registerApi } from "../services/authService";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../css/Login.css";

function Register() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            role: "USER"
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(3, "Name must be at least 3 characters")
                .required("Name is required"),
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
            role: Yup.string()
                .oneOf(["USER", "ADMIN"])
                .required("Role is required")
        }),
        onSubmit: async (values, { setStatus }) => {
            try {
                await registerApi(values);
                navigate("/login");
            } catch (err) {
                setStatus("Registration failed. Please try again.");
            }
        }
    });

    return (
        <div className="login-page">
            <div className="register-card">
                {/* Brand */}
                <div className="brand">Pizza<span>Store</span> 🍕</div>
                <p className="subtitle">Create your account and start ordering!</p>

                <h4>Register</h4>

                {formik.status && (
                    <div className="alert alert-danger py-2 text-center" style={{borderRadius:"10px"}}>
                        <i className="fa-solid fa-circle-exclamation me-2"></i>
                        {formik.status}
                    </div>
                )}

                <form onSubmit={formik.handleSubmit}>
                    {/* Role Selector */}
                    <div className="mb-3">
                        <label className="form-label">
                            <i className="fa-solid fa-user-tag me-2 text-danger"></i>I am a
                        </label>
                        <div className="role-selector">
                            <button
                                type="button"
                                className={`role-option ${formik.values.role === "USER" ? "active" : ""}`}
                                onClick={() => formik.setFieldValue("role", "USER")}>
                                <i className="fa-solid fa-user"></i>
                                Customer
                            </button>
                            <button
                                type="button"
                                className={`role-option ${formik.values.role === "ADMIN" ? "active" : ""}`}
                                onClick={() => formik.setFieldValue("role", "ADMIN")}>
                                <i className="fa-solid fa-user-shield"></i>
                                Admin
                            </button>
                        </div>
                    </div>

                    {/* Name */}
                    <div className="mb-3">
                        <label className="form-label">
                            <i className="fa-solid fa-user me-2 text-danger"></i>Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            className={`form-control login-input ${formik.touched.name && formik.errors.name ? "is-invalid" : ""}`}
                            placeholder="Enter your full name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className="invalid-feedback d-block">
                                <i className="fa-solid fa-triangle-exclamation me-1"></i>
                                {formik.errors.name}
                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label className="form-label">
                            <i className="fa-solid fa-envelope me-2 text-danger"></i>Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            className={`form-control login-input ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
                            placeholder="Enter your email"
                            autoComplete="off"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div className="invalid-feedback d-block">
                                <i className="fa-solid fa-triangle-exclamation me-1"></i>
                                {formik.errors.email}
                            </div>
                        )}
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                        <label className="form-label">
                            <i className="fa-solid fa-lock me-2 text-danger"></i>Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className={`form-control login-input ${formik.touched.password && formik.errors.password ? "is-invalid" : ""}`}
                            placeholder="Create a password"
                            autoComplete="new-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <div className="invalid-feedback d-block">
                                <i className="fa-solid fa-triangle-exclamation me-1"></i>
                                {formik.errors.password}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="login-btn"
                        disabled={formik.isSubmitting}>
                        {formik.isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Registering...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-user-plus me-2"></i>
                                Create Account
                            </>
                        )}
                    </button>
                </form>

                <div className="divider">or</div>

                <div className="register-link">
                    Already have an account? <a href="/login">Login here</a>
                </div>

                <div className="back-home">
                    <a href="/"><i className="fa-solid fa-arrow-left me-1"></i>Back to Home</a>
                </div>
            </div>
        </div>
    );
}

export default Register;