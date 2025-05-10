import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Spinner,
} from "react-bootstrap";
import {
  BsPersonCircle,
  BsBook,
  BsBarChartFill,
  BsPeople,
  BsBookFill,
} from "react-icons/bs";
import { useAuth } from "../../context/AuthContext";

// Helper to generate logs from user data
const generateLogsFromProfiles = (users) => {
  const logs = [];

  users.forEach((user) => {
    // Simulate login action
    logs.push({
      date: new Date(),
      action: "User login",
      user: user.email,
      details: `${user.fullName} logged in.`,
    });

    // Log uploaded books
    if (user.uploadedBooks?.length) {
      logs.push({
        date: new Date(),
        action: "Books uploaded",
        user: user.email,
        details: `${user.fullName} uploaded ${user.uploadedBooks.length} book(s).`,
      });
    }

    // Log reading history
    if (user.readingHistory?.length) {
      logs.push({
        date: new Date(),
        action: "Reading activity",
        user: user.email,
        details: `${user.fullName} read ${user.readingHistory.length} book(s).`,
      });
    }
  });

  return logs;
};

const AdminDashboard = () => {
  const { user } = useAuth(); // Destructure logout function from useAuth
  const navigate = useNavigate();

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [publicBooks, setPublicBooks] = useState(0);
  const [privateBooks, setPrivateBooks] = useState(0);
  const [reports, setReports] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const resUsers = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/user/all-profiles`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!resUsers.ok) throw new Error("Failed to fetch users");
        const usersData = await resUsers.json();
        setTotalUsers(usersData.length);

        const resBooks = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/books/all`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!resBooks.ok) throw new Error("Failed to fetch books");
        const booksData = await resBooks.json();
        setBooks(booksData);
        setTotalBooks(booksData.length);
        setPublicBooks(booksData.filter((b) => b.isPublic).length);
        setPrivateBooks(booksData.filter((b) => !b.isPublic).length);

        const logs = generateLogsFromProfiles(usersData);
        setReports(logs);
      } catch (err) {
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user?.token]);

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
        {/* Stats */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="stat-card shadow-sm">
              <Card.Body>
                <h6 className="text-muted">Total Books</h6>
                <h3>{totalBooks}</h3>
                <BsBook size={24} className="text-success" />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card shadow-sm">
              <Card.Body>
                <h6 className="text-muted">Public Books</h6>
                <h3>{publicBooks}</h3>
                <BsBook size={24} className="text-info" />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card shadow-sm">
              <Card.Body>
                <h6 className="text-muted">Private Books</h6>
                <h3>{privateBooks}</h3>
                <BsBook size={24} className="text-warning" />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stat-card shadow-sm">
              <Card.Body>
                <h6 className="text-muted">Total Users</h6>
                <h3>{totalUsers}</h3>
                <BsPeople size={24} className="text-primary" />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Reports */}
        <Card className="mb-4">
          <Card.Header>
            <h5>Reports/Logs</h5>
          </Card.Header>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>User</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((log, i) => (
                  <tr key={i}>
                    <td>{log.action}</td>
                    <td>{log.user}</td>
                    <td>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Books */}
        <Card className="mb-4">
          <Card.Header>
            <h5>Manage Books</h5>
          </Card.Header>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author || "Unknown"}</td>
                    <td>{book.genre || "Not specified"}</td>
                    <td>
                      <Button
                        variant="link"
                        onClick={() => navigate(`/admin/books/${book._id}`)}
                      >
                        View Book
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
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
              <button className="nav-link btn text-white" onClick={() => navigate("/admin/profile")}>
                <BsPersonCircle className="me-2" /> Profile
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className="nav-link btn text-white" onClick={() => navigate("/admin-dashboard")}>
                <BsBarChartFill className="me-2" /> Dashboard
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className="nav-link btn text-white" onClick={() => navigate("/admin/users")}>
                <BsPeople className="me-2" /> Users
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className="nav-link btn text-white" onClick={() => navigate("/admin/books")}>
                <BsBookFill className="me-2" /> Books
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className="nav-link btn text-white" onClick={() => navigate("/login")}>
                <BsPersonCircle className="me-2" /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex-grow-1 bg-light">
        <Container fluid className="py-4">
          {renderDashboardContent()}
        </Container>
      </div>
    </div>
  );
};

export default AdminDashboard;
