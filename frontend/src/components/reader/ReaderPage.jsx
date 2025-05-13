"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Container, Button, Alert, Spinner, Card, Form, Row, Col
} from "react-bootstrap";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

const ReaderPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // ✅ Hooks MUST be at the top-level
  const [book, setBook] = useState(null);
  const [progress, setProgress] = useState(0);
  const [savedProgress, setSavedProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [savedPage, setSavedPage] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [scale, setScale] = useState(1.0);
  const containerRef = useRef(null);

  // ✅ PDF scale based on screen size
  useEffect(() => {
    const updateScale = () => {
      const w = window.innerWidth;
      if (w < 600) setScale(0.8);
      else if (w < 900) setScale(1.0);
      else setScale(1.3);
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // ✅ Fetch book and progress
  useEffect(() => {
    if (!user?.token) return;

    const fetchBook = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/${bookId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setBook(data);
      } catch {
        setError("Failed to load book");
      }
    };

    const fetchProgress = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/read/${bookId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        const entry = data.readingHistory?.find(
          (e) => e.book === bookId || e.book?._id === bookId
        );
        if (entry?.progress >= 0) setSavedProgress(entry.progress);
        if (entry?.pageNumber >= 1) setSavedPage(entry.pageNumber);
      } catch (err) {
        console.error("❌ Error fetching progress:", err.message);
      }
    };

    fetchBook();
    fetchProgress();
  }, [bookId, user?.token]);

  // ✅ Set correct page after load
  useEffect(() => {
    if (pdfLoaded && numPages) {
      const pageToShow = savedPage || Math.ceil((savedProgress / 100) * numPages) || 1;
      setCurrentPage(Math.min(pageToShow, numPages));
      containerRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [pdfLoaded, numPages, savedPage, savedProgress]);

  useEffect(() => {
    if (numPages && currentPage) {
      setProgress(Math.round((currentPage / numPages) * 100));
    }
  }, [currentPage, numPages]);

  const handleProgressSave = useCallback(async () => {
    if (!user?.token) return;
    setSaving(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/read/${bookId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ progress, pageNumber: currentPage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess("✅ Progress saved");
      setSavedProgress(progress);
      setSavedPage(currentPage);
    } catch {
      setError("❌ Failed to save progress");
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(""), 2000);
    }
  }, [bookId, progress, currentPage, user?.token]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress !== savedProgress) {
        handleProgressSave();
      }
    }, 20000);
    return () => clearInterval(interval);
  }, [progress, savedProgress, handleProgressSave]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "ArrowRight") setCurrentPage((p) => Math.min(p + 1, numPages));
    if (e.key === "ArrowLeft") setCurrentPage((p) => Math.max(p - 1, 1));
  }, [numPages]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPdfLoaded(true);
  };

  // ✅ Auth prompt UI moved to render section
  if (!user || !user.token) {
    const backgroundStyle = {
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #f0f4f8, #d9e2ec)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    return (
      <div style={backgroundStyle}>
        <Container className="py-5">
          <Card
            className="border-0 shadow-sm text-center p-5"
            style={{ borderRadius: "15px", backdropFilter: "blur(10px)" }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔒</div>
            <h3 className="mb-3">Authentication Required</h3>
            <p className="mb-4">
              Please{" "}
              <a href="/login" className="fw-bold text-decoration-none">
                login
              </a>{" "}
              to access the SmartBook Library.
            </p>
            <p className="text-muted small">
              Features like <strong>Library, Read, Upload, Analytics, Recently Read</strong> are only available to
              logged-in users.
            </p>
            <div className="mt-4">
              <Button
                variant="primary"
                href="/login"
                className="me-2"
                style={{
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                  border: "none",
                  boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
                }}
              >
                Login
              </Button>
              <Button variant="outline-primary" href="/register" style={{ borderRadius: "10px" }}>
                Register
              </Button>
            </div>
          </Card>
        </Container>
      </div>
    );
  }

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!book) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <Container className="py-4" style={{ maxWidth: "1000px" }}>
      <Card className="p-3 shadow">
        <h2 className="mb-3">📖 {book.title}</h2>
        <div
          ref={containerRef}
          className="d-flex justify-content-center"
          style={{
            border: "1px solid #ccc",
            maxHeight: "calc(100vh - 300px)",
            overflow: "auto",
          }}
        >
          <Document
            file={`${process.env.REACT_APP_API_BASE_URL}/${book.pdfUrl}`}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(err) => setError(`PDF error: ${err.message}`)}
            loading={<Spinner animation="border" className="d-block mx-auto my-5" />}
          >
            <Page
              pageNumber={currentPage}
              scale={scale}
              renderTextLayer
              renderAnnotationLayer
            />
          </Document>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <Button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage <= 1}>⬅️</Button>
          <span>Page {currentPage} of {numPages || "--"}</span>
          <Button onClick={() => setCurrentPage((p) => Math.min(p + 1, numPages))} disabled={currentPage >= numPages}>➡️</Button>
        </div>

        <Row className="align-items-center mt-4">
          <Col xs={12} md={8}>
            <Form.Label><strong>📊 Progress: {progress}%</strong></Form.Label>
            <progress value={progress} max="100" style={{ width: "100%", height: "20px" }} />
          </Col>
          <Col md="auto">
            <Button onClick={handleProgressSave} disabled={saving} variant="success">
              {saving ? "Saving..." : "💾 Save"}
            </Button>
          </Col>
        </Row>

        {success && <Alert variant="success" className="mt-2">{success}</Alert>}
        <Button
          variant="outline-primary"
          className="mt-3"
          onClick={() => navigate(`/reviews/${book._id}`)}
        >
          ✍️ Write a Review
        </Button>
      </Card>
    </Container>
  );
};

export default ReaderPage;
