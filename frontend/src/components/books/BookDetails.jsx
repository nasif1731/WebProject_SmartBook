"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Container, Card, Button, Alert, Spinner, Badge, Row, Col } from "react-bootstrap"

const BookDetail = () => {
  const { user } = useAuth()
  const { bookId } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/${bookId}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message)
        setBook(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [bookId, user?.token])
 if (!user || !user.token) {
    const backgroundStyle = {
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #f0f4f8, #d9e2ec)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    return (
      <div style={backgroundStyle}>
        <Container className="py-5">
          <Card
            className="border-0 shadow-sm text-center p-5"
            style={{ borderRadius: "15px", backdropFilter: "blur(10px)" }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔒</div>
            <h3 className="mb-3">Authentication Required</h3>
            <p className="mb-4">
              Please{" "}
              <a href="/login" className="fw-bold text-decoration-none">
                login
              </a>{" "}
              to access the SmartBook Library.
            </p>
            <p className="text-muted small">
              Features like <strong>Library, Read, Upload, Analytics, Recently Read</strong> are only available to
              logged-in users.
            </p>
            <div className="mt-4">
              <Button
                variant="primary"
                href="/login"
                className="me-2"
                style={{
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                  border: "none",
                  boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
                }}
              >
                Login
              </Button>
              <Button variant="outline-primary" href="/register" style={{ borderRadius: "10px" }}>
                Register
              </Button>
            </div>
          </Card>
        </Container>
      </div>
    );
  }
  // Background gradient style
  const backgroundStyle = {
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    minHeight: "100vh",
    paddingTop: "2rem",
    paddingBottom: "3rem",
  }

  if (error)
    return (
      <div style={backgroundStyle}>
        <Container>
          <Alert
            variant="danger"
            className="mt-4 d-flex align-items-center shadow-sm"
            style={{ borderRadius: "10px" }}
          >
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </Alert>
        </Container>
      </div>
    )

  if (loading)
    return (
      <div style={backgroundStyle}>
        <Container className="text-center py-5">
          <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
          <p className="mt-3 text-muted">Loading book details...</p>
        </Container>
      </div>
    )

  return (
    <div style={backgroundStyle}>
      <Container>
        <Card
          className="border-0 shadow-sm overflow-hidden"
          style={{ borderRadius: "15px", backdropFilter: "blur(10px)" }}
        >
          <Row className="g-0">
            <Col md={4} className="bg-light d-flex align-items-center justify-content-center p-4">
              {book.coverImageUrl ? (
                <img
                  src={
                    book.coverImageUrl?.startsWith("http")
                      ? book.coverImageUrl
                      : `${process.env.REACT_APP_API_BASE_URL}${book.coverImageUrl}`
                  }
                  alt="Book Cover"
                  style={{
                    width: "100%",
                    maxWidth: "280px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center bg-white"
                  style={{
                    width: "100%",
                    maxWidth: "280px",
                    height: "400px",
                    borderRadius: "10px",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  }}
                >
                  <i className="fas fa-book" style={{ fontSize: "5rem", color: "#ccc" }}></i>
                </div>
              )}
            </Col>
            <Col md={8}>
              <Card.Body className="p-4 p-md-5">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h1 className="mb-2">{book.title}</h1>
                    <p className="text-muted mb-3 fs-5">by {book.author || "Unknown"}</p>
                  </div>
                  {book.isPublic && (
                    <Badge
                      bg="success"
                      className="px-3 py-2"
                      style={{ borderRadius: "20px", fontSize: "0.8rem" }}
                    >
                      <i className="fas fa-globe me-1"></i> Public
                    </Badge>
                  )}
                </div>

                <div className="mb-4">
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {book.genre && (
                      <Badge
                        bg="primary"
                        className="px-3 py-2"
                        style={{
                          borderRadius: "20px",
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        }}
                      >
                        <i className="fas fa-bookmark me-1"></i> {book.genre}
                      </Badge>
                    )}
                    {book.tags?.map((tag, idx) => (
                      <Badge
                        key={idx}
                        bg="secondary"
                        className="px-3 py-2"
                        style={{ borderRadius: "20px", backgroundColor: "#6c757d" }}
                      >
                        <i className="fas fa-tag me-1"></i> {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="mb-4">
                    <h5 className="fw-bold mb-2">Description</h5>
                    <p className="mb-0">{book.description || "No description provided."}</p>
                  </div>

                  {/* Summary Section */}
                  <div
                    className="p-4 mb-4 rounded"
                    style={{ backgroundColor: "rgba(102, 126, 234, 0.05)", border: "1px solid rgba(102, 126, 234, 0.1)" }}
                  >
                    <h5 className="fw-bold d-flex align-items-center mb-3">
                      <i className="fas fa-book-open me-2 text-primary"></i> Summary
                    </h5>
                    <p className="mb-0">{book.summary || "No summary available yet."}</p>
                  </div>

                  {/* Stats Section */}
                  <div className="d-flex flex-wrap gap-4 mb-4">
                    {book.views !== undefined && (
                      <div className="d-flex align-items-center">
                        <div
                          className="d-flex align-items-center justify-content-center me-2"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(102, 126, 234, 0.1)",
                          }}
                        >
                          <i className="fas fa-eye text-primary"></i>
                        </div>
                        <div>
                          <div className="fw-bold">{book.views || 0}</div>
                          <div className="text-muted small">Views</div>
                        </div>
                      </div>
                    )}

                    {book.rating !== undefined && (
                      <div className="d-flex align-items-center">
                        <div
                          className="d-flex align-items-center justify-content-center me-2"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(255, 193, 7, 0.1)",
                          }}
                        >
                          <i className="fas fa-star text-warning"></i>
                        </div>
                        <div>
                          <div className="fw-bold">{book.rating?.toFixed(1) || "0.0"}</div>
                          <div className="text-muted small">Rating</div>
                        </div>
                      </div>
                    )}

                    {book.pageCount !== undefined && (
                      <div className="d-flex align-items-center">
                        <div
                          className="d-flex align-items-center justify-content-center me-2"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(40, 167, 69, 0.1)",
                          }}
                        >
                          <i className="fas fa-file-alt text-success"></i>
                        </div>
                        <div>
                          <div className="fw-bold">{book.pageCount || 0}</div>
                          <div className="text-muted small">Pages</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="d-flex flex-wrap gap-3">
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/reader/${book._id}`)}
                      style={{
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
                        padding: "0.6rem 1.5rem",
                      }}
                    >
                      <i className="fas fa-book-open me-2"></i>
                      Read Now
                    </Button>
                    <Button
                      variant="warning"
                      onClick={() => navigate(`/reviews/${book._id}`)}
                      style={{
                        borderRadius: "10px",
                        padding: "0.6rem 1.5rem",
                      }}
                    >
                      <i className="fas fa-star me-2"></i>
                      Reviews
                    </Button>
                    {user && book.userId === user.id && (
                      <Button
                        variant="outline-primary"
                        onClick={() => navigate(`/edit/${book._id}`)}
                        style={{
                          borderRadius: "10px",
                          padding: "0.6rem 1.5rem",
                        }}
                      >
                        <i className="fas fa-edit me-2"></i>
                        Edit Book
                      </Button>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  )
}

export default BookDetail

