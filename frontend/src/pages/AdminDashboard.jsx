import React, { useState, useEffect } from "react";
import {
  Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Spinner
} from "react-bootstrap";
import {
  BsBook,
  BsPeople,
  BsEye,
  BsStar,
  BsTrash,
  BsPencilSquare,
  BsBarChartFill,
  BsListUl,
  BsPersonFill,
  BsBookFill,
  BsChatLeftTextFill,
  BsStarFill
} from "react-icons/bs";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    publicBooks: 0,
    privateBooks: 0,
    mostViewedBook: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    author: "",
    genre: "",
    isPublic: false
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!user?.token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const booksRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/admin/books`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        const statsRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        if (!booksRes.ok || !statsRes.ok) {
          throw new Error("Failed to fetch admin data");
        }

        const booksData = await booksRes.json();
        const statsData = await statsRes.json();

        setBooks(booksData);
        setStats(statsData);
      } catch (err) {
        setError("Failed to load admin data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user?.token]);

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setEditForm({
      title: book.title,
      author: book.author || "",
      genre: book.genre || "",
      isPublic: book.isPublic
    });
    setShowEditModal(true);
  };

  const handleDeleteBook = (book) => {
    setSelectedBook(book);
    setShowDeleteModal(true);
  };

  const handleEditSubmit = () => {
    setShowEditModal(false);
    setBooks(books.map(book =>
      book._id === selectedBook._id
        ? { ...book, ...editForm }
        : book
    ));
  };

  const handleDeleteSubmit = () => {
    setShowDeleteModal(false);
    setBooks(books.filter(book => book._id !== selectedBook._id));
  };

  const renderDashboardContent = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading dashboard data...</p>
        </div>
      );
    }

    if (error) {
      return <div className="alert alert-danger">{error}</div>;
    }

    return (
      <>
        <Row className="mb-4">
          <Col md={3}>
            <Card className="stat-card shadow-sm">
              <Card.Body>
                <h6 className="text-muted">Total Users</h6>
                <h3>{stats.totalUsers}</h3>
                <BsPeople size={24} className="text-primary" />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card shadow-sm">
              <Card.Body>
                <h6 className="text-muted">Total Books</h6>
                <h3>{stats.totalBooks}</h3>
                <BsBook size={24} className="text-success" />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card shadow-sm">
              <Card.Body>
                <h6 className="text-muted">Public/Private</h6>
                <h3>{stats.publicBooks} / {stats.privateBooks}</h3>
                <BsEye size={24} className="text-warning" />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card shadow-sm">
              <Card.Body>
                <h6 className="text-muted">Avg. Rating</h6>
                <h3>
                  {(stats.totalBooks > 0
                    ? (books.reduce((sum, b) => sum + (b.averageRating || 0), 0) / stats.totalBooks).toFixed(1)
                    : 0)}
                </h3>
                <BsStar size={24} className="text-info" />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Add the rest of your book list/table here if needed */}
      </>
    );
  };

  return (
    <div className="d-flex">
      <div className="bg-dark text-white" style={{ width: "250px", minHeight: "100vh" }}>
        <div className="p-3 border-bottom border-secondary">
          <h4 className="mb-0 d-flex align-items-center">
            <BsBook className="me-2" /> SmartBook Admin
          </h4>
        </div>

        <div className="p-3">
          <ul className="nav flex-column">
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
                onClick={() => setActiveTab("users")}
              >
                <BsPersonFill className="me-2" /> Users
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`nav-link btn ${activeTab === "books" ? "text-primary" : "text-white"}`}
                onClick={() => setActiveTab("books")}
              >
                <BsBookFill className="me-2" /> Books
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`nav-link btn ${activeTab === "reviews" ? "text-primary" : "text-white"}`}
                onClick={() => setActiveTab("reviews")}
              >
                <BsChatLeftTextFill className="me-2" /> Reviews
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`nav-link btn ${activeTab === "analytics" ? "text-primary" : "text-white"}`}
                onClick={() => setActiveTab("analytics")}
              >
                <BsListUl className="me-2" /> Analytics
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex-grow-1 bg-light">
        <Container fluid className="py-4">
          {activeTab === "dashboard" && renderDashboardContent()}
          {activeTab !== "dashboard" && (
            <div className="text-center py-5">
              <h5>Coming Soon: {activeTab}</h5>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};

export default AdminDashboard;
