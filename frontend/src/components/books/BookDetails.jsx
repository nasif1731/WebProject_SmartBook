import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Container, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';

const BookDetail = () => {
  const { user } = useAuth();
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/${bookId}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setBook(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBook();
  }, [bookId, user?.token]);

  if (error) return <Alert variant="danger" className="mt-4">{error}</Alert>;
  if (!book) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <Container className="py-4">
      <Card className="p-4 shadow">
        <h2 className="mb-3">{book.title}</h2>
        <p><strong>Author:</strong> {book.author || 'Unknown'}</p>
        <p><strong>Description:</strong> {book.description || 'No description provided.'}</p>
        <p><strong>Genre:</strong> {book.genre || 'N/A'}</p>
        <p><strong>Tags:</strong> {book.tags?.map((tag, idx) => (
          <Badge key={idx} bg="secondary" className="me-1">{tag}</Badge>
        ))}</p>
        <div className="mt-4 d-flex gap-3">
          <Button variant="primary" onClick={() => navigate(`/reader/${book._id}`)}>📖 Read</Button>
          <Button variant="warning" onClick={() => navigate(`/reviews/${book._id}`)}>⭐ Reviews</Button>
        </div>
      </Card>
    </Container>
  );
};

export default BookDetail;
