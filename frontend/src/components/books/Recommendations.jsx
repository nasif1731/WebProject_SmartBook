import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import BookCard from './BookCard';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';

const Recommendations = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/book-search/recommendations`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load recommendations');
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [user.token]);

  return (
    <Container className="py-4">
      <h2 className="mb-4">💡 Recommended for You</h2>

      {error && <Alert variant="danger">❌ {error}</Alert>}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading recommendations...</p>
        </div>
      ) : books.length === 0 ? (
        <Alert variant="info">
          No recommendations available yet. Read more books to get personalized suggestions!
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {books.map((book) => (
            <Col key={book._id}>
              <BookCard book={book} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Recommendations;
