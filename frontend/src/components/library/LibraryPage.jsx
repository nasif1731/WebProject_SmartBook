import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Alert,
  Spinner,
  ListGroup
} from 'react-bootstrap';

const LibraryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBooks = useCallback(async () => {
    setError('');
    setLoading(true);

    try {
      if (!user?.token) throw new Error('User not authenticated.');

      const url = new URL(`${process.env.REACT_APP_API_BASE_URL}/api/books/search`);
      const params = { q: query, genre, sortBy, order: 'desc' };
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      const contentType = res.headers.get('Content-Type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Invalid response format. Expected JSON.');
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unknown error');
      if (!Array.isArray(data)) throw new Error('Server returned invalid data format.');

      setBooks(data);
    } catch (err) {
      console.error('❌ Library fetch error:', err.message);
      setError(`Failed to fetch books: ${err.message}`);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [query, genre, sortBy, user.token]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  return (
    <Container className="py-4">
      <Card className="p-4 shadow bg-light">
        <h2 className="mb-4">📚 Explore Library</h2>
        <Form onSubmit={handleSearch} className="mb-3">
          <Row>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Search title/author"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                type="text"
                placeholder="Genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="createdAt">Newest</option>
                <option value="views">Most Viewed</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button type="submit" variant="primary" className="w-100">🔍 Search</Button>
            </Col>
          </Row>
        </Form>

        {error && <Alert variant="danger">❌ {error}</Alert>}

        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : books.length === 0 ? (
          <p>No books found.</p>
        ) : (
          <ListGroup>
            {books.map((book) => (
              <ListGroup.Item key={book._id} className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{book.title}</strong> by {book.author || 'Unknown'}
                </div>
                <div>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/reader/${book._id}`)}
                  >📖 Read</Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/reviews/${book._id}`)}
                  >⭐ Reviews</Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card>
    </Container>
  );
};

export default LibraryPage;
