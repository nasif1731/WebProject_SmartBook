"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Card,
  ListGroup,
  Badge,
  Spinner,
  Alert,
  Image,
} from "react-bootstrap";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/metrics/leaderboard`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load leaderboard");

        // ✅ Sort users by completedBooks descending
        const sorted = [...data].sort((a, b) => (b.completedBooks || 0) - (a.completedBooks || 0));
        setUsers(sorted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const backgroundStyle = {
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    minHeight: "100vh",
    paddingTop: "2rem",
    paddingBottom: "3rem",
  };

  const getMedalColor = (index) => {
    switch (index) {
      case 0:
        return "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"; // Gold
      case 1:
        return "linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%)"; // Silver
      case 2:
        return "linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)"; // Bronze
      default:
        return "linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%)"; // Default
    }
  };

  return (
    <div style={backgroundStyle}>
      <Container>
        <Card
          className="border-0 shadow-sm mb-4 bg-white bg-opacity-90"
          style={{ borderRadius: "15px", backdropFilter: "blur(10px)" }}
        >
          <Card.Body className="py-4">
            <div className="d-flex align-items-center justify-content-between flex-wrap">
              <div>
                <h2 className="mb-0 d-flex align-items-center">
                  <span
                    className="me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
                      boxShadow: "0 4px 10px rgba(252, 203, 144, 0.3)",
                    }}
                  >
                    <i className="fas fa-trophy text-white" style={{ fontSize: "1.5rem" }}></i>
                  </span>
                  <span>Leaderboard</span>
                </h2>
                <p className="text-muted mb-0 mt-1">Top readers ranked by completed books</p>
              </div>
              <div
                className="d-none d-md-flex align-items-center justify-content-center"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "30px",
                  background: "rgba(252, 203, 144, 0.1)",
                }}
              >
                <span style={{ fontSize: "2rem" }}>🏆</span>
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

        <Card className="border-0 shadow-sm" style={{ borderRadius: "15px", overflow: "hidden" }}>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
                <p className="text-muted mt-3">Loading leaderboard...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-5">
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🏆</div>
                <h4>No readers on the leaderboard yet</h4>
                <p className="text-muted">Start reading to climb the ranks!</p>
              </div>
            ) : (
              <ListGroup variant="flush">
                {users.map((user, idx) => (
                  <ListGroup.Item
                    key={user.userId || idx}
                    className={idx % 2 === 0 ? "bg-light bg-opacity-50" : ""}
                    style={{
                      border: "none",
                      padding: "1rem 1.5rem",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(252, 203, 144, 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = idx % 2 === 0 ? "rgba(0, 0, 0, 0.03)" : "";
                    }}
                  >
                    <div className="d-flex align-items-center">
                      {/* Rank Medal */}
                      <div
                        className="me-3 d-flex align-items-center justify-content-center"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: getMedalColor(idx),
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                        }}
                      >
                        {idx + 1}
                      </div>

                      {/* Avatar */}
                      <div className="me-3">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.fullName || "User"}
                            roundedCircle
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              border: "2px solid white",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            }}
                          />
                        ) : (
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
                            style={{
                              width: "50px",
                              height: "50px",
                              border: "2px solid white",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            }}
                          >
                            <i className="fas fa-user"></i>
                          </div>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex-grow-1">
                        <h5 className="mb-0 fw-bold">{user.fullName || "Unnamed Reader"}</h5>
                        <div className="text-muted small">
                          Joined {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : "N/A"}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="d-flex flex-column align-items-end">
                        <Badge
                          className="px-3 py-2 mb-1"
                          style={{
                            borderRadius: "20px",
                            background: "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
                            fontSize: "1rem",
                          }}
                        >
                          {user.completedBooks || 0} books
                        </Badge>
                        <small className="text-muted">
                          {user.totalPages || 0} pages read
                        </small>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Leaderboard;
