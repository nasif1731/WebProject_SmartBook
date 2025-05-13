"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Container, Card, Form, Button, Alert, Row, Col, InputGroup, Badge } from "react-bootstrap"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"

// 📍 Define custom pin icon
const pinIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -35],
})

const Profile = () => {
  const { user, login } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: "",
    avatar: "",
    latitude: null,
    longitude: null,
  })
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        const data = await res.json()
        setFormData({
          fullName: data.fullName,
          avatar: data.avatar || "",
          latitude: data.latitude || null,
          longitude: data.longitude || null,
        })
      } catch (err) {
        setError("Failed to fetch profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user.token])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setError("")
    setLoading(true)

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      login({ ...user, fullName: data.user.fullName, avatar: data.user.avatar })
      setMessage("Profile updated successfully")

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formDataUpload = new FormData()
    formDataUpload.append("avatar", file)

    try {
      setLoading(true)
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/upload/avatar`, {
        method: "POST",
        body: formDataUpload,
      })
      const data = await res.json()
      setFormData((prev) => ({
        ...prev,
        avatar: `${process.env.REACT_APP_API_BASE_URL}${data.url}`,
      }))
    } catch (err) {
      alert("❌ Failed to upload avatar")
    } finally {
      setLoading(false)
    }
  }

  // Background gradient style
  const backgroundStyle = {
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    minHeight: "100vh",
    paddingTop: "2rem",
    paddingBottom: "2rem",
  }

  return (
    <div style={backgroundStyle}>
      <Container>
        <Row>
          <Col lg={8} className="mx-auto">
            <Card className="border-0 shadow-sm" style={{ borderRadius: "15px", overflow: "hidden" }}>
              {/* Profile Header */}
              <div
                className="text-white p-4 text-center"
                style={{
                  background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fillOpacity='0.1' fillRule='evenodd'/%3E%3C/svg%3E\")",
                    opacity: 0.3,
                  }}
                ></div>

                <div className="position-relative">
                  <div className="mb-3">
                    {formData.avatar ? (
                      <img
                        src={formData.avatar || "/placeholder.svg"}
                        alt="User Avatar"
                        className="rounded-circle border border-3 border-white shadow"
                        style={{ width: 100, height: 100, objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        className="rounded-circle mx-auto d-flex align-items-center justify-content-center bg-white text-primary"
                        style={{ width: 100, height: 100, fontSize: "2.5rem" }}
                      >
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                  </div>
                  <h3>{formData.fullName || "Your Profile"}</h3>
                  <p className="mb-0">
                    <Badge bg="light" text="primary" className="me-2">
                      <i className="fas fa-envelope me-1"></i>
                      {user.email}
                    </Badge>
                    {user.isAdmin && (
                      <Badge bg="warning" text="dark">
                        <i className="fas fa-crown me-1"></i>
                        Admin
                      </Badge>
                    )}
                  </p>
                </div>
              </div>

              <Card.Body className="p-4">
                {/* Alerts */}
                {message && (
                  <Alert variant="success" className="d-flex align-items-center mb-4" style={{ borderRadius: "10px" }}>
                    <i className="fas fa-check-circle me-2"></i>
                    {message}
                  </Alert>
                )}

                {error && (
                  <Alert variant="danger" className="d-flex align-items-center mb-4" style={{ borderRadius: "10px" }}>
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                  </Alert>
                )}

                <h4 className="mb-4 d-flex align-items-center">
                  <i className="fas fa-user-edit me-2 text-primary"></i>
                  Edit Profile
                </h4>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4" controlId="fullName">
                    <Form.Label className="fw-semibold">Full Name</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <i className="fas fa-user text-muted"></i>
                      </InputGroup.Text>
                      <Form.Control
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="border-start-0 ps-0"
                        style={{ borderRadius: "0 0.375rem 0.375rem 0" }}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="avatarUpload">
                    <Form.Label className="fw-semibold">Upload Avatar (PNG/JPG)</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="fas fa-camera text-muted"></i>
                      </span>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="border-start-0 ps-0"
                        style={{ borderRadius: "0 0.375rem 0.375rem 0" }}
                      />
                    </div>
                    {formData.avatar && (
                      <div className="mt-3 text-center">
                        <p className="text-muted small mb-2">Current Avatar</p>
                        <img
                          src={formData.avatar || "/placeholder.svg"}
                          alt="Avatar Preview"
                          className="rounded-circle border"
                          style={{ width: 80, height: 80, objectFit: "cover" }}
                        />
                      </div>
                    )}
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                      className="py-2"
                      style={{
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                        border: "none",
                        boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
                      }}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Update Profile
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={() => navigate("/change-password")}
                      variant="outline-secondary"
                      className="py-2"
                      style={{ borderRadius: "10px" }}
                    >
                      <i className="fas fa-key me-2"></i>
                      Change Password
                    </Button>
                  </div>
                </Form>

                {/* Location Map */}
                {formData.latitude && formData.longitude && (
                  <div className="mt-5">
                    <h4 className="mb-3 d-flex align-items-center">
                      <i className="fas fa-map-marker-alt me-2 text-danger"></i>
                      Your Location
                    </h4>
                    <Card className="border-0 shadow-sm" style={{ borderRadius: "15px", overflow: "hidden" }}>
                      <MapContainer
                        center={[formData.latitude, formData.longitude]}
                        zoom={13}
                        style={{ height: "300px", width: "100%", borderRadius: "15px" }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution="© OpenStreetMap contributors"
                        />
                        <Marker position={[formData.latitude, formData.longitude]} icon={pinIcon}>
                          <Popup>This is your saved location</Popup>
                        </Marker>
                      </MapContainer>
                      <Card.Footer className="bg-light py-2 px-3">
                        <small className="text-muted">
                          <i className="fas fa-info-circle me-1"></i>
                          This location is saved for security purposes and book recommendations
                        </small>
                      </Card.Footer>
                    </Card>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Profile
