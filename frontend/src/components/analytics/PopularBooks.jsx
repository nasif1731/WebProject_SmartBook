import React, { useEffect, useState } from "react";
import BookCard from "../books/BookCard";

const PopularBooks = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [metric, setMetric] = useState("views");

  useEffect(() => {
    const fetchPopularBooks = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/metrics/popular?metric=${metric}`
        );
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to fetch popular books");
        setBooks(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPopularBooks();
  }, [metric]);

  return (
    <div className="popular-books-container">
      <h2>🔥 Popular Books</h2>

      <label>
        Sort by:{" "}
        <select value={metric} onChange={(e) => setMetric(e.target.value)}>
          <option value="views">Views</option>
          <option value="readCount">Read Count</option>
          <option value="averageRating">Average Rating</option>
        </select>
      </label>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {books.length === 0 ? (
        <p>No popular books found.</p>
      ) : (
        <div className="container mt-4">
          <div className="row g-4 justify-content-start">
            {books.map((book) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={book._id}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PopularBooks;
