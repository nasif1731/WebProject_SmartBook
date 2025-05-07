import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  const shortSummary = book.summary?.length > 120
    ? book.summary.slice(0, 120) + '...'
    : book.summary;

  return (
    <Card className="h-100 shadow-sm border" style={{ cursor: 'pointer' }} onClick={() => navigate(`/book/${book._id}`)}>
      <Card.Body>
        <Card.Title>{book.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {book.author || 'Unknown'}
        </Card.Subtitle>

        <Card.Text>
  <strong>Genre:</strong> {book.genre || 'N/A'} <br />
  <strong>Views:</strong> {book.views || 0} <br />
  <strong>Reviews:</strong> <span className="text-muted">{book.ratingCount || 0} reviews</span>
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
  );
};

export default BookCard;
