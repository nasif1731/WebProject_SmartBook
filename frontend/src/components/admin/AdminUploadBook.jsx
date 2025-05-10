import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { BsBook, BsBarChartFill, BsPeople, BsBookFill, BsPersonCircle } from 'react-icons/bs';

const AdminUploadBook = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    tags: '',
    genre: '',
    isPublic: false,
    coverImageUrl: '',
    pdf: null,
  });

  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('books'); // Define activeTab state

  // Validate file size and type
  const validateFile = (file) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError("File size exceeds the 10MB limit.");
      return false;
    }

    if (file.type !== 'application/pdf') {
      setError("Only PDF files are allowed.");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      const file = files[0];
      if (file && !validateFile(file)) return; // Validate file
      setFormData({ ...formData, pdf: file });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.pdf) {
      setError("Please select a file to upload.");
      return;
    }

    const body = new FormData();
    for (const key in formData) {
      if (key === 'pdf') body.append('pdf', formData.pdf);
      else body.append(key, formData[key]);
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Reset form after successful upload
      setFormData({
        title: '',
        author: '',
        description: '',
        tags: '',
        genre: '',
        isPublic: false,
        coverImageUrl: '',
        pdf: null,
      });

      navigate('/admin/library', { state: { uploadSuccess: true } }); // Trigger refetch in dashboard
    } catch (err) {
      setError(err.message || 'Upload failed');
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white" style={{ width: "250px", minHeight: "100vh" }}>
        <div className="p-3 border-bottom border-secondary">
          <h4 className="mb-0 d-flex align-items-center">
            <BsBook className="me-2" /> SmartBook Admin
          </h4>
        </div>

        <div className="p-3">
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <button className="nav-link btn text-white" onClick={() => navigate("/admin/profile")}>
                <BsPersonCircle className="me-2" /> Profile
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`nav-link btn ${activeTab === "dashboard" ? "text-primary" : "text-white"}`}
                onClick={() => setActiveTab("dashboard")}
              >
                <BsBarChartFill className="me-2" /> Dashboard
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`nav-link btn ${activeTab === "users" ? "text-primary" : "text-white"}`}
                onClick={() => navigate("/admin/users")}
              >
                <BsPeople className="me-2" /> Users
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`nav-link btn ${activeTab === "books" ? "text-primary" : "text-white"}`}
                onClick={() => navigate("/admin/library")}
              >
                <BsBookFill className="me-2" /> Books
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main content */}
      <Container className="py-4" style={{ marginLeft: "250px" }}>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Header>
                <h4>📤 Upload New Book</h4>
              </Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                  <Form.Group className="mb-3">
                    <Form.Label>Title *</Form.Label>
                    <Form.Control
                      name="title"
                      required
                      onChange={handleChange}
                      placeholder="Book Title"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Author</Form.Label>
                    <Form.Control
                      name="author"
                      onChange={handleChange}
                      placeholder="Author Name"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      onChange={handleChange}
                      placeholder="Write a short summary or description"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Tags (comma-separated)</Form.Label>
                    <Form.Control
                      name="tags"
                      onChange={handleChange}
                      placeholder="e.g., AI, ML, Data"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Genre</Form.Label>
                    <Form.Control
                      name="genre"
                      onChange={handleChange}
                      placeholder="e.g., Science Fiction"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Cover Image URL (optional)</Form.Label>
                    <Form.Control
                      name="coverImageUrl"
                      onChange={handleChange}
                      placeholder="http://..."
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Make Public"
                      name="isPublic"
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>PDF File *</Form.Label>
                    <Form.Control
                      type="file"
                      name="pdf"
                      accept="application/pdf"
                      required
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary">
                    Upload Book
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminUploadBook;
