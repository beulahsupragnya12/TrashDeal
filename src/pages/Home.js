import { useNavigate } from "react-router-dom";
import { useState } from "react";
import binGuideData from "../trashdata/BinGuide";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [showBinGuide, setShowBinGuide] = useState(false);

  return (
    <div className="home-container">
      <button
        className="board board-left"
        onClick={() => navigate("/leaderboard")}
      />

      <button
        className="board board-center"
        onClick={() => navigate("/play")}
      />

      <button
        className="board board-right"
        onClick={() => setShowBinGuide(true)}
      />

      {/* BIN GUIDE DIALOG */}
      {showBinGuide && (
        <div className="dialog-overlay">
          <div className="dialog bin-guide-dialog">
            <h2>Recycling Guide</h2>
            <p>Learn what goes in which bin</p>

            <div className="bin-guide-list">
              {binGuideData.map((bin) => (
                <div
                  key={bin.type}
                  className="bin-card"
                  style={{ background: bin.color }}
                >
                  <h3>{bin.name}</h3>
                  <p>{bin.description}</p>

                  <div className="examples">
                    {bin.examples.map((item, i) => (
                      <span key={i}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setShowBinGuide(false)}> Home Page</button>
          </div>
        </div>
      )}
    </div>
  );
}
