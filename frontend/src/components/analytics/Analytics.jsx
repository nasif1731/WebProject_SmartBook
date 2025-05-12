"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts"
import { Container, Spinner, Alert, Card, Row, Col, Badge, ProgressBar, Tabs, Tab } from "react-bootstrap"

// Enhanced color palette
const COLORS = [
  "#3498db", // Blue
  "#2ecc71", // Green
  "#f39c12", // Yellow
  "#e74c3c", // Red
  "#9b59b6", // Purple
  "#1abc9c", // Teal
  "#e67e22", // Orange
]

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <p className="label" style={{ margin: 0 }}>{`${label} : ${payload[0].value}`}</p>
      </div>
    )
  }
  return null
}

const Analytics = () => {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // Mock reading time data (you can replace this with real data from your API)
  // const [readingTimeData, setReadingTimeData] = useState([
  //   { day: "Mon", minutes: 30 },
  //   { day: "Tue", minutes: 45 },
  //   { day: "Wed", minutes: 25 },
  //   { day: "Thu", minutes: 60 },
  //   { day: "Fri", minutes: 40 },
  //   { day: "Sat", minutes: 90 },
  //   { day: "Sun", minutes: 75 },
  // ])

  // useEffect(() => {
  //   const fetchAnalytics = async () => {
  //     setLoading(true)
  //     try {
  //       const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/metrics/analytics`, {
  //         headers: { Authorization: `Bearer ${user.token}` },
  //       })
  //       const result = await res.json()
  //       if (!res.ok) throw new Error(result.message)
  //       setData(result)
  //     } catch (err) {
  //       setError(err.message)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  // Mock reading time data (you can replace this with real data from your API)
 const [readingTimeData, setReadingTimeData] = useState([]);


  useEffect(() => {
   const fetchAnalytics = async () => {
  setLoading(true)
  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/metrics/analytics`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
    const result = await res.json()
    if (!res.ok) throw new Error(result.message)
    
    setData(result)
    if (result.weeklyReadingTime) {
      setReadingTimeData(result.weeklyReadingTime)
    }
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}
    fetchAnalytics()
  }, [user.token])

  // Process pie chart data
  const pieData = data?.statusBreakdown
    ? Object.entries(data.statusBreakdown)
        .filter(([_, count]) => count > 0)
        .map(([status, count]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: count,
        }))
    : []

  // Calculate reading stats
  const calculateReadingStats = () => {
    if (!data) return { completed: 0, inProgress: 0, notStarted: 0 }

    const statusCounts = {
      completed: data.statusBreakdown?.completed || 0,
      inProgress: data.statusBreakdown?.inProgress || 0,
      notStarted: data.statusBreakdown?.notStarted || 0,
    }

    return statusCounts
  }

  const readingStats = calculateReadingStats()

  // Calculate total reading time (mock data)
  const totalReadingTime = readingTimeData.reduce((total, day) => total + day.minutes, 0)

  // Render loading state
  if (loading) {
    return (
      <Container className="py-5">
        <Card className="shadow-sm">
          <Card.Body className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Loading your reading analytics...</p>
          </Card.Body>
        </Card>
      </Container>
    )
  }

  // Render error state
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="shadow-sm">
          <Alert.Heading>Error Loading Analytics</Alert.Heading>
          <p>We couldn't load your reading analytics: {error}</p>
        </Alert>
      </Container>
    )
  }
//that recommendation thing

  return (
    <Container className="py-4">
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-0">
                <span className="me-2">📊</span>
                Reading Analytics
              </h2>
              <p className="text-muted mb-0">Track your reading habits and progress</p>
            </div>
            <Badge bg="primary" className="p-2">
              Last updated: {new Date().toLocaleDateString()}
            </Badge>
          </div>

          <Row className="g-4 mb-4">
            <Col md={4}>
              <Card className="h-100 border-0 bg-light">
                <Card.Body className="text-center">
                  <h6 className="text-muted mb-2">TOTAL BOOKS</h6>
                  <h2 className="display-4 fw-bold">{data?.totalBooks || 0}</h2>
                  <div className="d-flex justify-content-center mt-3">
                    <Badge bg="success" className="me-2">
                      Completed: {readingStats.completed}
                    </Badge>
                    <Badge bg="warning" className="me-2">
                      In Progress: {readingStats.inProgress}
                    </Badge>
                   
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="h-100 border-0 bg-light">
                <Card.Body className="text-center">
                  <h6 className="text-muted mb-2">AVERAGE PROGRESS</h6>
                  <h2 className="display-4 fw-bold">{data?.averageProgress || 0}%</h2>
                  <ProgressBar
                    now={data?.averageProgress || 0}
                    variant={data?.averageProgress > 75 ? "success" : data?.averageProgress > 25 ? "warning" : "danger"}
                    className="mt-3"
                    style={{ height: "10px" }}
                  />
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="h-100 border-0 bg-light">
                <Card.Body className="text-center">
                  <h6 className="text-muted mb-2">READING TIME</h6>
                  <h2 className="display-4 fw-bold">{totalReadingTime}</h2>
                  <p className="text-muted">minutes this week</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
            <Tab eventKey="overview" title="Overview">
              <Row>
                <Col lg={6}>
                  <Card className="mb-4 border-0 shadow-sm">
                    <Card.Body>
                      <h5 className="mb-3">📘 Reading Status</h5>
                      {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={pieData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              labelLine={false}
                            >
                              {pieData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                  stroke="#fff"
                                  strokeWidth={2}
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <Alert variant="info">No reading status data available.</Alert>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={6}>
                  <Card className="mb-4 border-0 shadow-sm">
                    <Card.Body>
                      <h5 className="mb-3">📈 Status Breakdown</h5>
                      {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={pieData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="value" name="Number of Books" radius={[4, 4, 0, 0]}>
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <Alert variant="info">No bar chart data available.</Alert>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="reading-time" title="Reading Time">
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h5 className="mb-3">⏱️ Weekly Reading Activity</h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={readingTimeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis label={{ value: "Minutes", angle: -90, position: "insideLeft" }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="minutes"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                        name="Reading Time"
                      />
                    </AreaChart>
                  </ResponsiveContainer>

                  <div className="mt-4">
                    <h6>Reading Insights</h6>
                    <ul className="text-muted">
                      <li>
                        Your most active reading day is{" "}
                        {
                          readingTimeData.reduce(
                            (max, day) => (day.minutes > max.minutes ? day : max),
                            readingTimeData[0],
                          ).day
                        }
                      </li>
                      <li>You read an average of {(totalReadingTime / 7).toFixed(1)} minutes per day</li>
                      <li>
                        Weekend reading accounts for{" "}
                        {(((readingTimeData[5].minutes + readingTimeData[6].minutes) / totalReadingTime) * 100).toFixed(
                          0,
                        )}
                        % of your total reading time
                      </li>
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="recommendations" title="Recommendations">
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h5 className="mb-3">🔍 Personalized Recommendations</h5>

                  {data?.averageProgress < 30 ? (
                    <Alert variant="warning">
                      <Alert.Heading>Reading Progress Tip</Alert.Heading>
                      <p>
                        Your average reading progress is below 30%. Consider setting aside 15-20 minutes each day for
                        focused reading to improve your progress.
                      </p>
                    </Alert>
                  ) : null}

                  <Row className="mt-4">
                    <Col md={6}>
                      <Card className="border-0 bg-light mb-3">
                        <Card.Body>
                          <h6>📚 Based on your reading habits:</h6>
                          <ul>
                            <li>Try reading during your most productive time of day</li>
                            <li>Set a goal to complete one book every two weeks</li>
                            <li>Join a reading challenge to stay motivated</li>
                          </ul>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <h6>🎯 Next steps to improve:</h6>
                          <ul>
                            <li>Create a reading schedule and stick to it</li>
                            <li>Take notes while reading to improve retention</li>
                            <li>Share your progress with friends for accountability</li>
                          </ul>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Analytics
