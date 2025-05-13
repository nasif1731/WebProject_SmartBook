"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Container, Form, Button, Card, Row, Col, Alert, Spinner, ListGroup, Badge, InputGroup } from "react-bootstrap"

const TAGS = ["Popular", "Recommended"]
const SORT_OPTIONS = [
  { value: "createdAt", label: "📅 Newest" },
  { value: "views", label: "👁️ Most Viewed" },
]

const LibraryPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [books, setBooks] = useState([])
  const [query, setQuery] = useState("")
  const [genre, setGenre] = useState("")
  const [tags, setTags] = useState([])
  const [sortBy, setSortBy] = useState("createdAt")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchBooks = useCallback(async () => {
    setError("")
    setLoading(true)

    try {
      const url = new URL(`${process.env.REACT_APP_API_BASE_URL}/api/book-search/search`)
      const params = {
        q: query,
        genre,
        tags: tags.length ? tags.join(",") : undefined,
        sortBy,
        order: "desc",
      }

      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value)
      })

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${user.token}` },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Unknown error")
      setBooks(data)
    } catch (err) {
      setError(`Failed to fetch books: ${err.message}`)
      setBooks([])
    } finally {
      setLoading(false)
    }
  }, [query, genre, tags, sortBy, user])

  useEffect(() => {
    if (user?.token) fetchBooks()
  }, [fetchBooks, user])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchBooks()
  }

  const toggleTag = (tag) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setQuery("")
    setGenre("")
    setTags([])
    setSortBy("createdAt")
  }

  // Background gradient style
  const backgroundStyle = {
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    minHeight: "100vh",
    paddingTop: "2rem",
    paddingBottom: "3rem",
  }

  if (!user || !user.token) {
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
                <i className="fas fa-sign-in-alt me-2"></i>
                Login
              </Button>
              <Button variant="outline-primary" href="/register" style={{ borderRadius: "10px" }}>
                <i className="fas fa-user-plus me-2"></i>
                Register
              </Button>
            </div>
          </Card>
        </Container>
      </div>
    )
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
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h2 className="mb-0 d-flex align-items-center">
                  <span
                    className="me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      boxShadow: "0 4px 10px rgba(102, 126, 234, 0.3)",
                    }}
                  >
                    <i className="fas fa-book-open text-white" style={{ fontSize: "1.5rem" }}></i>
                  </span>
                  <span>Explore SmartBook Library</span>
                </h2>
                <p className="text-muted mb-0 mt-1">Discover and read books from our extensive collection</p>
              </div>
              <div
                className="d-none d-md-flex align-items-center justify-content-center"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "30px",
                  background: "rgba(102, 126, 234, 0.1)",
                }}
              >
                <span style={{ fontSize: "2rem" }}>📚</span>
              </div>
            </div>

            <Form onSubmit={handleSearch}>
              <Row className="g-3">
                <Col md={4}>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <i className="fas fa-search text-muted"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search title, author"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="border-start-0 ps-0"
                      style={{ borderRadius: "0 0.375rem 0.375rem 0" }}
                    />
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <i className="fas fa-tag text-muted"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Genre"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="border-start-0 ps-0"
                      style={{ borderRadius: "0 0.375rem 0.375rem 0" }}
                    />
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ borderRadius: "0.375rem", height: "100%" }}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100 h-100"
                    style={{
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                      boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    <i className="fas fa-search me-2"></i>
                    Search
                  </Button>
                </Col>
              </Row>
            </Form>

            <div className="mt-4">
              <div className="d-flex align-items-center flex-wrap">
                <span className="me-2 fw-semibold">Tags:</span>
                {TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    bg={tags.includes(tag) ? "primary" : "secondary"}
                    className="me-2 mb-2 py-2 px-3"
                    style={{
                      cursor: "pointer",
                      borderRadius: "20px",
                      background: tags.includes(tag)
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        : "linear-gradient(135deg, #8e9eab 0%, #eef2f3 100%)",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="ms-2 mb-2"
                  onClick={clearFilters}
                  style={{ borderRadius: "20px" }}
                >
                  <i className="fas fa-undo me-1"></i>
                  Clear
                </Button>
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
        <Card className="border-0 shadow-sm" style={{ borderRadius: "15px", overflow: "hidden" }}>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
                <p className="mt-3 text-muted">Searching for books...</p>
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-5">
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📚</div>
                <h4>No books found</h4>
                <p className="text-muted">Try adjusting filters or search terms.</p>
                <Button
                  variant="outline-primary"
                  onClick={clearFilters}
                  className="mt-2"
                  style={{ borderRadius: "10px" }}
                >
                  <i className="fas fa-undo me-2"></i>
                  Reset Filters
                </Button>
              </div>
            ) : (
              <ListGroup variant="flush">
                {books.map((book, index) => (
                  <ListGroup.Item
                    key={book._id}
                    className={index % 2 === 0 ? "bg-light bg-opacity-50" : ""}
                    style={{
                      borderLeft: "none",
                      borderRight: "none",
                      padding: "1rem 1.5rem",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(102, 126, 234, 0.05)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? "rgba(0, 0, 0, 0.03)" : ""
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                      <div className="mb-2 mb-md-0">
                        <div className="d-flex align-items-center">
                          {book.coverImageUrl ? (
                            <img
                              src={
                                book.coverImageUrl?.startsWith("http")
                                  ? book.coverImageUrl
                                  : `${process.env.REACT_APP_API_BASE_URL}${book.coverImageUrl}`
                              }
                              alt="Book Cover"
                              style={{
                                width: "50px",
                                height: "70px",
                                objectFit: "cover",
                                marginRight: "15px",
                                borderRadius: "5px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              }}
                            />
                          ) : (
                            <div
                              className="d-flex align-items-center justify-content-center bg-light"
                              style={{
                                width: "50px",
                                height: "70px",
                                marginRight: "15px",
                                borderRadius: "5px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                              }}
                            >
                              <i className="fas fa-book text-muted"></i>
                            </div>
                          )}
                          <div>
                            <h6 className="mb-0 fw-bold">{book.title}</h6>
                            <p className="text-muted mb-1 small">by {book.author || "Unknown"}</p>
                            <div>
                              {book.genre && (
                                <Badge bg="info" className="me-2" style={{ borderRadius: "20px" }}>
                                  {book.genre}
                                </Badge>
                              )}
                              {book.tags?.map((tag) => (
                                <Badge
                                  key={tag}
                                  bg="secondary"
                                  className="me-2"
                                  style={{ borderRadius: "20px", backgroundColor: "#6c757d" }}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Button
                          variant="primary"
                          size="sm"
                          className="me-2"
                          onClick={() => navigate(`/reader/${book._id}`)}
                          style={{
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            border: "none",
                            boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
                          }}
                        >
                          <i className="fas fa-book-open me-1"></i> Read
                        </Button>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => navigate(`/reviews/${book._id}`)}
                          style={{ borderRadius: "10px" }}
                        >
                          <i className="fas fa-star me-1"></i> Reviews
                        </Button>
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
  )
}

export default LibraryPage
