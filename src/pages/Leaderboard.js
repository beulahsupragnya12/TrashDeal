// Import React hooks for state and lifecycle management
import { useEffect, useState } from "react";

// Import Firestore functions for reading leaderboard data
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

// Import Firestore database instance
import { db } from "../firebase";

// Import navigation hook for routing back to Home
import { useNavigate } from "react-router-dom";

// Import leaderboard-specific styles
import "../styles/Leaderboard.css";

/*
  Leaderboard Component
  ---------------------
  This component retrieves the top scores from Firebase Firestore
  and displays them in a styled leaderboard view.
*/
export default function Leaderboard() {
  // State to store leaderboard scores
  const [scores, setScores] = useState([]);

  // Navigation hook
  const navigate = useNavigate();

  /* ---------- FETCH LEADERBOARD DATA ---------- */

  useEffect(() => {
    // Function to fetch top 10 scores from Firestore
    const fetchScores = async () => {
      // Create a Firestore query:
      // - Read from "leaderboard" collection
      // - Order by score in descending order
      // - Limit results to top 10
      const q = query(
        collection(db, "leaderboard"),
        orderBy("score", "desc"),
        limit(10)
      );

      // Execute query and retrieve snapshot
      const snapshot = await getDocs(q);

      // Store retrieved data in component state
      setScores(snapshot.docs.map((doc) => doc.data()));
    };

    // Fetch scores once when component mounts
    fetchScores();
  }, []);

  /* ---------- RANK DISPLAY LOGIC ---------- */

  // Returns ranking symbol or number based on index
  const getRank = (i) => {
    if (i === 0) return "🥇"; // First place
    if (i === 1) return "🥈"; // Second place
    if (i === 2) return "🥉"; // Third place
    return i + 1; // Remaining ranks
  };

  /* ---------- UI RENDER ---------- */

  return (
    <div className="leaderboard-page">
      {/* Decorative ropes */}
      <div className="rope left-rope" />
      <div className="rope right-rope" />

      {/* Wooden board container */}
      <div className="wood-board">
        <h1 className="board-title">LEADERBOARD</h1>

        <div className="board-content">
          {/* Empty state message */}
          {scores.length === 0 && (
            <p className="empty">No scores yet. Play the game!</p>
          )}

          {/* Render leaderboard rows */}
          {scores.map((s, i) => (
            <div key={i} className="board-row">
              <span className="rank">{getRank(i)}</span>
              <span className="name">{s.name}</span>
              <span className="score">{s.score}</span>
              <span className={`mode ${s.mode}`}>{s.mode}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation button to return to Home page */}
      <button className="home-btn" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
}
