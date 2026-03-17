import { useNavigate } from "react-router-dom";
import { loginApi } from "../services/authService";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../css/Login.css";
import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const {login} = useAuth();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required")
        }),
        onSubmit: async (values, { setStatus }) => {
            try {
                const data = await loginApi(values.email, values.password);
                login(data.token,data.role,data.userId,data.email,data.name);
                if (data.role === "ADMIN") {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/menu");
                }
            } catch (err) {
                setStatus("Invalid credentials. Please try again.");
            }
        }
    });

    return (
        <div className="login-page">
            <div className="login-card">
                {/* Brand */}
                <div className="brand">Pizza<span>Store</span> 🍕</div>
                <p className="subtitle">Welcome back! Please login to continue.</p>

                <h4>Login</h4>

                {formik.status && (
                    <div className="alert alert-danger py-2 text-center" style={{borderRadius:"10px"}}>
                        <i className="fa-solid fa-circle-exclamation me-2"></i>
                        {formik.status}
                    </div>
                )}

                <form onSubmit={formik.handleSubmit}>
                    {/* Email */}
                    <div className="mb-3">
                        <label className="form-label">
                            <i className="fa-solid fa-envelope me-2 text-danger"></i>Email
                        </label>
                        <div className="input-icon-wrapper">
                            <input
                                type="email"
                                name="email"
                                className={`form-control login-input input-with-icon ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
                                placeholder="Enter your email"
                                autoComplete="off"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
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
                        <div className="input-icon-wrapper">
                            <input
                                type="password"
                                name="password"
                                className={`form-control login-input input-with-icon ${formik.touched.password && formik.errors.password ? "is-invalid" : ""}`}
                                placeholder="Enter your password"
                                autoComplete="new-password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
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
                                Logging in...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-right-to-bracket me-2"></i>
                                Login
                            </>
                        )}
                    </button>
                </form>

                <div className="divider">or</div>

                <div className="register-link">
                    Don't have an account? <a href="/register">Register here</a>
                </div>

                <div className="back-home">
                    <a href="/"><i className="fa-solid fa-arrow-left me-1"></i>Back to Home</a>
                </div>
            </div>
        </div>
    );
}

export default Login;