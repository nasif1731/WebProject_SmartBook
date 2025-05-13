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
  Badge,
  InputGroup,
} from 'react-bootstrap';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [uploads, setUploads] = useState([]);
  const [readList, setReadList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ totalBooks: 0, totalPages: 0, readingTime: 0 });

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
        
        // Calculate stats
        setStats({
          totalBooks: uploadsData.length,
          totalPages: uploadsData.reduce((sum, book) => sum + (book.pageCount || 0), 0),
          readingTime: Math.round(uploadsData.reduce((sum, book) => sum + (book.pageCount || 0), 0) / 30), // Assuming 30 pages per hour
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user.token]);

  // Background gradient style
  const backgroundStyle = {
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    minHeight: '100vh',
    paddingTop: '2rem',
    paddingBottom: '2rem',
  };

  return (
    <div style={backgroundStyle}>
      <Container>
        {/* Header Section */}
        <Card className="border-0 shadow-sm mb-4 bg-white bg-opacity-90" 
              style={{borderRadius: '15px', backdropFilter: 'blur(10px)'}}>
          <Card.Body>
            <Row className="align-items-center">
              <Col md={7}>
                <h2 className="mb-0 d-flex align-items-center">
                  <span className="me-2" style={{fontSize: '2rem'}}>📚</span>
                  <span>Welcome, {user.fullName || 'Reader'}</span>
                </h2>
                <p className="text-muted mb-0">Manage your books and reading list</p>
              </Col>
              <Col md={5}>
                <Row className="text-center g-2">
                  <Col xs={4}>
                    <div className="p-3 rounded" style={{background: 'rgba(13, 110, 253, 0.1)'}}>
                      <h3 className="mb-1">{stats.totalBooks}</h3>
                      <small className="text-muted">Books</small>
                    </div>
                  </Col>
                 
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {error && (
          <Alert variant="danger" className="d-flex align-items-center shadow-sm" 
                 style={{borderRadius: '10px'}}>
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </Alert>
        )}

        {/* My Library Section */}
        <Card className="mb-4 shadow-sm border-0" style={{borderRadius: '15px'}}>
          <Card.Header className="bg-white py-3" style={{borderRadius: '15px 15px 0 0', borderBottom: '1px solid rgba(0,0,0,0.05)'}}>
            <Row className="align-items-center">
              <Col>
                <h5 className="mb-0 d-flex align-items-center">
                  <i className="fas fa-book me-2 text-primary"></i>
                  My Library
                </h5>
              </Col>
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text className="bg-light border-end-0">
                    <i className="fas fa-search text-muted"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search my books..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-start-0 ps-0"
                    style={{borderRadius: '0 0.375rem 0.375rem 0'}}
                  />
                </InputGroup>
              </Col>
              <Col md="auto">
                <Button 
                  onClick={() => navigate('/upload')} 
                  variant="primary"
                  className="d-flex align-items-center"
                  style={{
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                    border: 'none',
                    boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <i className="fas fa-plus-circle me-2"></i>
                  Upload New Book
                </Button>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading your library...</p>
              </div>
            ) : filteredUploads.length === 0 ? (
              <div className="text-center py-5">
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📖</div>
                <p className="text-muted">No books uploaded yet.</p>
                <Button 
                  variant="outline-primary" 
                  onClick={() => navigate('/upload')}
                  className="mt-2"
                >
                  Upload your first book
                </Button>
              </div>
            ) : (
              <ListGroup variant="flush">
                {filteredUploads.map((book, index) => (
                  <ListGroup.Item 
                    key={book._id}
                    className={index % 2 === 0 ? 'bg-light bg-opacity-50' : ''}
                    style={{borderLeft: 'none', borderRight: 'none', padding: '1rem 1.5rem'}}
                  >
                    <Row className="align-items-center">
                      <Col xs={12} md={6}>
                        <div className="d-flex align-items-center">
                          <div 
                            className="me-3 d-flex align-items-center justify-content-center"
                            style={{
                              width: '45px',
                              height: '45px',
                              borderRadius: '10px',
                              background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                              color: 'white',
                            }}
                          >
                            <i className="fas fa-book"></i>
                          </div>
                          <div>
                            <h6 className="mb-0 fw-bold">{book.title}</h6>
                            <small className="text-muted">
                              {book.pageCount ? `${book.pageCount} pages` : 'Unknown length'} • 
                              Added {new Date(book.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} md={6} className="text-md-end mt-3 mt-md-0">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/reader/${book._id}`)}
                          className="me-2 mb-2 mb-md-0"
                          style={{
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                            border: 'none',
                          }}
                        >
                          <i className="fas fa-book-open me-1"></i> Read
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => navigate(`/edit/${book._id}`)}
                          className="me-2 mb-2 mb-md-0"
                          style={{borderRadius: '8px'}}
                        >
                          <i className="fas fa-edit me-1"></i> Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(book._id)}
                          className="mb-2 mb-md-0"
                          style={{borderRadius: '8px'}}
                        >
                          <i className="fas fa-trash-alt me-1"></i> Delete
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>

        {/* Read List Section */}
        <Card className="shadow-sm border-0" style={{borderRadius: '15px'}}>
          <Card.Header className="bg-white py-3" style={{borderRadius: '15px 15px 0 0', borderBottom: '1px solid rgba(0,0,0,0.05)'}}>
            <h5 className="mb-0 d-flex align-items-center">
              <i className="fas fa-bookmark me-2 text-success"></i>
              Read List
            </h5>
          </Card.Header>
          <Card.Body className="p-0">
            {readList.length === 0 ? (
              <div className="text-center py-5">
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🔖</div>
                <p className="text-muted">No books in your read list yet.</p>
                <Button 
                  variant="outline-success" 
                  onClick={() => navigate('/browse')}
                  className="mt-2"
                >
                  Browse books
                </Button>
              </div>
            ) : (
              <ListGroup variant="flush">
                {readList.map((book, index) => (
                  <ListGroup.Item 
                    key={book._id}
                    className={index % 2 === 0 ? 'bg-light bg-opacity-50' : ''}
                    style={{borderLeft: 'none', borderRight: 'none', padding: '1rem 1.5rem'}}
                  >
                    <Row className="align-items-center">
                      <Col xs={12} md={7}>
                        <div className="d-flex align-items-center">
                          <div 
                            className="me-3 d-flex align-items-center justify-content-center"
                            style={{
                              width: '45px',
                              height: '45px',
                              borderRadius: '10px',
                              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                              color: 'white',
                            }}
                          >
                            <i className="fas fa-bookmark"></i>
                          </div>
                          <div>
                            <h6 className="mb-0 fw-bold">{book.title}</h6>
                            <div>
                              <Badge bg="success" className="me-2" style={{fontWeight: 'normal'}}>
                                {book.progress ? `${Math.round(book.progress * 100)}% complete` : 'Not started'}
                              </Badge>
                              <small className="text-muted">
                                Last read: {book.lastRead ? new Date(book.lastRead).toLocaleDateString() : 'Never'}
                              </small>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} md={5} className="text-md-end mt-3 mt-md-0">
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => navigate(`/reader/${book._id}`)}
                          style={{
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                            border: 'none',
                            color: 'white',
                          }}
                        >
                          <i className="fas fa-book-open me-1"></i> Continue Reading
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

export default Dashboard;
