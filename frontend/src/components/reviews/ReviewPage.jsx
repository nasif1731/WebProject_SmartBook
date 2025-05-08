import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  ListGroup,
  Badge,
  Image,
} from 'react-bootstrap';

const ReviewPage = () => {
  const { bookId } = useParams();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [error, setError] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/${bookId}/reviews`);
      const data = await res.json();
      setReviews(data || []);
    } catch (err) {
      setError('Failed to load reviews');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!text.trim()) {
      setError('Please enter a review comment.');
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/${bookId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ comment: text, rating }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');

      setText('');
      setRating(5);
      fetchReviews();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Card className="p-4 shadow-sm mb-4">
          <h3 className="mb-3">⭐ Submit a Review</h3>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="comment">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write your review"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="rating">
              <Form.Label>Rating (1–5)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit Review
            </Button>
          </Form>

          {error && <Alert variant="danger" className="mt-3">❌ {error}</Alert>}
        </Card>

        <Card className="p-4 shadow-sm">
          <h4 className="mb-3">📖 All Reviews</h4>
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            <ListGroup>
              {reviews.map((r, idx) => (
                <ListGroup.Item key={idx}>
                  <div className="d-flex align-items-start justify-content-between">
                    <div className="d-flex align-items-start">
                      {r.user?.avatar && (
                        <Image
                          src={r.user.avatar}
                          alt={r.user.fullName}
                          roundedCircle
                          style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '12px' }}
                        />
                      )}
                      <div>
                        <strong>{r.user?.fullName || 'Anonymous'}</strong>
                        <div className="text-muted small mb-1">{r.comment || 'No comment provided'}</div>
                      </div>
                    </div>
                    <Badge bg="warning" text="dark">{r.rating}★</Badge>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default ReviewPage;
