import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Container,
  Alert,
  Spinner,
  Card,
  
} from 'react-bootstrap';
import {
  BsBook,
  BsPersonCircle,
  BsBarChartFill,
  BsPeople,
  BsBookFill
} from 'react-icons/bs';

const ReaderPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/${bookId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setBook(data);
      } catch (err) {
        setError('Failed to load book.');
      }
    };
    fetchBook();
  }, [bookId, user.token]);

  

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!book) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

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

      {/* Main Content */}
      <div className="flex-grow-1 bg-light">
        <Container className="py-4" style={{ maxWidth: '900px' }}>
          <Card className="p-3 shadow">
            <h2 className="mb-3">📖 Reading: {book.title}</h2>
            <div style={{ height: '600px', overflow: 'auto' }}>
              <iframe
                src={`${process.env.REACT_APP_API_BASE_URL}/${book.pdfUrl}`}
                width="100%"
                height="100%"
                title="PDF Reader"
                style={{ border: '1px solid #ccc' }}
              />
            </div>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default ReaderPage;
