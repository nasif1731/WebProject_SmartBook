import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  Spinner,
  Alert,
  ListGroup,
} from 'react-bootstrap';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [uploads, setUploads] = useState([]);
  const [readList, setReadList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/${bookId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) throw new Error('Failed to delete book');
      setUploads((prev) => prev.filter((b) => b._id !== bookId));
    } catch (err) {
      alert('Delete failed. Please try again.');
    }
  };

  const filteredUploads = uploads.filter((book) =>
    book.title?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const [uploadsRes, readListRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/my`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/dashboard`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);

        const uploadsData = await uploadsRes.json();
        const dashboardData = await readListRes.json();

        if (!uploadsRes.ok) throw new Error(uploadsData.message || 'Failed to load uploads');
        if (!readListRes.ok) throw new Error(dashboardData.message || 'Failed to load dashboard');

        setUploads(uploadsData);
        setReadList(dashboardData.readList || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user.token]);

  return (
    <div style={{ background: 'linear-gradient(to bottom right, #e3f2fd, #bbdefb)', minHeight: '100vh' }}>
      <Container className="py-4">
        <Row className="mb-4 align-items-center">
          <Col>
            <h2>📊 SmartBook Dashboard</h2>
          </Col>
        </Row>

        {error && <Alert variant="danger">{error}</Alert>}

        <Card className="mb-4 shadow">
          <Card.Header>
            <Row className="align-items-center">
              <Col><h5>📚 My Library</h5></Col>
              <Col md="auto">
                <Form.Control
                  type="text"
                  placeholder="Search my books..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Col>
              <Col md="auto">
                <Button onClick={() => navigate('/upload')} variant="primary">
                  + Upload New Book
                </Button>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p>Loading your library...</p>
              </div>
            ) : filteredUploads.length === 0 ? (
              <p>No books uploaded yet.</p>
            ) : (
              <ListGroup>
                {filteredUploads.map((book) => (
                  <ListGroup.Item key={book._id}>
                    <Row className="align-items-center">
                      <Col><strong>{book.title}</strong></Col>
                      <Col md="auto">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/reader/${book._id}`)}
                        >
                          📖 Read
                        </Button>{' '}
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => navigate(`/edit/${book._id}`)}
                        >
                          ✏️ Edit
                        </Button>{' '}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(book._id)}
                        >
                          🗑️ Delete
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>

        <Card className="shadow">
          <Card.Header>
            <h5>📌 Read List</h5>
          </Card.Header>
          <Card.Body>
            {readList.length === 0 ? (
              <p>No books in your read list yet.</p>
            ) : (
              <ListGroup>
                {readList.map((book) => (
                  <ListGroup.Item key={book._id}>
                    <Row className="align-items-center">
                      <Col><strong>{book.title}</strong></Col>
                      <Col md="auto">
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => navigate(`/reader/${book._id}`)}
                        >
                          📖 Continue Reading
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default UserDashboard;
