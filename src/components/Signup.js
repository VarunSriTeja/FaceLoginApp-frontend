import React, { useState } from "react";

const Signup = () => {
  const [label, setLabel] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false); // Track registration status
  const [message, setMessage] = useState(""); // Store success/error messages

  const handleFileChange = (e) => {
    setImages(e.target.files); // Capture multiple images
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    if (images.length !== 3) {
      setMessage("❌ Please upload exactly 3 images.");
      return;
    }

    setLoading(true); // Show loading state
    const formData = new FormData();
    formData.append("label", label);
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      const response = await fetch("http://localhost:5005/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Registration successful!");
      } else {
        setMessage(`❌ Registration failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Face Registration</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Name:
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Upload 3 Images:
          <input type="file" multiple accept="image/*" onChange={handleFileChange} required />
        </label>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </form>
    </div>
  );
};

// Basic CSS styling
const styles = {
  container: {
    maxWidth: "400px",
    margin: "auto",
    padding: "20px",
    textAlign: "center",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontWeight: "bold",
  },
  input: {
    padding: "8px",
    marginTop: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  message: {
    marginTop: "15px",
    fontWeight: "bold",
  },
};

export default Signup;
