"use client"

import { useNavigate } from "react-router-dom"
import { Card, Button, Badge } from "react-bootstrap"

const BookCard = ({ book }) => {
  const navigate = useNavigate()

  const shortSummary =
    book.summary?.length > 120 ? book.summary.slice(0, 120) + "..." : book.summary

  return (
    <Card
      className="h-100 border-0 shadow-sm"
      style={{
        borderRadius: "15px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onClick={() => navigate(`/book/${book._id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-10px)"
        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.06)"
      }}
    >
      {/* Image + Badges */}
      <div style={{ position: "relative" }}>
        {/* Cover Image */}
        {book.coverImageUrl ? (
          <Card.Img
            variant="top"
            src={
              book.coverImageUrl.startsWith("http")
                ? book.coverImageUrl
                : `${process.env.REACT_APP_API_BASE_URL}${book.coverImageUrl}`
            }
            style={{ objectFit: "cover", height: "220px", width: "100%" }}
            alt="Book Cover"
          />
        ) : (
          <div
            className="d-flex align-items-center justify-content-center text-muted"
            style={{
              height: "220px",
              background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
            }}
          >
            <i className="fas fa-book" style={{ fontSize: "3rem" }}></i>
          </div>
        )}

        {/* Top Right Badges Grouped (Views) */}
        <div
          className="position-absolute"
          style={{
            top: "10px",
            right: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "8px",
            zIndex: 2,
          }}
        >
          {book.views > 0 && (
            <Badge
              bg="secondary"
              style={{
                borderRadius: "8px",
                padding: "0.5rem 0.75rem",
              }}
            >
              <i className="fas fa-eye me-1"></i>
              {book.views}
            </Badge>
          )}
        </div>

        {/* Genre badge */}
        {book.genre && (
          <Badge
            bg="primary"
            className="position-absolute top-0 start-0 m-2"
            style={{
              borderRadius: "8px",
              padding: "0.5rem 0.75rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            {book.genre}
          </Badge>
        )}
      </div>

      {/* Book Info */}
      <Card.Body>
        <Card.Title className="mb-1 fw-bold">{book.title}</Card.Title>
        <Card.Subtitle className="mb-3 text-muted">by {book.author || "Unknown"}</Card.Subtitle>

        <div className="d-flex align-items-center mb-3">
          <div className="me-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <i
                key={i}
                className={`fas fa-star ${
                  i < Math.round(book.rating || 0) ? "text-warning" : "text-muted"
                }`}
                style={{ fontSize: "0.8rem" }}
              ></i>
            ))}
          </div>
          <small className="text-muted">({book.ratingCount || 0} reviews)</small>
        </div>

        {book.summary && (
          <Card.Text
            className="text-muted"
            style={{ fontStyle: "italic", fontSize: "0.9rem", marginBottom: "1rem" }}
          >
            {shortSummary}
          </Card.Text>
        )}

        <div className="d-flex justify-content-between mt-3">
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/reader/${book._id}`)
            }}
            style={{
              borderRadius: "10px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
            }}
          >
            <i className="fas fa-book-open me-2"></i>
            Read
          </Button>
          <Button
            variant="outline-warning"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/reviews/${book._id}`)
            }}
            style={{ borderRadius: "10px" }}
          >
            <i className="fas fa-star me-2"></i>
            Reviews
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default BookCard
