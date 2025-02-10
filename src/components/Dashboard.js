import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { isAuthenticated, setIsAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || !user) {
            navigate("/login"); // Redirect if not logged in
        }
    }, [isAuthenticated, user, navigate]);

    return (
        isAuthenticated && user && (
            <div style={styles.container}>
                <h2 style={styles.heading}>Welcome, {user}!</h2>
                <p>You have successfully logged in using facial recognition.</p>
                <button 
                    style={styles.logoutBtn}
                    onClick={() => { 
                        setIsAuthenticated(false);
                        navigate("/login");
                    }}
                >
                    Logout
                </button>
            </div>
        )
    );
};

// Inline styles for better UI
const styles = {
    container: {
        textAlign: "center",
        marginTop: "50px",
    },
    heading: {
        fontSize: "24px",
        fontWeight: "bold",
    },
    logoutBtn: {
        backgroundColor: "#d9534f",
        color: "white",
        padding: "10px 20px",
        border: "none",
        cursor: "pointer",
        borderRadius: "5px",
        marginTop: "20px",
    },
};

export default Dashboard;
