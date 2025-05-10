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
import { BsPersonCircle, BsBarChartFill,BsBookFill,BsFillPencilFill, BsTrash, BsBook, BsPeople } from "react-icons/bs";

const UserPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [uploadedBooksFilter, setUploadedBooksFilter] = useState(0);
  const [readListFilter, setReadListFilter] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrderUploadedBooks, setSortOrderUploadedBooks] = useState(true); // true for ascending, false for descending
  const [sortOrderReadList, setSortOrderReadList] = useState(true); // true for ascending, false for descending
  const [activeTab, setActiveTab] = useState("users"); // Added activeTab state to manage tab selection

  // Fetch users from the API
  const fetchUsers = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      if (!user?.token) throw new Error("User not authenticated");

      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/all-profiles`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      if (data.length === 0) {
        setError("No users found.");
      } else {
        // Filter users based on criteria
        let filteredUsers = data;

        if (uploadedBooksFilter > 0) {
          filteredUsers = filteredUsers.filter((user) => user.uploadedBooks.length >= uploadedBooksFilter);
        }

        if (readListFilter > 0) {
          filteredUsers = filteredUsers.filter((user) => user.readList.length >= readListFilter);
        }

        if (query) {
          filteredUsers = filteredUsers.filter((user) =>
            user.fullName.toLowerCase().includes(query.toLowerCase())
          );
        }

        // Sort by uploaded books
        filteredUsers = filteredUsers.sort((a, b) =>
          sortOrderUploadedBooks
            ? a.uploadedBooks.length - b.uploadedBooks.length
            : b.uploadedBooks.length - a.uploadedBooks.length
        );

        // Sort by read list
        filteredUsers = filteredUsers.sort((a, b) =>
          sortOrderReadList
            ? a.readList.length - b.readList.length
            : b.readList.length - a.readList.length
        );

        setUsers(filteredUsers);
      }
    } catch (err) {
      console.error("❌ Fetch users error:", err.message);
      setError(`Failed to fetch users: ${err.message}`);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [user?.token, uploadedBooksFilter, readListFilter, query, sortOrderUploadedBooks, sortOrderReadList]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle deleting a user
  const handleDeleteUser = async (userId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this user?")) return;

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to delete user");

      fetchUsers();
    } catch (err) {
      console.error("❌ User deletion error:", err.message);
      setError(`Failed to delete user: ${err.message}`);
    }
  };

  // Handle promoting a user to admin
  const handleEditUserRole = async (userId, role) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }),
        }
      );

      if (!res.ok) throw new Error("Failed to promote user");

      fetchUsers();
    } catch (err) {
      console.error("❌ Promote user error:", err.message);
      setError(`Failed to promote user: ${err.message}`);
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
                onClick={() => navigate("/admin-dashboard")}
              >
                <BsBarChartFill className="me-2" /> Dashboard
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`nav-link btn ${activeTab === "users" ? "text-primary" : "text-white"}`}
                onClick={() => setActiveTab("users")}
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

      {/* Main Content */}
      <Container className="py-4" style={{ marginLeft: "250px" }}>
        <Card className="p-4 shadow bg-light border-0">
          <h2 className="mb-4">👥 Manage Users</h2>

          <Form className="mb-4">
            <Row className="gy-2">
              <Col md={4}>
                <Form.Label>Search by Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search Users by Name"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </Col>
              <Col md={4}>
                <Form.Label>Search Users by Number of Uploaded Books</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Search Users by Number of Uploaded Books"
                  value={uploadedBooksFilter}
                  onChange={(e) => setUploadedBooksFilter(Number(e.target.value))}
                />
              </Col>
              <Col md={4}>
                <Form.Label>Search Users by Number of Read Books</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Search Users by Number of Read Books"
                  value={readListFilter}
                  onChange={(e) => setReadListFilter(Number(e.target.value))}
                />
              </Col>
            </Row>
          </Form>

          {/* User List */}
          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-muted">No users found.</p>
          ) : (
            <ListGroup>
              {users.map((user) => (
                <ListGroup.Item
                  key={user._id}
                  className="d-flex justify-content-between align-items-center flex-wrap"
                >
                  <div className="mb-2 mb-md-0">
                    <strong>{user.fullName}</strong>
                    <span className="text-muted"> ({user.email})</span>
                    <Badge bg={user.isAdmin ? "success" : "secondary"} className="ms-2">
                      {user.isAdmin ? "Admin" : "User"}
                    </Badge>
                  </div>
                  <div className="d-flex justify-content-between w-100 mt-2">
                    <div>
                      <strong>Uploaded Books:</strong> {user.uploadedBooks.length}
                    </div>
                    <div>
                      <strong>Read Books:</strong> {user.readList.length}
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <BsTrash className="me-1" /> Delete
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default UserPage;
