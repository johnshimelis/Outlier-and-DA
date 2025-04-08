import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../styles/slider.css";
import axios from "axios";

const RoundSlider = () => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://outlier-and-da-backend.onrender.com/api/categories");
        if (response.status === 200) {
          setCategories(response.data);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handlePrevClick = () => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.firstChild.offsetWidth + 10;
      sliderRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleNextClick = () => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.firstChild.offsetWidth + 10;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Navigate to product page on category click
  const handleCategoryClick = (categoryId) => {
    // Convert ObjectId to string if it isn't already
    const idString = typeof categoryId === 'object' ? categoryId.toString() : categoryId;
    navigate(`/products/${idString}`);
  };

  if (loading) {
    return <div className="loading-message">Loading categories...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <section className="category-slider-section">
      <div className="nav-slider">
        <button className="nav-slider-button left" onClick={handlePrevClick}>
          <FaChevronLeft />
        </button>

        <div ref={sliderRef} className="slider-container">
          {categories.map((category) => (
            <div
              key={category._id}
              className="nav-slider-box"
              onClick={() => handleCategoryClick(category._id)}
            >
              <img
                src={category.image || "https://via.placeholder.com/150"}
                alt={category.name}
                className="category-image"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
              <span className="category-name">{category.name}</span>
            </div>
          ))}
        </div>

        <button className="nav-slider-button right" onClick={handleNextClick}>
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

export default RoundSlider;