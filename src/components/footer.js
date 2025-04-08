import React from "react";
import "../styles/footer.css"; // Assuming styles are in a separate CSS file named Footer.css

const Footer = () => {
  return (
    <section>
      <div className="footer">
        <div className="hr">
          <hr />
        </div>
         

      <div className="footer-box-help">
        <div className="box-2">
          <p>We're Always Here To Help</p>
          <h2>Reach out to us through any of these support channels</h2>
        </div>
        <div className="footer-box-help-icons">
          <div className="box-2">
            <div className="box-2-1">
              <div className="box-2-icon">
                <i className="fa-solid fa-circle-info"></i>
              </div>
              <div className="box-2-text">
                <h2>HELP CENTER</h2>
            Johnshimelis40@gmail.com
              </div>
            </div>
          </div>
          <div className="box-2">
            <div className="box-2-1">
              <div className="box-2-icon">
                <i className="fa-regular fa-envelope"></i>
              </div>
              <div className="box-2-text">
                <h2>EMAIL SUPPORT</h2>
                Johnshimelis09@gmail.com
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="line-hr">
        <hr />
      </div>

      
      <div className="footer-box-links mt-5">
        <div className="box-4">
          <h2>SHOP ON THE GO</h2>
          <div className="box-4-1">
            <img
              src="https://f.nooncdn.com/s/app/com/common/images/logos/app-store.svg"
              alt="App Store"
              loading="lazy"
              className="sc-ec94e93f-16 kXFkQM"
            />
            <img
              src="https://f.nooncdn.com/s/app/com/common/images/logos/google-play.svg"
              alt="Google Play"
              loading="lazy"
              className="sc-ec94e93f-16 kXFkQM"
            />
          </div>
        </div>

        <div className="box-4">
          <h2>CONNECT WITH US</h2>
          <div className="box-4-1">
            <i className="fa-brands fa-facebook"></i>
            <i className="fa-brands fa-twitter"></i>
            <i className="fa-brands fa-instagram"></i>
            <i className="fa-brands fa-linkedin"></i>
          </div>
        </div>
      </div>

      <div className="line-hr">
        <hr />
      </div>

      <div className="footer-rights">
        <ul>
          <li>
            <a href="#">©️ 2025 John Tech. All rights Reserved</a>
          </li>
       
          <li>
            <a href="#">Terms of Use</a>
          </li>
          <li>
            <a href="#">Privacy Policy</a>
          </li>
          <li>
            <a href="#">Intellectual Property Right</a>
          </li>
          <li>
            <a href="#">Terms of Sale</a>
          </li>
          <li>
            <a href="#">FAQs</a>
          </li>
          <li>
            <a href="#">Contact Us</a>
          </li>
          <li>
            <a href="#">Country</a>
          </li>
          <li>
            <a href="#">KSA</a>
          </li>
        </ul>
      </div>
    </div>
    </section>
  );
};

export default Footer;
