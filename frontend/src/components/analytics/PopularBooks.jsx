"use client";

import { useEffect, useState } from "react";
import BookCard from "../books/BookCard";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";

const PopularBooks = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [metric, setMetric] = useState("views");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularBooks = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/metrics/popular?metric=${metric}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch popular books");
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularBooks();
  }, [metric]);

  const backgroundStyle = {
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    minHeight: "100vh",
    paddingTop: "2rem",
    paddingBottom: "3rem",
  };

  return (
    <div style={backgroundStyle}>
      <Container>
        <Card
          className="border-0 shadow-sm mb-4 bg-white bg-opacity-90"
          style={{ borderRadius: "15px", backdropFilter: "blur(10px)" }}
        >
          <Card.Body className="py-4">
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap">
              <div>
                <h2 className="mb-0 d-flex align-items-center">
                  <span
                    className="me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
                      boxShadow: "0 4px 10px rgba(255, 154, 158, 0.3)",
                    }}
                  >
                    <i className="fas fa-fire text-white" style={{ fontSize: "1.5rem" }}></i>
                  </span>
                  <span>Popular Books</span>
                </h2>
                <p className="text-muted mb-0 mt-1">Discover trending books based on user activity</p>
              </div>
              <div className="d-flex align-items-center mt-3 mt-md-0">
                <span className="me-2 fw-semibold">Sort by:</span>
                <Form.Select
                  value={metric}
                  onChange={(e) => setMetric(e.target.value)}
                  style={{ width: "auto", borderRadius: "10px" }}
                >
                  <option value="views">👁️ Views</option>
                  <option value="readCount">📚 Read Count</option>
                  <option value="averageRating">⭐ Average Rating</option>
                </Form.Select>
              </div>
            </div>
          </Card.Body>
        </Card>

        {error && (
          <Alert
            variant="danger"
            className="d-flex align-items-center shadow-sm mb-4"
            style={{ borderRadius: "10px" }}
          >
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </Alert>
        )}

        {loading ? (
          <div
            className="text-center p-5 bg-white shadow-sm"
            style={{ borderRadius: "15px", backdropFilter: "blur(10px)" }}
          >
            <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
            <p className="text-muted mt-3">Loading popular books...</p>
          </div>
        ) : books.length === 0 ? (
          <div
            className="text-center p-5 bg-white shadow-sm"
            style={{ borderRadius: "15px", backdropFilter: "blur(10px)" }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📊</div>
            <h4>No popular books yet</h4>
            <p className="text-muted">Books will appear here as they gain popularity.</p>
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {books.map((book, index) => (
              <Col key={book._id} className="position-relative">
                {/* Top Badge for Rank */}
                {index < 3 && (
                  <div
                    className="position-absolute"
                    style={{
                      top: "-10px",
                      right: "130px",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background:
                        index === 0
                          ? "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
                          : index === 1
                            ? "linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%)"
                            : "linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)",
                      color: "white",
                      fontWeight: "bold",
                      zIndex: 10,
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    #{index + 1}
                  </div>
                )}

                {/* Book Card */}
                <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <BookCard book={book} />
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default PopularBooks;
