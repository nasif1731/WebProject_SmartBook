import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Container, Button, Alert, Spinner, Card, Form, Row, Col
} from 'react-bootstrap';

const ReaderPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user?.token) return;

    const fetchBook = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/${bookId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setBook(data);
      } catch (err) {
        setError('Failed to load book.');
      }
    };

    const recordInitialReading = async () => {
      try {
        await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/read/${bookId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({ progress: 0 })
        });
      } catch (err) {
        console.error('❌ Failed to record reading:', err.message);
      }
    };

    fetchBook();
    recordInitialReading();
  }, [bookId, user]);

  const handleProgressUpdate = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/read/${bookId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ progress })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess('✅ Progress saved!');
    } catch (err) {
      setError('❌ Failed to save progress');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  // ✅ Safe JSX conditional return (hooks are already called above)
  if (!user || !user.token) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">
          🔒 Please <a href="/login"><strong>login</strong></a> to access the book reader.
          <br />
          <small className="text-muted">
            Reading, progress tracking, and reviews are for logged-in users only.
          </small>
        </Alert>
      </Container>
    );
  }

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!book) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <Container className="py-4" style={{ maxWidth: '900px' }}>
      <Card className="p-3 shadow">
        <h2 className="mb-3">📖 Reading: {book.title}</h2>
        <div style={{ height: '600px', overflow: 'auto' }}>
          <iframe
            src={`${process.env.REACT_APP_API_BASE_URL}/${book.pdfUrl}`}
            width="100%"
            height="100%"
            title="PDF Reader"
            style={{ border: '1px solid #ccc' }}
          />
        </div>

        <Row className="align-items-center mt-4">
          <Col xs={12} md={8}>
            <Form.Label><strong>📊 Your Reading Progress:</strong> {progress}%</Form.Label>
            <Form.Range
              min={0}
              max={100}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
            />
          </Col>
          <Col md="auto">
            <Button onClick={handleProgressUpdate} disabled={saving} variant="success">
              {saving ? 'Saving...' : '💾 Save Progress'}
            </Button>
          </Col>
        </Row>

        {success && <Alert variant="success" className="mt-2">{success}</Alert>}

        <Button
          variant="outline-primary"
          onClick={() => navigate(`/reviews/${book._id}`)}
          className="mt-3"
        >
          ✍️ Write a Review
        </Button>
      </Card>
    </Container>
  );
};

export default ReaderPage;
