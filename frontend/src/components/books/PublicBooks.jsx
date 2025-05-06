import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';

const PublicBooks = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicBooks = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/public`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load public books');
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicBooks();
  }, []);

  return (
    <Container className="py-4">
      <h2 className="mb-4">🌍 Public Library</h2>

      {error && <Alert variant="danger">❌ {error}</Alert>}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading books...</p>
        </div>
      ) : books.length === 0 ? (
        <Alert variant="info">No public books available yet.</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {books.map((book) => (
            <Col key={book._id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    by {book.author || 'Unknown'}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Genre:</strong> {book.genre || 'N/A'} <br />
                    <strong>Views:</strong> {book.views || 0} <br />
                    <strong>Reviews:</strong> {book.ratingCount || 0}
                  </Card.Text>
                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant="outline-primary"
                      onClick={() => navigate(`/reader/${book._id}`)}
                    >
                      📖 Read
                    </Button>
                    <Button
                      variant="outline-warning"
                      onClick={() => navigate(`/reviews/${book._id}`)}
                    >
                      ⭐ Reviews
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default PublicBooks;
