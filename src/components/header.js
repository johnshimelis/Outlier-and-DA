import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import "../styles/header.css";
import "../styles/style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import flagImage from "../images/assets/Flag_of_Ethiopia.svg";
import logoImage from "../images/assets/da.png";
import logoImage1 from "../images/assets/da2.png";
import logoImage2 from "../images/assets/outliers.png";
import { createPortal } from "react-dom";

const Header = () => {
  const navigate = useNavigate();
  const { cartItems, fetchCartItems, clearCart } = useCart();
  const totalItems = cartItems ? cartItems.length : 0;

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (storedUser && token) {
        console.log("✅ User found in localStorage:", JSON.parse(storedUser));
        return JSON.parse(storedUser);
      }
      return null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  });

  const [isLanguageDropdownVisible, setLanguageDropdownVisible] = useState(false);
  const [currentLogo, setCurrentLogo] = useState(() => {
    const logos = [logoImage, logoImage1, logoImage2];
    return logos[Math.floor(Math.random() * logos.length)];
  });
  const dropdownRef = useRef(null);
  const userRef = useRef(null);
  const languageRef = useRef(null);

  // Function to decode JWT safely
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  // Function to shuffle logos
  const shuffleLogo = () => {
    const logos = [logoImage, logoImage1, logoImage2];
    const randomIndex = Math.floor(Math.random() * logos.length);
    setCurrentLogo(logos[randomIndex]);
  };

  // Set up logo shuffling interval
  useEffect(() => {
    shuffleLogo();
    const logoInterval = setInterval(shuffleLogo, 10 * 60 * 1000);
    return () => clearInterval(logoInterval);
  }, []);

  // Function to check user status and token expiration
  const checkUser = () => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      console.log("🔍 Checking user status...");
      console.log("Stored user:", storedUser);
      console.log("Token exists:", !!token);

      if (storedUser && token) {
        const parsedUser = JSON.parse(storedUser);
        const decodedToken = decodeToken(token);
        
        if (decodedToken) {
          const tokenExpiry = decodedToken.exp;
          const currentTime = Math.floor(Date.now() / 1000);

          if (tokenExpiry && tokenExpiry < currentTime) {
            console.log("Token expired, logging out");
            handleLogout();
          } else {
            console.log("✅ Valid user, setting user state:", parsedUser);
            setUser(parsedUser);
          }
        } else {
          console.log("Invalid token, logging out");
          handleLogout();
        }
      } else {
        console.log("No user or token, setting user to null");
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking user status:", error);
      setUser(null);
    }
  };

  // Check user on mount and set up storage listener
  useEffect(() => {
    checkUser();
    
    const handleStorageChange = (event) => {
      console.log("Storage event detected:", event.key);
      if (event.key === "user" || event.key === "token") {
        checkUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Check token expiration periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = decodeToken(token);
        const tokenExpiry = decodedToken?.exp;
        const currentTime = Math.floor(Date.now() / 1000);

        if (tokenExpiry && tokenExpiry < currentTime) {
          handleLogout();
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Fetch cart items when user changes
  useEffect(() => {
    if (user) { 
      fetchCartItems();
    } else {
      clearCart();
    }
  }, [user]);

  // Debug user state changes
  useEffect(() => {
    console.log("Current user state:", user);
    console.log("LocalStorage user:", localStorage.getItem("user"));
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    clearCart();
    setUser(null);
    console.log("Logging out, redirecting to /auth");
    navigate("/auth");
  };

  const toggleLanguageDropdown = () => {
    setLanguageDropdownVisible(!isLanguageDropdownVisible);
  };

  const handleClickOutside = (event) => {
    if (languageRef.current && !languageRef.current.contains(event.target)) {
      setLanguageDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <section className="justify-content-center align-items-center d-flex">
        <div className="navbar" id="nav">
          <div className="nav-logo" onClick={() => navigate("/")}>
            <img src={currentLogo} alt="Logo" />
          </div>
          
          <div className="nav-search text-nav">
            <form>
              <input type="text" placeholder="What are you looking for?" />
            </form>
          </div>
          <div className="nav-bar-lang me-4 d-flex justify-content-center align-items-center">
            <div 
              ref={languageRef}
              className="nav-language" 
              onClick={toggleLanguageDropdown}
              style={{ cursor: "pointer", position: "relative" }}
            >
              <i className="fas fa-globe"></i> Language
              {isLanguageDropdownVisible && (
                <div className="language-dropdown-menu">
                  <div className="language-option">
                    <span className="language-code">GB</span>
                    <span className="language-name">English</span>
                  </div>
                  <div className="language-option">
                    <span className="language-code">ET</span>
                    <span className="language-name">አማርኛ</span>
                  </div>
                </div>
              )}
            </div>
            <hr />
            {user ? (
              <div
                ref={userRef}
                className="nav-user text-nav user-dropdown"
                onMouseEnter={() => dropdownRef.current?.classList.add("visible")}
                onMouseLeave={() => dropdownRef.current?.classList.remove("visible")}
              >
                <span style={{ cursor: "pointer" }}>
                  {user.fullName ? (
                    `Welcome, ${user.fullName}`
                  ) : (
                    <span style={{ color: 'red' }}>
                      User logged in (ID: {user._id})
                    </span>
                  )}
                  <i className="fas fa-user"></i>
                </span>
                {createPortal(
                  <div className="dropdown-menu" ref={dropdownRef}>
                    <div onClick={() => navigate("/profile")}>Profile</div>
                    <div onClick={() => navigate("/notifications")}>Notifications</div>
                    <div onClick={() => navigate("/messages")}>Messages</div>
                    <div onClick={() => navigate("/orders")}>Orders</div>
                    <hr />
                    <div className="logout" onClick={handleLogout}>Logout</div>
                  </div>,
                  document.body
                )}
              </div>
            ) : (
              <span
                className="nav-user text-nav"
                onClick={() => navigate("/auth")}
                style={{ cursor: "pointer" }}
              >
                Sign In
              </span>
            )}
            <hr />
            <div className="nav-cart text-nav" onClick={() => navigate("/cart")}>
              Cart <i className="fas fa-shopping-cart"></i>
              {totalItems > 0 && <span className="cart-count-badge">{totalItems}</span>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Header;