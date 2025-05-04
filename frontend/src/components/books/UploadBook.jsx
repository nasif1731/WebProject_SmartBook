import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';

const UploadBook = () => {
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

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      setFormData({ ...formData, pdf: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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

      navigate('/dashboard', { state: { uploadSuccess: true } }); // Trigger refetch in dashboard
    } catch (err) {
      setError(err.message || 'Upload failed');
    }
  };

  return (
    <Container className="py-4">
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
                  <Form.Control name="title" required onChange={handleChange} placeholder="Book Title" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Author</Form.Label>
                  <Form.Control name="author" onChange={handleChange} placeholder="Author Name" />
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
                  <Form.Control name="tags" onChange={handleChange} placeholder="e.g., AI, ML, Data" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Genre</Form.Label>
                  <Form.Control name="genre" onChange={handleChange} placeholder="e.g., Science Fiction" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Cover Image URL (optional)</Form.Label>
                  <Form.Control name="coverImageUrl" onChange={handleChange} placeholder="http://..." />
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
  );
};

export default UploadBook;
