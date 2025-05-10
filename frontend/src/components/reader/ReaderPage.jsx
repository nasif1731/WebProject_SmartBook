import { useEffect, useState, useRef } from 'react';
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
  const [savedProgress, setSavedProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const containerRef = useRef(null);

  // 📥 Load book & saved reading progress
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/${bookId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setBook(data);
      } catch {
        setError('Failed to load book');
      }
    };

    const fetchProgress = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/${bookId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();

        const userEntry = data.readingHistory?.find(
          entry => entry.book === bookId || entry.book?._id === bookId
        );

        if (userEntry?.progress >= 0) {
          setSavedProgress(userEntry.progress);
        }
      } catch (err) {
        console.error('❌ Failed to fetch saved progress:', err.message);
      }
    };

    if (user?.token) {
      fetchBook();
      fetchProgress();
    }
  }, [bookId, user]);

  // ⬇️ Scroll to saved progress
  useEffect(() => {
    const container = containerRef.current;
    if (container && savedProgress > 0) {
      const scrollHeight = container.scrollHeight - container.clientHeight;
      container.scrollTop = (savedProgress / 100) * scrollHeight;
    }
  }, [savedProgress]);

  // 🧠 Track scroll-based progress
  const handleScroll = () => {
    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight - container.clientHeight;
    const percent = Math.round((scrollTop / scrollHeight) * 100);
    setProgress(percent);
  };

  // 💾 Save progress to backend
  const handleProgressSave = async () => {
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
    } catch {
      setError('❌ Failed to save progress');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  // 🗣️ Read aloud current visible content
  const handleReadAloud = () => {
    const container = containerRef.current;
    const text = container?.innerText || '';
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  if (!user?.token) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">
          🔒 Please <a href="/login"><strong>login</strong></a> to read and track progress.
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

        <div
          ref={containerRef}
          onScroll={handleScroll}
          style={{ height: '600px', overflowY: 'scroll', border: '1px solid #ccc' }}
        >
          <embed
            src={`${process.env.REACT_APP_API_BASE_URL}/${book.pdfUrl}`}
            type="application/pdf"
            width="100%"
            height="1200px"
          />
        </div>

        <Row className="align-items-center mt-4">
          <Col xs={12} md={8}>
            <Form.Label><strong>📊 Reading Progress:</strong> {progress}%</Form.Label>
            <progress value={progress} max="100" style={{ width: '100%', height: '20px' }} />
          </Col>
          <Col md="auto">
            <Button onClick={handleProgressSave} disabled={saving} variant="success">
              {saving ? 'Saving...' : '💾 Save Progress'}
            </Button>
          </Col>
        </Row>

        <Button variant="primary" className="mt-3" onClick={handleReadAloud}>
          🔊 Read Aloud
        </Button>

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
