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
          {books.map((book) => {
            const shortSummary =
              book.summary?.length > 120
                ? book.summary.slice(0, 120) + '...'
                : book.summary;

            return (
              <Col key={book._id}>
                <Card className="h-100 shadow-sm" style={{ cursor: 'pointer' }} onClick={() => navigate(`/book/${book._id}`)}>
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      by {book.author || 'Unknown'}
                    </Card.Subtitle>
                    <Card.Text>
                      <strong>Genre:</strong> {book.genre || 'N/A'} <br />
                      <strong>Views:</strong> {book.views || 0} <br />
                      <strong>Reviews:</strong>{' '}
                      <span className="text-muted">{book.ratingCount || 0} reviews</span>
                    </Card.Text>
                    {book.summary && (
                      <Card.Text className="text-muted" style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                        {shortSummary}
                      </Card.Text>
                    )}
                    <div className="d-flex justify-content-between mt-3">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/reader/${book._id}`);
                        }}
                      >
                        📖 Read
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/reviews/${book._id}`);
                        }}
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
    </Container>
  );
};

export default PublicBooks;
