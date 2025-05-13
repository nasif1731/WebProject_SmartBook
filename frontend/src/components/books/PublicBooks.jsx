"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Card, Button, Row, Col, Alert, Spinner, Badge, Form, InputGroup } from "react-bootstrap"

const PublicBooks = () => {
  const [books, setBooks] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPublicBooks = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/public`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Failed to load public books")
        setBooks(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPublicBooks()
  }, [])

  // Filter books based on search and genre filter
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title?.toLowerCase().includes(search.toLowerCase()) ||
      book.author?.toLowerCase().includes(search.toLowerCase()) ||
      book.summary?.toLowerCase().includes(search.toLowerCase())

    const matchesFilter = filter === "all" || book.genre === filter

    return matchesSearch && matchesFilter
  })

  // Get unique genres for filter
  const genres = ["all", ...new Set(books.map((book) => book.genre).filter(Boolean))]

  // Background gradient style
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
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between">
              <div className="mb-3 mb-md-0">
                <h2 className="mb-0 d-flex align-items-center">
                  <span
                    className="me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
                      boxShadow: "0 4px 10px rgba(132, 250, 176, 0.3)",
                    }}
                  >
                    <i className="fas fa-globe text-white" style={{ fontSize: "1.5rem" }}></i>
                  </span>
                  <span>Public Library</span>
                </h2>
                <p className="text-muted mb-0 mt-1">Explore our collection of publicly available books</p>
              </div>
              <div className="d-flex gap-2">
                <InputGroup>
                  <InputGroup.Text className="bg-light border-end-0">
                    <i className="fas fa-search text-muted"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search books..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-start-0 ps-0"
                    style={{ borderRadius: "0 0.375rem 0.375rem 0", width: "200px" }}
                  />
                </InputGroup>
                <Form.Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{ borderRadius: "0.375rem", width: "150px" }}
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre === "all" ? "All Genres" : genre}
                    </option>
                  ))}
                </Form.Select>
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
            <p className="text-muted mb-0">Loading public library...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div
            className="text-center p-5 bg-white shadow-sm"
            style={{ borderRadius: "15px", backdropFilter: "blur(10px)" }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📚</div>
            <h4>{search || filter !== "all" ? "No matching books found" : "No public books available yet"}</h4>
            <p className="text-muted">
              {search || filter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Check back soon for new additions to our library"}
            </p>
            {(search || filter !== "all") && (
              <Button
                variant="outline-primary"
                onClick={() => {
                  setSearch("")
                  setFilter("all")
                }}
              >
                <i className="fas fa-undo me-2"></i>
                Reset Filters
              </Button>
            )}
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredBooks.map((book) => {
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
                      {book.genre && (
                        <Badge
                          bg="primary"
                          className="position-absolute top-0 start-0 m-2"
                          style={{ borderRadius: "8px", padding: "0.5rem 0.75rem" }}
                        >
                          {book.genre}
                        </Badge>
                      )}
                      {book.views > 0 && (
                        <Badge
                          bg="secondary"
                          className="position-absolute top-0 end-0 m-2"
                          style={{ borderRadius: "8px", padding: "0.5rem 0.75rem" }}
                        >
                          <i className="fas fa-eye me-1"></i>
                          {book.views}
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
                            boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
                          }}
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

export default PublicBooks
