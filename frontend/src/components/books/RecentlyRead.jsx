"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Container, Card, Button, Alert, Row, Col, Spinner, Badge, ProgressBar } from "react-bootstrap"

const RecentlyRead = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentlyRead = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/book-search/recent`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message)
        setBooks(data)
      } catch (err) {
        setError(err.message || "Failed to load recently read books")
      } finally {
        setLoading(false)
      }
    }
    fetchRecentlyRead()
  }, [user.token])

  // Background gradient style
  const backgroundStyle = {
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    minHeight: "100vh",
    paddingTop: "2rem",
    paddingBottom: "3rem",
  }

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div style={backgroundStyle}>
      <Container>
        {/* Header Section */}
        <Card
          className="border-0 shadow-sm mb-4 bg-white bg-opacity-90"
          style={{ borderRadius: "15px", backdropFilter: "blur(10px)" }}
        >
          <Card.Body className="py-4">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h2 className="mb-0 d-flex align-items-center">
                  <span
                    className="me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
                      boxShadow: "0 4px 10px rgba(161, 196, 253, 0.3)",
                    }}
                  >
                    <i className="fas fa-history text-white" style={{ fontSize: "1.5rem" }}></i>
                  </span>
                  <span>Recently Read</span>
                </h2>
                <p className="text-muted mb-0 mt-1">Continue where you left off</p>
              </div>
              <div
                className="d-none d-md-flex align-items-center justify-content-center"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "30px",
                  background: "rgba(161, 196, 253, 0.1)",
                }}
              >
                <span style={{ fontSize: "2rem" }}>🕒</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="d-flex align-items-center shadow-sm mb-4" style={{ borderRadius: "10px" }}>
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </Alert>
        )}

        {/* Content Section */}
        {loading ? (
          <div
            className="text-center p-5 bg-white shadow-sm"
            style={{ borderRadius: "15px", backdropFilter: "blur(10px)" }}
          >
            <div className="mb-3">
              <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
            </div>
            <p className="text-muted mb-0">Loading your reading history...</p>
          </div>
        ) : books.length === 0 ? (
          <div
            className="text-center p-5 bg-white shadow-sm"
            style={{ borderRadius: "15px", backdropFilter: "blur(10px)" }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📚</div>
            <h4>No reading history yet</h4>
            <p className="text-muted">Start reading books to see your history here!</p>
            <Button
              variant="primary"
              onClick={() => navigate("/browse")}
              style={{
                borderRadius: "10px",
                background: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
                border: "none",
                boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
              }}
            >
              <i className="fas fa-search me-2"></i>
              Browse Books
            </Button>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {books.map((book) => (
              <Col key={book._id}>
                <Card
                  className="h-100 border-0 shadow-sm"
                  style={{
                    borderRadius: "15px",
                    overflow: "hidden",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)"
                    e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.06)"
                  }}
                >
                  <div style={{ position: "relative" }}>
                    {book.coverImageUrl ? (
                      <Card.Img
                        variant="top"
                        src={
                          book.coverImageUrl?.startsWith("http")
                            ? book.coverImageUrl
                            : `${process.env.REACT_APP_API_BASE_URL}${book.coverImageUrl}`
                        }
                        style={{ objectFit: "cover", height: "220px" }}
                        alt="Book Cover"
                      />
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center text-muted"
                        style={{
                          height: "220px",
                          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
                        }}
                      >
                        <i className="fas fa-book" style={{ fontSize: "3rem" }}></i>
                      </div>
                    )}
                    {book.lastRead && (
                      <Badge
                        bg="info"
                        className="position-absolute top-0 end-0 m-2"
                        style={{ borderRadius: "8px", padding: "0.5rem 0.75rem" }}
                      >
                        <i className="fas fa-clock me-1"></i>
                        {formatDate(book.lastRead)}
                      </Badge>
                    )}
                  </div>
                  <Card.Body>
                    <Card.Title className="mb-1">{book.title}</Card.Title>
                    <Card.Subtitle className="mb-3 text-muted">by {book.author || "Unknown"}</Card.Subtitle>

                    {book.progress !== undefined && (
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="text-muted">Reading Progress</small>
                          <Badge bg="success" pill>
                            {Math.round(book.progress * 100)}%
                          </Badge>
                        </div>
                        <ProgressBar
                          variant="success"
                          now={book.progress * 100}
                          style={{ height: "8px", borderRadius: "4px" }}
                        />
                      </div>
                    )}

                    <div className="d-flex justify-content-between mt-3">
                     <Button
  variant="primary"
  size="sm"
  onClick={(e) => {
    e.stopPropagation()
    navigate(`/reader/${book._id}`)
  }}
  style={{
    borderRadius: "10px",
    background: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    border: "none",
    color: "#000", // ensure text is visible
    boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s ease-in-out",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.filter = "brightness(1.05)"
    e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)"
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.filter = "brightness(1)"
    e.currentTarget.style.boxShadow = "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)"
  }}
>
  <i className="fas fa-book-open me-2"></i>
  Read
</Button>

                      <Button
                        variant="outline-warning"
                        onClick={() => navigate(`/reviews/${book._id}`)}
                        style={{ borderRadius: "10px" }}
                      >
                        <i className="fas fa-star me-2"></i>
                        Reviews
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  )
}

export default RecentlyRead

