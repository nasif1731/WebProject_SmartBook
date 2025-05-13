import { Container, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto">
      <Container>
        <Row className="gy-4">
          <Col lg={4} md={6}>
            <div className="footer-info">
              <h3 className="mb-3 d-flex align-items-center">
                <span className="me-2" style={{ fontSize: "1.5rem" }}>
                  📚
                </span>
                <span
                  style={{
                    background: "linear-gradient(45deg, #2ab8a6, #4bc8bc)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  SmartBook
                </span>
              </h3>
              <p className="text-white-50">
                Your digital library for discovering, reading, and sharing books. We bring readers together in a modern,
                interactive platform.
              </p>
              <div className="social-links mt-3 d-flex gap-2">
                <a
                  href="#"
                  className="d-inline-flex align-items-center justify-content-center text-white"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.1)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <i className="bi bi-facebook"></i>
                </a>
                <a
                  href="#"
                  className="d-inline-flex align-items-center justify-content-center text-white"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.1)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <i className="bi bi-twitter"></i>
                </a>
                <a
                  href="#"
                  className="d-inline-flex align-items-center justify-content-center text-white"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.1)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <i className="bi bi-instagram"></i>
                </a>
              </div>
            </div>
          </Col>

          <Col lg={2} md={6}>
            <h5 className="mb-3" style={{ color: "#2ab8a6" }}>
              Navigation
            </h5>
            <ul className="list-unstyled footer-links">
              <li className="mb-2">
                <Link to="/" className="text-white-50 text-decoration-none">
                  <i className="bi bi-chevron-right me-1" style={{ fontSize: "0.75rem" }}></i> Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/library" className="text-white-50 text-decoration-none">
                  <i className="bi bi-chevron-right me-1" style={{ fontSize: "0.75rem" }}></i> Library
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/popular" className="text-white-50 text-decoration-none">
                  <i className="bi bi-chevron-right me-1" style={{ fontSize: "0.75rem" }}></i> Popular Books
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/leaderboard" className="text-white-50 text-decoration-none">
                  <i className="bi bi-chevron-right me-1" style={{ fontSize: "0.75rem" }}></i> Leaderboard
                </Link>
              </li>
            </ul>
          </Col>

          <Col lg={2} md={6}>
            <h5 className="mb-3" style={{ color: "#2ab8a6" }}>
              Account
            </h5>
            <ul className="list-unstyled footer-links">
              <li className="mb-2">
                <Link to="/login" className="text-white-50 text-decoration-none">
                  <i className="bi bi-chevron-right me-1" style={{ fontSize: "0.75rem" }}></i> Login
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/register" className="text-white-50 text-decoration-none">
                  <i className="bi bi-chevron-right me-1" style={{ fontSize: "0.75rem" }}></i> Register
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/dashboard" className="text-white-50 text-decoration-none">
                  <i className="bi bi-chevron-right me-1" style={{ fontSize: "0.75rem" }}></i> Dashboard
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/profile" className="text-white-50 text-decoration-none">
                  <i className="bi bi-chevron-right me-1" style={{ fontSize: "0.75rem" }}></i> Profile
                </Link>
              </li>
            </ul>
          </Col>

          <Col lg={4} md={6}>
            <h5 className="mb-3" style={{ color: "#2ab8a6" }}>
              Contact Us
            </h5>
            <p className="text-white-50">
              <i className="bi bi-geo-alt me-2"></i> 123 Book Street, Reading City, RC 12345
            </p>
            <p className="text-white-50">
              <i className="bi bi-envelope me-2"></i> contact@smartbook.com
            </p>
            <p className="text-white-50">
              <i className="bi bi-phone me-2"></i> +1 234 567 8900
            </p>
          </Col>
        </Row>

        <hr className="mt-4 mb-3" style={{ backgroundColor: "rgba(255,255,255,0.1)", opacity: 1 }} />

        <Row>
          <Col className="text-center">
            <p className="mb-0 text-white-50">
              &copy; {new Date().getFullYear()} <span className="text-white">SmartBook</span>. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
