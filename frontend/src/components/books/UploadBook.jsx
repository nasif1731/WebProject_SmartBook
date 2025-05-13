"use client"

import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Container, Form, Button, Alert, Row, Col, Card, InputGroup } from "react-bootstrap"

const UploadBook = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    tags: "",
    genre: "",
    isPublic: false,
    coverImageUrl: "",
    pdf: null,
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked })
    } else if (type === "file") {
      setFormData({ ...formData, pdf: files[0] })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formDataImg = new FormData()
    formDataImg.append("cover", file)

    try {
      setLoading(true)
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/upload/cover`, {
        method: "POST",
        body: formDataImg,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Upload failed")

      setFormData((prev) => ({
        ...prev,
        coverImageUrl: `${process.env.REACT_APP_API_BASE_URL}${data.url}`,
      }))
    } catch (err) {
      alert("❌ Failed to upload cover image")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    setUploadProgress(0)

    const body = new FormData()
    for (const key in formData) {
      if (key === "pdf") {
        body.append("pdf", formData.pdf)
      } else if (key === "tags") {
        body.append(
          key,
          formData[key]
            .split(",")
            .map((tag) => tag.trim())
            .join(","),
        )
      } else {
        body.append(key, formData[key])
      }
    }

    try {
      // Create a custom fetch with upload progress
      const xhr = new XMLHttpRequest()
      xhr.open("POST", `${process.env.REACT_APP_API_BASE_URL}/api/books/upload`)
      xhr.setRequestHeader("Authorization", `Bearer ${user.token}`)

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setUploadProgress(progress)
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText)
          navigate("/dashboard", { state: { uploadSuccess: true } })
        } else {
          let errorMessage = "Upload failed"
          try {
            const errorData = JSON.parse(xhr.responseText)
            errorMessage = errorData.message || errorMessage
          } catch (e) {
            // If parsing fails, use the default error message
          }
          setError(errorMessage)
          setLoading(false)
        }
      }

      xhr.onerror = () => {
        setError("Network error occurred")
        setLoading(false)
      }

      xhr.send(body)
    } catch (err) {
      setError(err.message || "Upload failed")
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
          style={{ borderRadius: "15px", backdropFilter: "blur(10px)" }}
        >
          <Card.Header
            className="py-4 border-0"
            style={{ background: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)" }}
          >
            <div className="d-flex align-items-center">
              <div
                className="d-flex align-items-center justify-content-center me-3"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                <i className="fas fa-upload text-white" style={{ fontSize: "1.5rem" }}></i>
              </div>
              <div>
                <h2 className="mb-0 text-white">Upload New Book</h2>
                <p className="mb-0 text-white text-opacity-75">Share your book with the SmartBook community</p>
              </div>
            </div>
          </Card.Header>

          <Card.Body className="p-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="danger" className="d-flex align-items-center mb-4" style={{ borderRadius: "10px" }}>
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} encType="multipart/form-data">
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      Title <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <i className="fas fa-heading text-muted"></i>
                      </InputGroup.Text>
                      <Form.Control
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Book Title"
                        required
                        className="border-start-0 ps-0"
                        style={{ borderRadius: "0 0.375rem 0.375rem 0" }}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Author</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <i className="fas fa-user text-muted"></i>
                      </InputGroup.Text>
                      <Form.Control
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        placeholder="Author Name"
                        className="border-start-0 ps-0"
                        style={{ borderRadius: "0 0.375rem 0.375rem 0" }}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Description</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <i className="fas fa-align-left text-muted"></i>
                      </InputGroup.Text>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Write a short summary or description"
                        className="border-start-0 ps-0"
                        style={{ borderRadius: "0 0.375rem 0.375rem 0" }}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Tags (comma-separated)</Form.Label>
                        <InputGroup>
                          <InputGroup.Text className="bg-light border-end-0">
                            <i className="fas fa-tags text-muted"></i>
                          </InputGroup.Text>
                          <Form.Control
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="e.g., AI, ML, Data"
                            className="border-start-0 ps-0"
                            style={{ borderRadius: "0 0.375rem 0.375rem 0" }}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Genre</Form.Label>
                        <InputGroup>
                          <InputGroup.Text className="bg-light border-end-0">
                            <i className="fas fa-bookmark text-muted"></i>
                          </InputGroup.Text>
                          <Form.Control
                            name="genre"
                            value={formData.genre}
                            onChange={handleChange}
                            placeholder="e.g., Science Fiction"
                            className="border-start-0 ps-0"
                            style={{ borderRadius: "0 0.375rem 0.375rem 0" }}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      PDF File <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <i className="fas fa-file-pdf text-muted"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="file"
                        name="pdf"
                        accept="application/pdf"
                        required
                        onChange={handleChange}
                        className="border-start-0 ps-0"
                        style={{ borderRadius: "0 0.375rem 0.375rem 0" }}
                      />
                    </InputGroup>
                    <Form.Text className="text-muted">
                      Upload a PDF file of your book. Maximum file size: 50MB.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Check
                      type="switch"
                      id="isPublic"
                      label="Make this book public"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleChange}
                      className="fw-semibold"
                    />
                    <Form.Text className="text-muted">
                      Public books can be viewed and read by all users of the platform.
                    </Form.Text>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <div className="sticky-top pt-3" style={{ top: "1rem" }}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">Upload Cover Image (JPG/PNG)</Form.Label>
                      <div
                        className="mb-3 d-flex align-items-center justify-content-center bg-light rounded"
                        style={{
                          height: "250px",
                          border: "2px dashed #ccc",
                          cursor: "pointer",
                          overflow: "hidden",
                        }}
                        onClick={() => document.getElementById("coverImageInput").click()}
                      >
                        {formData.coverImageUrl ? (
                          <img
                            src={formData.coverImageUrl || "/placeholder.svg"}
                            alt="Cover Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <div className="text-center text-muted">
                            <i className="fas fa-image" style={{ fontSize: "3rem" }}></i>
                            <p className="mt-2">Click to upload cover image</p>
                          </div>
                        )}
                      </div>
                      <Form.Control
                        id="coverImageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="d-none"
                      />
                      <Form.Text className="text-muted">Recommended size: 600x900 pixels. JPG or PNG format.</Form.Text>
                    </Form.Group>

                    <div className="d-grid gap-3">
                      <Button
                        type="submit"
                        variant="success"
                        disabled={loading}
                        style={{
                          borderRadius: "10px",
                          background: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
                          border: "none",
                          boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
                          padding: "0.8rem",
                        }}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Uploading... {uploadProgress > 0 && `${uploadProgress}%`}
                          </>
                        ) : (
                          <>
                            <i className="fas fa-cloud-upload-alt me-2"></i>
                            Upload Book
                          </>
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={() => navigate(-1)}
                        disabled={loading}
                        style={{ borderRadius: "10px" }}
                      >
                        <i className="fas fa-arrow-left me-2"></i>
                        Cancel
                      </Button>
                    </div>

                    {loading && uploadProgress > 0 && (
                      <div className="mt-3">
                        <div className="progress" style={{ height: "20px", borderRadius: "10px" }}>
                          <div
                            className="progress-bar progress-bar-striped progress-bar-animated"
                            role="progressbar"
                            style={{
                              width: `${uploadProgress}%`,
                              background: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
                            }}
                            aria-valuenow={uploadProgress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          >
                            {uploadProgress}%
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}

export default UploadBook
