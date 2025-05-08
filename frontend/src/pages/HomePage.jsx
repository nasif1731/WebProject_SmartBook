import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Badge, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { BsStar, BsStarFill } from "react-icons/bs";

const HomePage = () => {
  const [topBooks, setTopBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/top`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load top books");
        setTopBooks(data.slice(0, 4));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopBooks();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<BsStarFill key={i} className="text-warning" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<BsStarFill key={i} className="text-warning" style={{ opacity: 0.5 }} />);
      } else {
        stars.push(<BsStar key={i} className="text-warning" />);
      }
    }

    return stars;
  };

  return (
    <div className="app-container">
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-3">Welcome to SmartBook</h1>
              <p className="lead mb-4">
                Discover, read, and review books in a smart, interactive environment. 
                Upload your own books, generate AI summaries, and join a community of readers.
              </p>
              <Button 
                as={Link} 
                to="/library" 
                size="lg" 
                variant="light" 
                className="fw-bold px-4 shadow-sm"
              >
                Explore Library
              </Button>
            </Col>
            <Col lg={6}>
              <img 
                src="/placeholder.svg?height=400&width=600" 
                alt="SmartBook Library" 
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Top Books Section */}
      <Container className="py-5">
        <h2 className="mb-4 text-center">📚 Top Books</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading top books...</p>
          </div>
        ) : (
          <Row>
            {topBooks.map((book) => {
              const shortSummary = book.summary?.length > 120 
                ? book.summary.slice(0, 120) + "..." 
                : book.summary || "No summary available";
                
              return (
                <Col key={book._id} md={6} lg={3} className="mb-4">
                  <Card className="book-card h-100 shadow-sm">
                    <Card.Img 
                      variant="top" 
                      src={book.coverImageUrl || "/placeholder.svg?height=200&width=300"} 
                      alt={book.title}
                      className="book-cover"
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{book.title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">by {book.author || "Unknown"}</Card.Subtitle>
                      
                      <div className="mb-2">
                        <Badge bg="secondary" className="me-1">{book.genre || "Uncategorized"}</Badge>
                        <small className="text-muted ms-2">{book.views || 0} views</small>
                      </div>
                      
                      <div className="mb-2">
                        {renderStars(book.averageRating || 0)}
                        <small className="text-muted ms-2">({book.ratingCount || 0} reviews)</small>
                      </div>
                      
                      <Card.Text className="text-muted small fst-italic mb-3">
                        {shortSummary}
                      </Card.Text>
                      
                      <div className="mt-auto d-flex justify-content-between">
                        <Button 
                          variant="primary" 
                          size="sm" 
                          onClick={() => navigate(`/reader/${book._id}`)}
                        >
                          📖 Read
                        </Button>
                        <Button 
                          variant="warning" 
                          size="sm" 
                          onClick={() => navigate(`/reviews/${book._id}`)}
                        >
                          ⭐ Reviews
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
        
        <div className="text-center mt-4">
          <Button as={Link} to="/library" variant="outline-primary">
            View All Books
          </Button>
        </div>
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-auto">
        <Container>
          <Row>
            <Col md={4} className="mb-3 mb-md-0">
              <h5>SmartBook</h5>
              <p className="text-muted">
                Your smart reading companion for discovering, reading, and reviewing books.
              </p>
            </Col>
            <Col md={4} className="mb-3 mb-md-0">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li><Link to="/about" className="text-decoration-none text-white-50">About</Link></li>
                <li><Link to="/privacy" className="text-decoration-none text-white-50">Privacy Policy</Link></li>
                <li><Link to="/contact" className="text-decoration-none text-white-50">Contact Us</Link></li>
              </ul>
            </Col>
            <Col md={4}>
              <h5>Connect With Us</h5>
              <div className="d-flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
<a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
<a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
 </div>
            </Col>
          </Row>
          
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;
