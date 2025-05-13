"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Button, Card, Badge, Spinner } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { BsStar, BsStarFill, BsBook, BsPerson, BsEye, BsBookmark } from "react-icons/bs"

const HomePage = () => {
  const [topBooks, setTopBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/top`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Failed to load top books")
        setTopBooks(data.slice(0, 4))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTopBooks()
  }, [])

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<BsStarFill key={i} className="text-warning" />)
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<BsStarFill key={i} className="text-warning" style={{ opacity: 0.5 }} />)
      } else {
        stars.push(<BsStar key={i} className="text-warning" />)
      }
    }

    return stars
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section
        className="hero-section position-relative d-flex align-items-center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, rgba(33, 37, 41, 0.95), rgba(33, 37, 41, 0.7))",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: 'url("/img.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: "0.2",
            zIndex: -1,
          }}
        ></div>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="text-white mb-5 mb-lg-0">
              <h1
                className="display-4 fw-bold mb-3 animate__animated animate__fadeInUp"
                style={{
                  textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                  backgroundImage: "linear-gradient(45deg, #fff, #2ab8a6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Your World of Books Awaits
              </h1>
              <p className="lead mb-4 animate__animated animate__fadeInUp animate__delay-1s">
                Discover, read, and review books in a smart, interactive environment. Upload your own books, generate AI
                summaries, and join a community of passionate readers.
              </p>
              <div className="d-flex flex-wrap gap-3 animate__animated animate__fadeInUp animate__delay-2s">
                <Button
                  as={Link}
                  to="/library"
                  size="lg"
                  className="fw-bold px-4 rounded-pill"
                  style={{
                    background: "linear-gradient(45deg, #2ab8a6, #4bc8bc)",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(42, 184, 166, 0.4)",
                  }}
                >
                  Explore Library
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  size="lg"
                  variant="outline-light"
                  className="fw-bold px-4 rounded-pill"
                >
                  Join Now
                </Button>
              </div>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <div className="position-relative animate__animated animate__fadeInRight animate__delay-1s">
                <img
                  src="/img.jpg"
                  alt="SmartBook Library"
                  className="img-fluid rounded-3 shadow-lg"
                  style={{
                    maxWidth: "90%",
                    transform: "perspective(1000px) rotateY(-10deg) rotateX(5deg)",
                    boxShadow: "25px 25px 50px rgba(0, 0, 0, 0.3)",
                    border: "5px solid rgba(255,255,255,0.1)",
                  }}
                />
                <div
                  className="position-absolute"
                  style={{
                    bottom: "-30px",
                    right: "0",
                    background: "linear-gradient(45deg, #2ab8a6, #4bc8bc)",
                    color: "white",
                    padding: "15px 25px",
                    borderRadius: "10px",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                    transform: "rotate(5deg)",
                  }}
                >
                  <div className="fs-1 fw-bold">500+</div>
                  <div>Books Available</div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
        <Container>
          <h2 className="text-center mb-5 display-5 fw-bold" style={{ color: "#2a3f58" }}>
            Features You'll Love
          </h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm hover-card">
                <Card.Body className="text-center p-4">
                  <div className="icon-box mb-4">
                    <div
                      className="icon-container mx-auto d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: "80px",
                        height: "80px",
                        background: "linear-gradient(45deg, #2ab8a6, #4bc8bc)",
                        color: "white",
                        fontSize: "2rem",
                      }}
                    >
                      <BsBook />
                    </div>
                  </div>
                  <Card.Title className="fs-4 fw-bold mb-3">Personal Library</Card.Title>
                  <Card.Text className="text-muted">
                    Create your own personal collection of books, track your reading progress, and never lose your
                    place.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm hover-card">
                <Card.Body className="text-center p-4">
                  <div className="icon-box mb-4">
                    <div
                      className="icon-container mx-auto d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: "80px",
                        height: "80px",
                        background: "linear-gradient(45deg, #2ab8a6, #4bc8bc)",
                        color: "white",
                        fontSize: "2rem",
                      }}
                    >
                      <BsPerson />
                    </div>
                  </div>
                  <Card.Title className="fs-4 fw-bold mb-3">Personalized Recommendations</Card.Title>
                  <Card.Text className="text-muted">
                    Get book recommendations based on your reading history, preferences, and top-rated books.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm hover-card">
                <Card.Body className="text-center p-4">
                  <div className="icon-box mb-4">
                    <div
                      className="icon-container mx-auto d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: "80px",
                        height: "80px",
                        background: "linear-gradient(45deg, #2ab8a6, #4bc8bc)",
                        color: "white",
                        fontSize: "2rem",
                      }}
                    >
                      <BsEye />
                    </div>
                  </div>
                  <Card.Title className="fs-4 fw-bold mb-3">Smart Reading Analytics</Card.Title>
                  <Card.Text className="text-muted">
                    Track your reading habits with detailed analytics, reading speed, and progress over time.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Top Books Section */}
      <section className="py-5" style={{ background: "#fff" }}>
        <Container>
          <h2 className="text-center mb-5 display-5 fw-bold" style={{ color: "#2a3f58" }}>
            <span className="me-2">📚</span> Top Books
            <div className="d-block mt-2 text-center">
              <span
                className="d-inline-block"
                style={{
                  height: "6px",
                  width: "80px",
                  background: "linear-gradient(90deg, #2ab8a6, #4bc8bc)",
                  borderRadius: "3px",
                }}
              ></span>
            </div>
          </h2>

          {error && (
            <div className="alert alert-danger p-3 rounded-3 shadow-sm">
              <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
              <p className="mt-3 text-muted">Loading top books...</p>
            </div>
          ) : (
            <Row className="g-4">
              {topBooks.map((book, index) => {
                const shortSummary =
                  book.summary?.length > 120
                    ? book.summary.slice(0, 120) + "..."
                    : book.summary || "No summary available"

                return (
                  <Col key={book._id} md={6} lg={3} className="mb-4">
                    <Card
                      className="h-100 border-0 shadow-sm book-card-hover"
                      style={{
                        transition: "all 0.3s ease",
                        borderRadius: "12px",
                        overflow: "hidden",
                      }}
                    >
                      <div className="position-relative">
                        <Card.Img
                          variant="top"
                          src={book.coverImageUrl || "/placeholder.svg?height=200&width=300"}
                          alt={book.title}
                          className="book-cover"
                          style={{
                            height: "220px",
                            objectFit: "cover",
                            transition: "transform 0.5s ease",
                          }}
                        />
                        <div className="position-absolute top-0 end-0 p-2">
                          <Badge
                            bg="warning"
                            text="dark"
                            className="fw-bold px-2 py-1 shadow-sm"
                            style={{ opacity: 0.9 }}
                          >
                            {index < 3 ? `#${index + 1} Top` : "Top 10"}
                          </Badge>
                        </div>
                        <div
                          className="position-absolute bottom-0 start-0 w-100 p-2"
                          style={{
                            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <Badge bg="secondary" className="me-1">
                            {book.genre || "Uncategorized"}
                          </Badge>
                          <small className="text-white ms-2">
                            <BsEye className="me-1" /> {book.views || 0}
                          </small>
                        </div>
                      </div>
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="fw-bold text-truncate">{book.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          <BsPerson className="me-1" /> {book.author || "Unknown"}
                        </Card.Subtitle>

                        <div className="mb-2 d-flex align-items-center">
                          <div className="me-2">{renderStars(book.averageRating || 0)}</div>
                          <small className="text-muted">({book.ratingCount || 0})</small>
                        </div>

                        <Card.Text className="text-muted small fst-italic mb-3 flex-grow-1">{shortSummary}</Card.Text>

                        <div className="mt-auto d-flex justify-content-between">
                          <Button
                            variant="primary"
                            size="sm"
                            className="rounded-pill px-3"
                            style={{
                              background: "linear-gradient(45deg, #2ab8a6, #4bc8bc)",
                              border: "none",
                            }}
                            onClick={() => navigate(`/reader/${book._id}`)}
                          >
                            <BsBook className="me-1" /> Read
                          </Button>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            className="rounded-pill px-3"
                            onClick={() => navigate(`/reviews/${book._id}`)}
                          >
                            <BsStarFill className="me-1" /> Reviews
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                )
              })}
            </Row>
          )}

          <div className="text-center mt-5">
            <Button
              as={Link}
              to="/library"
              variant="outline-primary"
              className="rounded-pill px-4 py-2 fw-bold"
              style={{ borderWidth: "2px" }}
            >
              <BsBookmark className="me-2" /> View All Books
            </Button>
          </div>
        </Container>
      </section>

      {/* CSS for the components */}
      <style jsx>{`
        .book-card-hover:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }
        .book-card-hover:hover .book-cover {
          transform: scale(1.05);
        }
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  )
}

export default HomePage
