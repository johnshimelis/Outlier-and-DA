import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../images/assets/da.png";
import backgroundImage from "../images/assets/ecommerce.jpg";
import "../styles/cart.css";

const API_BASE_URL = "https://outlier-and-da-backend.onrender.com/api/auth";

// List of country codes with country names
const countryCodes = [
  { code: "+1", name: "United States" },
  { code: "+44", name: "United Kingdom" },
  { code: "+61", name: "Australia" },
  { code: "+33", name: "France" },
  { code: "+49", name: "Germany" },
  { code: "+91", name: "India" },
  { code: "+81", name: "Japan" },
  { code: "+7", name: "Russia" },
  { code: "+86", name: "China" },
  { code: "+52", name: "Mexico" },
  { code: "+55", name: "Brazil" },
  { code: "+234", name: "Nigeria" },
  { code: "+27", name: "South Africa" },
  { code: "+20", name: "Egypt" },
  { code: "+251", name: "Ethiopia" },
  { code: "+254", name: "Kenya" },
  { code: "+255", name: "Tanzania" },
  { code: "+256", name: "Uganda" },
  // Add more country codes as needed
].sort((a, b) => a.name.localeCompare(b.name));

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+251"); // Default to Ethiopia
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    otp: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setIsOtpSent(false);
    setFormData({
      fullName: "",
      phoneNumber: "",
      email: "",
      password: "",
      otp: "",
    });
  };
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("✅ User is logged in.");
    } else {
      console.log("❌ User is logged out. Redirecting...");
      navigate("/auth");
    }
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCountryCodeChange = (e) => {
    setSelectedCountryCode(e.target.value);
  };

  const validateForm = () => {
    const newErrors = {};
    if (isLogin) {
      if (!formData.email) {
        newErrors.email = "Email is required";
      }
    } else {
      if (!formData.fullName) newErrors.fullName = "Full name is required";
      if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.password) newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Combine country code with phone number before sending
    const submissionData = {
      ...formData,
      phoneNumber: isLogin ? formData.phoneNumber : `${selectedCountryCode}${formData.phoneNumber}`
    };

    setLoading(true);
    try {
      const endpoint = isLogin ? "/login" : "/register";
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      console.log("Success:", data);

      if (isLogin) {
        setIsOtpSent(true); // Show OTP input field
      } else {
        setIsLogin(true); // Switch to login page after signup
      }
    } catch (error) {
      setErrors({ apiError: error.message });
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      setErrors({ otp: "OTP is required" });
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: formData.otp }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid OTP");
  
      console.log("✅ OTP Verified:", data);
      console.log("User object structure:", data.user); // Debug log
  
      // Validate and store user data
      if (!data.user || !data.user._id) {
        throw new Error("Authentication succeeded but user data is incomplete");
      }
  
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("Successfully stored userId:", data.user._id);
  
      // Restore cart
      try {
        const cartResponse = await fetch(`https://outlier-and-da-backend.onrender.com/api/cart`, {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });
        
        if (cartResponse.ok) {
          const cartData = await cartResponse.json();
          localStorage.setItem("cart", JSON.stringify(cartData));
        }
      } catch (cartError) {
        console.warn("Cart restoration failed:", cartError);
      }
  
      navigate("/");
    } catch (error) {
      console.error("OTP verification failed:", error);
      setErrors({ apiError: error.message });
    }
    setLoading(false);
  };

  return (
    <div style={styles.container} className="container">
      <div style={styles.formContainer} className="form-container">
        <img src={logoImage} alt="Logo" style={styles.logo} />
        <h2 style={styles.title}>{isLogin ? (isOtpSent ? "Enter OTP Sent to Your Email" : "Login") : "Sign Up"}</h2>

        <form style={styles.form} onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                placeholder="Full Name"
                style={styles.input}
                onChange={handleInputChange}
              />
              {errors.fullName && <span style={styles.error}>{errors.fullName}</span>}
            </>
          )}

          {!isOtpSent && (
            <>
              {!isLogin && (
                <div style={styles.phoneContainer}>
                  <select 
                    value={selectedCountryCode}
                    onChange={handleCountryCodeChange}
                    style={styles.countryCodeSelect}
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code} ({country.name})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    placeholder="Phone Number"
                    style={styles.phoneInput}
                    onChange={handleInputChange}
                  />
                  {errors.phoneNumber && <span style={styles.error}>{errors.phoneNumber}</span>}
                </div>
              )}
              
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Email"
                style={styles.input}
                onChange={handleInputChange}
              />
              {errors.email && <span style={styles.error}>{errors.email}</span>}
            </>
          )}

          {!isLogin && !isOtpSent && (
            <>
              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="Password"
                style={styles.input}
                onChange={handleInputChange}
              />
              {errors.password && <span style={styles.error}>{errors.password}</span>}
            </>
          )}

          {isOtpSent ? (
            <>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                placeholder="Enter OTP"
                style={styles.input}
                onChange={handleInputChange}
              />
              {errors.otp && <span style={styles.error}>{errors.otp}</span>}

              <button type="button" style={styles.button} onClick={handleVerifyOTP} disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          ) : (
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Processing..." : isLogin ? "Send OTP" : "Sign Up"}
            </button>
          )}
        </form>

        {errors.apiError && <p style={styles.error}>{errors.apiError}</p>}

        {!isOtpSent && (
          <p style={styles.switchText}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span onClick={toggleAuthMode} style={styles.switchLink}>
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        )}

        <Link to="/" style={styles.homeLink}>← Back to Home</Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "100%",
    maxWidth: "400px",
  },
  logo: {
    width: "120px",
    marginBottom: "10px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#E60000",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  phoneContainer: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "5px",
    margin: "10px 0",
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  countryCodeSelect: {
    border: "none",
    outline: "none",
    fontSize: "14px",
    padding: "10px",
    backgroundColor: "#f2f2f2",
    cursor: "pointer",
    maxWidth: "120px",
  },
  phoneInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "16px",
    padding: "10px",
  },
  input: {
    border: "1px solid #ccc",
    borderRadius: "5px",
    outline: "none",
    fontSize: "16px",
    padding: "10px",
    marginBottom: "10px",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#E60000",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "10px",
  },
  switchText: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#555",
  },
  switchLink: {
    color: "#E60000",
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "5px",
    textAlign: "left",
    fontWeight: "bold",
  },
  homeLink: {
    display: "block",
    marginTop: "15px",
    color: "#333",
    textDecoration: "none",
    fontSize: "14px",
  },
};

export default AuthPage;