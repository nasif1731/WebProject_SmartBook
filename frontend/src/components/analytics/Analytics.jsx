import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend
} from 'recharts';
import { Container, Spinner, Alert } from 'react-bootstrap';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const Analytics = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/metrics/analytics`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message);
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAnalytics();
  }, [user.token]);

  const pieData = data ? Object.entries(data.statusBreakdown).map(([status, count]) => ({
    name: status,
    value: count,
  })) : [];

  return (
    <Container className="py-4" style={{ maxWidth: '900px' }}>
      <h2>📊 Reading Analytics</h2>
      {error && <Alert variant="danger">❌ {error}</Alert>}
      {!data ? (
        <div className="text-center"><Spinner animation="border" /><p>Loading...</p></div>
      ) : (
        <>
          <p><strong>Total Books:</strong> {data.totalBooks}</p>
          <p><strong>Average Progress:</strong> {data.averageProgress}%</p>

          <h5 className="mt-4">📘 Reading Status</h5>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <h5 className="mt-5">📈 Status Breakdown (Bar)</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pieData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </Container>
  );
};

export default Analytics;
