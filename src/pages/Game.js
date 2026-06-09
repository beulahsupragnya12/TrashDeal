// Import React hooks for state, lifecycle, and references
import React, { useEffect, useState, useRef } from "react";

// Import external trash data (structured JSON)
import trashData from "../trashdata/trashData.json";

// Import styles for the game
import "../styles/Game.css";

// Firebase imports for saving leaderboard data
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

// React Router hook for navigation
import { useNavigate } from "react-router-dom";

/* ================= CONFIGURATION CONSTANTS ================= */

// Game board dimensions
const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;

// Bin and trash item sizes
const BIN_HEIGHT = 120;
const ITEM_SIZE = 44;

// Interval (in ms) at which new trash items spawn
const SPAWN_INTERVAL = 2000;

/* Difficulty mode configurations
   Each mode defines:
   - label: display name
   - maxMisses: allowed mistakes before game over
   - dropSpeed: speed at which trash items fall
*/
const GAME_MODES = {
  easy: { label: "Easy", maxMisses: 20, dropSpeed: 1.2 },
  medium: { label: "Medium", maxMisses: 15, dropSpeed: 2.0 },
  hard: { label: "Hard", maxMisses: 8, dropSpeed: 3.0 },
};

/* Bin definitions
   These bins are displayed at the bottom of the game board
*/
const BINS = [
  { type: "landfill", label: "General Waste", color: "#212121" },
  { type: "recycle", label: "Recycling", color: "#2E7D32" },
  { type: "organic", label: "Organic Waste", color: "#8D6E63" },
];

/* ================= GAME COMPONENT ================= */

export default function Game() {
  /* ---------- GAME STATE ---------- */

  // Selected difficulty mode
  const [mode, setMode] = useState(null);

  // Controls visibility of the difficulty selection dialog
  const [showModeDialog, setShowModeDialog] = useState(true);

  // Array of active falling trash items
  const [trashItems, setTrashItems] = useState([]);

  // Player score and miss count
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);

  // Drag-and-drop state
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Game control flags
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Player name for leaderboard submission
  const [playerName, setPlayerName] = useState("");

  // Navigation hook
  const navigate = useNavigate();

  /* ---------- REFS ---------- */

  // Reference to the game board DOM element
  const gameRef = useRef(null);

  // References for timers and animation frames
  const spawnIntervalRef = useRef(null);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(null);

  /* ---------- START / STOP GAME ---------- */

  // Start the game with the selected difficulty mode
  const startGame = (selectedMode) => {
    setMode(selectedMode);
    setShowModeDialog(false);
    setTrashItems([]);
    setScore(0);
    setMisses(0);
    setGameOver(false);
    lastTimeRef.current = null;
    setRunning(true);
  };

  // Stop the game and clear timers
  const stopGame = () => {
    setRunning(false);
    cancelAnimationFrame(animationRef.current);
    clearInterval(spawnIntervalRef.current);
  };

  /* ---------- SPAWN TRASH ITEMS ---------- */

  // Periodically spawn new trash items while the game is running
  useEffect(() => {
    if (!running) return;

    const spawn = () => {
      setTrashItems((prev) => {
        // Select a random trash item from external JSON
        const trash = trashData[Math.floor(Math.random() * trashData.length)];

        // Random horizontal position
        const x = Math.random() * (GAME_WIDTH - ITEM_SIZE);

        return [
          ...prev,
          {
            id: Date.now(), // Unique identifier
            type: trash.type, // Bin type
            emoji: trash.emoji, // Visual representation
            color: trash.color, // Item color
            x,
            y: -ITEM_SIZE, // Start above the screen
          },
        ];
      });
    };

    spawn();
    spawnIntervalRef.current = setInterval(spawn, SPAWN_INTERVAL);
    return () => clearInterval(spawnIntervalRef.current);
  }, [running]);

  /* ---------- GAME LOOP ---------- */

  // Main animation loop controlling trash falling movement
  useEffect(() => {
    if (!running || !mode) return;

    const update = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      setTrashItems((prev) =>
        prev
          .map((item) => ({
            ...item,
            // Move item downward unless it is being dragged
            y:
              item.id === draggingId
                ? item.y
                : item.y + GAME_MODES[mode].dropSpeed * (delta / 16),
          }))
          .filter((item) => {
            // Remove item if it falls below the screen
            if (item.y > GAME_HEIGHT) {
              setMisses((m) => m + 1);
              return false;
            }
            return true;
          })
      );

      animationRef.current = requestAnimationFrame(update);
    };

    animationRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationRef.current);
  }, [draggingId, running, mode]);

  /* ---------- GAME OVER CHECK ---------- */

  // End the game when miss limit is reached
  useEffect(() => {
    if (mode && misses >= GAME_MODES[mode].maxMisses) {
      setGameOver(true);
      stopGame();
    }
  }, [misses, mode]);

  /* ---------- BIN POSITIONS ---------- */

  // Calculate bin positions dynamically based on board width
  const bins = BINS.map((bin, index) => {
    const binWidth = GAME_WIDTH / BINS.length;
    return {
      ...bin,
      x: index * binWidth,
      y: GAME_HEIGHT - BIN_HEIGHT,
      width: binWidth,
      height: BIN_HEIGHT,
    };
  });

  /* ---------- COLLISION DETECTION ---------- */

  // Check if a trash item overlaps a bin
  const isOverBin = (item, bin) => {
    return (
      item.x + ITEM_SIZE > bin.x &&
      item.x < bin.x + bin.width &&
      item.y + ITEM_SIZE > bin.y &&
      item.y < bin.y + bin.height
    );
  };

  /* ---------- SAVE SCORE TO FIREBASE ---------- */

  // Save the player's score to Firestore leaderboard
  const saveScore = async () => {
    if (!playerName) return;

    try {
      await addDoc(collection(db, "leaderboard"), {
        name: playerName,
        score: score,
        mode: mode,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  /* ---------- DRAG HANDLERS ---------- */

  // Start dragging a trash item
  const handleMouseDown = (e, id) => {
    if (!running || gameOver) return;

    const rect = gameRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setTrashItems((prev) => {
      const item = prev.find((t) => t.id === id);
      if (!item) return prev;

      setDraggingId(id);
      setDragOffset({ x: mouseX - item.x, y: mouseY - item.y });
      return prev;
    });
  };

  // Update position while dragging
  const handleMouseMove = (e) => {
    if (!draggingId || !running) return;

    const rect = gameRef.current.getBoundingClientRect();

    setTrashItems((prev) =>
      prev.map((item) =>
        item.id === draggingId
          ? {
              ...item,
              x: e.clientX - rect.left - dragOffset.x,
              y: e.clientY - rect.top - dragOffset.y,
            }
          : item
      )
    );
  };

  // Drop item and check for correct bin
  const handleMouseUp = () => {
    if (!draggingId || !running) return;

    setTrashItems((prev) => {
      const item = prev.find((t) => t.id === draggingId);
      if (!item) return prev;

      let matched = false;

      for (const bin of bins) {
        if (isOverBin(item, bin)) {
          matched = true;
          bin.type === item.type
            ? setScore((s) => s + 1)
            : setMisses((m) => m + 1);
        }
      }

      setDraggingId(null);
      return matched ? prev.filter((t) => t.id !== item.id) : prev;
    });
  };

  /* ---------- UI RENDER ---------- */

  return (
    <div className="game-page">
      <h1>Trashfall {mode && `(${GAME_MODES[mode].label})`}</h1>

      <div className="hud">
        <span>Score: {score}</span>
        {mode && (
          <span>
            Misses: {misses}/{GAME_MODES[mode].maxMisses}
          </span>
        )}
      </div>

      <div
        ref={gameRef}
        className="game-board"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Render bins */}
        {bins.map((bin) => (
          <div
            key={bin.type}
            className="bin"
            style={{
              left: bin.x,
              top: bin.y,
              width: bin.width,
              height: bin.height,
              background: bin.color,
            }}
          >
            {bin.label}
          </div>
        ))}

        {/* Render falling trash items */}
        {trashItems.map((item) => (
          <div
            key={item.id}
            className="trash-item"
            onMouseDown={(e) => handleMouseDown(e, item.id)}
            style={{
              left: item.x,
              top: item.y,
              backgroundColor: item.color,
            }}
          >
            {item.emoji}
          </div>
        ))}

        {/* Difficulty selection dialog */}
        {showModeDialog && (
          <div className="dialog-overlay">
            <div className="dialog">
              <h2>Select Difficulty</h2>
              <button onClick={() => startGame("easy")}>Easy</button>
              <button onClick={() => startGame("medium")}>Medium</button>
              <button onClick={() => startGame("hard")}>Hard</button>
            </div>
          </div>
        )}

        {/* Game over dialog */}
        {gameOver && (
          <div className="dialog-overlay">
            <div className="dialog">
              <h2>Game Over</h2>
              <p>Final Score: {score}</p>

              <input
                placeholder="Your Name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />

              <button
                onClick={() => {
                  saveScore();
                  setShowModeDialog(true);
                }}
              >
                Save Score
              </button>

              <button onClick={() => navigate("/")}>Home</button>

              <button
                onClick={() => {
                  saveScore();
                  navigate("/");
                }}
              >
                Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
