import { useEffect, useState } from 'react';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/metrics/leaderboard`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load leaderboard');
        setUsers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div>
      <h2>🏆 Leaderboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ol>
        {users.map((user, idx) => (
          <li key={user.userId}>
            <strong>{idx + 1}. {user.fullName}</strong> — {user.completedBooks} books
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;
