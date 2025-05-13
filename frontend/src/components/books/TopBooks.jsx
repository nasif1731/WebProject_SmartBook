"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap"

const TopBooks = () => {
  const { user } = useAuth()
  const [books, setBooks] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/book-search/top`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Failed to load top books")
        setBooks(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTopBooks()
  }, [user.token])

  const backgroundStyle = {
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    minHeight: "100vh",
    paddingTop: "2rem",
    paddingBottom: "3rem",
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
                      background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
                      boxShadow: "0 4px 10px rgba(255, 154, 158, 0.3)",
                    }}
                  >
                    <i className="fas fa-chart-line text-white" style={{ fontSize: "1.5rem" }}></i>
                  </span>
                  <span>Top Books</span>
                </h2>
                <p className="text-muted mb-0 mt-1">Most popular books in our library</p>
              </div>
              <div
                className="d-none d-md-flex align-items-center justify-content-center"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "30px",
                  background: "rgba(255, 154, 158, 0.1)",
                }}
              >
                <span style={{ fontSize: "2rem" }}>📚</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Error */}
        {error && (
          <Alert variant="danger" className="d-flex align-items-center shadow-sm mb-4" style={{ borderRadius: "10px" }}>
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </Alert>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center p-5 bg-white shadow-sm" style={{ borderRadius: "15px", backdropFilter: "blur(10px)" }}>
            <div className="mb-3">
              <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
            </div>
            <p className="text-muted mb-0">Loading top books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center p-5 bg-white shadow-sm" style={{ borderRadius: "15px", backdropFilter: "blur(10px)" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📊</div>
            <h4>No popular books yet</h4>
            <p className="text-muted">Books will appear here as they gain popularity. Check back soon!</p>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {books.map((book, index) => {
              const shortSummary = book.summary?.length > 120 ? book.summary.slice(0, 120) + "..." : book.summary

              return (
                <Col key={book._id}>
                  <Card
                    className="h-100 border-0 shadow-sm"
                    style={{
                      borderRadius: "15px",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onClick={() => navigate(`/book/${book._id}`)}
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
  {/* Grouped Rank + Views */}
  <div
    className="position-absolute"
    style={{
      top: "10px",
      right: "10px",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: "8px", // spacing between them
      zIndex: 2,
    }}
  >
    {index < 3 && (
      <div
        style={{
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
      >
        #{index + 1}
      </div>
    )}
    {book.views > 0 && (
      <Badge
        bg="secondary"
        style={{
          borderRadius: "8px",
          padding: "0.5rem 0.75rem",
        }}
      >
        <i className="fas fa-eye me-1"></i>
        {book.views}
      </Badge>
    )}
  </div>

  {/* Book Cover */}
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

  {/* Genre Badge */}
  {book.genre && (
    <Badge
      bg="primary"
      className="position-absolute top-0 start-0 m-2"
      style={{ borderRadius: "8px", padding: "0.5rem 0.75rem" }}
    >
      {book.genre}
    </Badge>
  )}
</div>


                    <Card.Body>
                      <Card.Title>{book.title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">by {book.author || "Unknown"}</Card.Subtitle>

                      <div className="d-flex align-items-center mb-3">
                        <div className="me-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <i
                              key={i}
                              className={`fas fa-star ${i < Math.round(book.rating || 0) ? "text-warning" : "text-muted"}`}
                              style={{ fontSize: "0.8rem" }}
                            ></i>
                          ))}
                        </div>
                        <small className="text-muted">({book.ratingCount || 0} reviews)</small>
                      </div>

                      {book.summary && (
                        <Card.Text
                          className="text-muted"
                          style={{ fontStyle: "italic", fontSize: "0.9rem", marginBottom: "1rem" }}
                        >
                          {shortSummary}
                        </Card.Text>
                      )}

                      <div className="d-flex justify-content-between mt-3">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/reader/${book._id}`)
                          }}
                          style={{ borderRadius: "10px" }}
                        >
                          <i className="fas fa-book-open me-2"></i>
                          Read
                        </Button>

                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/reviews/${book._id}`)
                          }}
                          style={{ borderRadius: "10px" }}
                        >
                          <i className="fas fa-star me-2"></i>
                          Reviews
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              )
            })}
          </Row>
        )}
      </Container>
    </div>
  )
}

export default TopBooks
