import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Card,
  Spinner,
  ListGroup,
  Badge,
  Modal,
} from "react-bootstrap";
import { BsPersonCircle, BsBook, BsBarChartFill, BsPeople, BsBookFill } from "react-icons/bs";

const BookManagment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [selectedBook, setSelectedBook] = useState(null); // State for the selected book for approval
  const [showModal, setShowModal] = useState(false); // State for controlling modal visibility

  // Fetch books from the API
  const fetchBooks = useCallback(async () => {
    setLoading(true);

    try {
      if (!user?.token) throw new Error("User not authenticated");

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/books/public`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch public books");

      const data = await res.json();
      if (data.length === 0) {
        setBooks([]);
      } else {
        setBooks(data);  
      }
    } catch (err) {
      console.error("❌ Public books fetch error:", err.message);
      setBooks([]); // Ensuring books is an empty array on error
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleBookDelete = async (bookId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this book?")) return;

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/books/${bookId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to delete book");

      fetchBooks();
    } catch (err) {
      console.error("❌ Book deletion error:", err.message);
    }
  };

  const handleBookApproval = async (bookId, action) => {
    try {
      const updatedBookData = { isApproved: action === "approve" };

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/books/${bookId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(updatedBookData),
        }
      );

      if (!res.ok) throw new Error("Failed to update book");

      // Update the local state to reflect changes immediately
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === bookId ? { ...book, isApproved: action === "approve" } : book
        )
      );
      setShowModal(false); // Close modal after approval or deletion
    } catch (err) {
      console.error("❌ Book approval error:", err.message);
    }
  };

  const handleUploadBook = () => {
    navigate("/admin/upload-books"); 
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

      {/* Main content */}
      <Container className="py-4" style={{ marginLeft: "250px" }}>
        <Card className="p-4 shadow bg-light border-0">
          <h2 className="mb-4">📚 Manage Public Books</h2>

          {/* Upload Book Button */}
          <Button variant="success" onClick={handleUploadBook} className="mb-4">
            📤 Upload New Book
          </Button>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : books.length === 0 ? (
            <p className="text-muted">No books found. Try adjusting filters or search terms.</p>
          ) : (
            <ListGroup>
              {books.map((book) => (
                <ListGroup.Item
                  key={book._id}
                  className="d-flex justify-content-between align-items-center flex-wrap"
                >
                  <div className="mb-2 mb-md-0">
                    <strong>{book.title}</strong>{" "}
                    <span className="text-muted">by {book.author || "Unknown"}</span>
                    {book.genre && <Badge bg="info" className="ms-2">{book.genre}</Badge>}
                  </div>
                  <div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => navigate(`/read-books/${book._id}`)}
                    >
                      📖 Read
                    </Button>
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => navigate(`/admin-reviews/${book._id}`)}
                    >
                      ⭐ Reviews
                    </Button>
                    <Button
                      variant={book.isApproved ? "success" : "outline-dark"}  // Dark green for disapproved
                      size="sm"
                      onClick={() => {
                        setSelectedBook(book);
                        setShowModal(true);
                      }}
                      className="ms-2"
                    >
                      ✔️ Approve
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => handleBookDelete(book._id)}
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card>

        {/* Modal for Book Approval */}
        {selectedBook && (
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Approve or Delete Book</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5>{selectedBook.title}</h5>
              <p>{selectedBook.summary || "No summary available."}</p>
              <p><strong>Author:</strong> {selectedBook.author || "Unknown"}</p>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
              <Button
                variant="success"
                onClick={() => handleBookApproval(selectedBook._id, "approve")}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                onClick={() => handleBookApproval(selectedBook._id, "delete")}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Container>
    </div>
  );
};

export default BookManagment;
