import React, { useRef, useState, useEffect, useContext } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { loadModels } from "../utils/faceUtils";

const Login = () => {
    const { setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const videoRef = useRef();
    const [imageData, setImageData] = useState(null);
    const [loading, setLoading] = useState(false); // Track verification status
    const [message, setMessage] = useState(""); // Display messages

    useEffect(() => {
        loadModels();
        startWebcam();
    }, []);

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
            videoRef.current.srcObject = stream;
        } catch (error) {
            console.error("Error accessing webcam:", error);
            setMessage("❌ Failed to access webcam.");
        }
    };

    const captureImage = async () => {
        setMessage(""); // Clear previous messages
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
            setImageData(blob);
            setMessage("📸 Image captured successfully!");
        });
    };

    const handleLogin = async () => {
        if (!imageData) {
            setMessage("⚠️ Capture an image first!");
            return;
        }

        setLoading(true); // Show loading state
        setMessage("🔄 Verifying face...");

        const formData = new FormData();
        formData.append("image", imageData);

        try {
            const response = await axios.post("http://localhost:5005/api/auth/login", formData);
            if (response.data.message === "Verified") {
                setMessage("✅ Face recognized! Redirecting...");
                setTimeout(() => {
                    setIsAuthenticated(true);
                    navigate("/dashboard");
                }, 1500); // Redirect after delay
            } else {
                setMessage("❌ Face not recognized. Please try again.");
            }
        } catch (error) {
            console.error(error);
            setMessage("❌ Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Face Authentication Login</h2>
            <video ref={videoRef} autoPlay style={styles.video}></video>
            <div style={styles.buttonContainer}>
                <button onClick={captureImage} style={styles.button}>
                    Capture Image
                </button>
                <button onClick={handleLogin} style={styles.button} disabled={loading}>
                    {loading ? "Verifying..." : "Login"}
                </button>
            </div>
            {message && <p style={styles.message}>{message}</p>}
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
    video: {
        width: "100%",
        maxHeight: "300px",
        borderRadius: "8px",
        border: "2px solid #ccc",
        marginBottom: "10px",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "center",
        gap: "10px",
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

export default Login;
