import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';

const RecentlyRead = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentlyRead = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/recent`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setBooks(data);
      } catch (err) {
        setError(err.message || 'Failed to load recently read books');
      } finally {
        setLoading(false);
      }
    };
    fetchRecentlyRead();
  }, [user.token]);

  return (
    <Container className="py-4">
      <h2 className="mb-4">🕒 Recently Read Books</h2>

      {error && <Alert variant="danger">❌ {error}</Alert>}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading books...</p>
        </div>
      ) : books.length === 0 ? (
        <Alert variant="info">No recently read books found.</Alert>
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
                  <div className="d-flex justify-content-between mt-3">
                    <Button variant="outline-primary" onClick={() => navigate(`/reader/${book._id}`)}>
                      📖 Continue
                    </Button>
                    <Button variant="outline-warning" onClick={() => navigate(`/reviews/${book._id}`)}>
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

export default RecentlyRead;
