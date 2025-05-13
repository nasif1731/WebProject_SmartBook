"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Container, Form, Button, Alert, Card, Row, Col } from "react-bootstrap"

const EditBook = () => {
  const { user } = useAuth()
  const { bookId } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    tags: "",
    genre: "",
    isPublic: false,
    coverImageUrl: "",
    coverFile: null,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/${bookId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message)
        setFormData((prev) => ({
          ...prev,
          title: data.title,
          author: data.author,
          description: data.description,
          tags: data.tags?.join(","),
          genre: data.genre || "",
          isPublic: data.isPublic,
          coverImageUrl: data.coverImageUrl || "",
        }))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [bookId, user.token])

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked })
    } else if (type === "file") {
      setFormData({ ...formData, coverFile: files[0] })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleCoverUpload = async () => {
    if (!formData.coverFile) return null
    const formDataImg = new FormData()
    formDataImg.append("cover", formData.coverFile)

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/upload/cover`, {
        method: "POST",
        body: formDataImg,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Upload failed")
      return `${process.env.REACT_APP_API_BASE_URL}${data.url}`
    } catch (err) {
      setError("Cover image upload failed")
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setSaving(true)

    try {
      let uploadedCoverUrl = formData.coverImageUrl
      if (formData.coverFile) {
        const url = await handleCoverUpload()
        if (url) uploadedCoverUrl = url
      }

      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/books/${bookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map((tag) => tag.trim()),
          coverImageUrl: uploadedCoverUrl,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setSuccess(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="py-5" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
      <Container>
        <Card className="shadow-lg">
          <Card.Header className="bg-primary text-white fw-bold fs-4">Edit Book</Card.Header>
          <Card.Body>
            {success && <Alert variant="success">✅ Book updated successfully!</Alert>}
            {error && <Alert variant="danger">❌ {error}</Alert>}

            {loading ? (
              <div className="text-center py-5">
                <span className="spinner-border" role="status"></span>
                <p className="mt-3">Loading book details...</p>
              </div>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Title</Form.Label>
                      <Form.Control name="title" value={formData.title} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Author</Form.Label>
                      <Form.Control name="author" value={formData.author} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control as="textarea" rows={4} name="description" value={formData.description} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Tags</Form.Label>
                      <Form.Control name="tags" value={formData.tags} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Genre</Form.Label>
                      <Form.Control name="genre" value={formData.genre} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Upload New Cover Image</Form.Label>
                      <Form.Control type="file" accept="image/*" onChange={handleChange} name="coverFile" />
                      {formData.coverImageUrl && (
                        <img src={formData.coverImageUrl} alt="cover preview" className="mt-2" style={{ height: 150, borderRadius: "10px" }} />
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        label="Make this book public"
                        name="isPublic"
                        checked={formData.isPublic}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Button type="submit" variant="success" disabled={saving} className="me-2">
                      {saving ? "Saving..." : "Update Book"}
                    </Button>
                    <Button variant="secondary" onClick={() => navigate(-1)}>
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}

export default EditBook