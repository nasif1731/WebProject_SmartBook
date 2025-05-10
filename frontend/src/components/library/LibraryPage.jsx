// --- ✅ LibraryPage.jsx (with login protection) ---

"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Alert,
  Spinner,
  ListGroup,
  Badge,
} from "react-bootstrap";

const TAGS = ["Popular", "Recommended"];
const SORT_OPTIONS = [
  { value: "createdAt", label: "📅 Newest" },
  { value: "views", label: "👁️ Most Viewed" },
];

const LibraryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [tags, setTags] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBooks = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const url = new URL(`${process.env.REACT_APP_API_BASE_URL}/api/book-search/search`);
      const params = {
        q: query,
        genre,
        tags: tags.length ? tags.join(",") : undefined,
        sortBy,
        order: "desc",
      };

      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unknown error");
      setBooks(data);
    } catch (err) {
      setError(`Failed to fetch books: ${err.message}`);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [query, genre, tags, sortBy, user]);

  useEffect(() => {
    if (user?.token) fetchBooks();
  }, [fetchBooks, user]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setQuery("");
    setGenre("");
    setTags([]);
    setSortBy("createdAt");
  };

  if (!user || !user.token) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">
          🔒 Please <a href="/login"><strong>login</strong></a> to access the SmartBook Library.<br />
          <small className="text-muted">
            Features like <strong>Library, Read, Upload, Analytics, Recently Read</strong> are only available to logged-in users.
          </small>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="p-4 shadow bg-light border-0">
        <h2 className="mb-4">📚 Explore SmartBook Library</h2>

        <Form onSubmit={handleSearch} className="mb-4">
          <Row className="gy-2">
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Search title, author"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                type="text"
                placeholder="Genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button type="submit" variant="primary" className="w-100">🔍 Search</Button>
            </Col>
          </Row>
        </Form>

        <div className="mb-3">
          <strong className="me-2">Tags:</strong>
          {TAGS.map((tag) => (
            <Badge
              key={tag}
              bg={tags.includes(tag) ? "primary" : "secondary"}
              className="me-2 py-2 px-3"
              style={{ cursor: "pointer" }}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
          <Button variant="outline-secondary" size="sm" className="ms-2" onClick={clearFilters}>Clear</Button>
        </div>

        {error && <Alert variant="danger">❌ {error}</Alert>}

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : books.length === 0 ? (
          <p className="text-muted">No books found. Try adjusting filters or search terms.</p>
        ) : (
          <ListGroup>
            {books.map((book) => (
              <ListGroup.Item key={book._id} className="d-flex justify-content-between align-items-center flex-wrap">
                <div className="mb-2 mb-md-0">
                  <strong>{book.title}</strong>{" "}
                  <span className="text-muted">by {book.author || "Unknown"}</span>
                  {book.genre && <Badge bg="info" className="ms-2">{book.genre}</Badge>}
                  {book.tags?.map((tag) => (
                    <Badge key={tag} bg="secondary" className="ms-2">{tag}</Badge>
                  ))}
                </div>
                <div>
                  <Button variant="outline-primary" size="sm" className="me-2" onClick={() => navigate(`/reader/${book._id}`)}>📖 Read</Button>
                  <Button variant="outline-dark" size="sm" onClick={() => navigate(`/reviews/${book._id}`)}>⭐ Reviews</Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card>
    </Container>
  );
};

export default LibraryPage;
