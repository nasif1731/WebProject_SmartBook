import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';

const EditBook = () => {
  const { user } = useAuth();
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    tags: '',
    genre: '',
    isPublic: false,
    coverImageUrl: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/${bookId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setFormData({
          title: data.title,
          author: data.author,
          description: data.description,
          tags: data.tags?.join(','),
          genre: data.genre || '',
          isPublic: data.isPublic,
          coverImageUrl: data.coverImageUrl || '',
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBook();
  }, [bookId, user.token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/${bookId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Delete failed');
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="py-4">
      <Card className="p-4 shadow">
        <h2 className="mb-4">✏️ Edit Book</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control name="title" value={formData.title} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Control name="author" value={formData.author} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tags (comma-separated)</Form.Label>
            <Form.Control name="tags" value={formData.tags} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Genre</Form.Label>
            <Form.Control name="genre" value={formData.genre} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cover Image URL</Form.Label>
            <Form.Control name="coverImageUrl" value={formData.coverImageUrl} onChange={handleChange} />
          </Form.Group>

          <Form.Check
            className="mb-3"
            type="checkbox"
            label="Public"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
          />

          <div className="d-flex gap-3">
            <Button type="submit" variant="success">Update Book</Button>
            <Button variant="danger" onClick={handleDelete}>🗑️ Delete Book</Button>
          </div>
        </Form>

        {error && <Alert variant="danger" className="mt-3">❌ {error}</Alert>}
      </Card>
    </Container>
  );
};

export default EditBook;
