"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Container, Form, Button, Alert, Card, InputGroup } from "react-bootstrap"

const ChangePassword = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(false)
    setError("")

    if (formData.newPassword !== formData.confirmPassword) {
      return setError("New passwords do not match")
    }

    if (formData.newPassword.length < 8) {
      return setError("New password must be at least 8 characters long")
    }

    try {
      setLoading(true)
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setSuccess(true)
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Background gradient style
  const backgroundStyle = {
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    minHeight: "100vh",
    paddingTop: "2rem",
    paddingBottom: "3rem",
  }

  return (
    <div style={backgroundStyle}>
      <Container>
        <Card
          className="border-0 shadow-sm overflow-hidden"
          style={{ borderRadius: "15px", backdropFilter: "blur(10px)", maxWidth: "500px", margin: "0 auto" }}
        >
          <Card.Header
            className="py-4 border-0 text-center"
            style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
          >
            <div
              className="d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              <i className="fas fa-key text-white" style={{ fontSize: "2rem" }}></i>
            </div>
            <h3 className="mb-0 text-white">Change Password</h3>
            <p className="mb-0 text-white text-opacity-75">Update your account password</p>
          </Card.Header>

          <Card.Body className="p-4">
            {/* Alerts */}
            {success && (
              <Alert variant="success" className="d-flex align-items-center mb-4" style={{ borderRadius: "10px" }}>
                <i className="fas fa-check-circle me-2"></i>
                Password updated successfully!
              </Alert>
            )}

            {error && (
              <Alert variant="danger" className="d-flex align-items-center mb-4" style={{ borderRadius: "10px" }}>
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4" controlId="currentPassword">
                <Form.Label className="fw-semibold">Current Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light border-end-0">
                    <i className="fas fa-lock text-muted"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                    required
                    className="border-start-0 border-end-0 ps-0"
                    style={{ borderRadius: "0" }}
                  />
                  <InputGroup.Text
                    className="bg-light border-start-0"
                    style={{ cursor: "pointer" }}
                    onClick={() => togglePasswordVisibility("current")}
                  >
                    <i className={`fas fa-${showPasswords.current ? "eye-slash" : "eye"} text-muted`}></i>
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4" controlId="newPassword">
                <Form.Label className="fw-semibold">New Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light border-end-0">
                    <i className="fas fa-key text-muted"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    required
                    className="border-start-0 border-end-0 ps-0"
                    style={{ borderRadius: "0" }}
                  />
                  <InputGroup.Text
                    className="bg-light border-start-0"
                    style={{ cursor: "pointer" }}
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    <i className={`fas fa-${showPasswords.new ? "eye-slash" : "eye"} text-muted`}></i>
                  </InputGroup.Text>
                </InputGroup>
                <Form.Text className="text-muted">Password must be at least 8 characters long.</Form.Text>
              </Form.Group>

              <Form.Group className="mb-4" controlId="confirmPassword">
                <Form.Label className="fw-semibold">Confirm New Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light border-end-0">
                    <i className="fas fa-check-double text-muted"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    required
                    className="border-start-0 border-end-0 ps-0"
                    style={{ borderRadius: "0" }}
                  />
                  <InputGroup.Text
                    className="bg-light border-start-0"
                    style={{ cursor: "pointer" }}
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    <i className={`fas fa-${showPasswords.confirm ? "eye-slash" : "eye"} text-muted`}></i>
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              <div className="d-grid gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  style={{
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
                    padding: "0.8rem",
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Update Password
                    </>
                  )}
                </Button>

                {/* Forgot Password Button */}
                <div className="text-center">
                  <Button variant="link" onClick={() => navigate("/forgot-password")} className="text-decoration-none">
                    <i className="fas fa-question-circle me-1"></i>
                    Forgot Password?
                  </Button>
                </div>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}

export default ChangePassword
