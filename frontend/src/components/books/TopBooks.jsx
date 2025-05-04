import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import BookCard from './BookCard';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';

const TopBooks = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/top`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load top books');
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopBooks();
  }, [user.token]);

  return (
    <Container className="py-4">
      <h2 className="mb-4">📈 Top Books</h2>

      {error && <Alert variant="danger">❌ {error}</Alert>}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading top books...</p>
        </div>
      ) : books.length === 0 ? (
        <Alert variant="info">No popular books yet.</Alert>
      ) : (
        <Row>
          {books.map((book) => (
            <Col key={book._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <BookCard book={book} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default TopBooks;
