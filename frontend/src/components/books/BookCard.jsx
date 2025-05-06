import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  return (
    <Card className="h-100 shadow-sm" style={{ cursor: 'pointer' }} onClick={() => navigate(`/book/${book._id}`)}>
      <Card.Body>
        <Card.Title>{book.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {book.author || 'Unknown'}
        </Card.Subtitle>
        <Card.Text>
          <strong>Genre:</strong> {book.genre || 'N/A'} <br />
          <strong>Views:</strong> {book.views || 0} <br />
          <strong>Rating:</strong> {book.averageRating?.toFixed(1) || 'N/A'} ⭐
          <span className="text-muted"> ({book.ratingCount || 0} reviews)</span>
        </Card.Text>

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
  );
};

export default BookCard;
