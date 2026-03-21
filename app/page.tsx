"use client";

import React, { useState } from "react";

export default function Fundraiser() {
  const [raised, setRaised] = useState(6500);
  const goal = 10000;
  const [activeTab, setActiveTab] = useState(0);
  const [comments, setComments] = useState<string[]>([]);
  const [commentText, setCommentText] = useState("");

  const percent = Math.min((raised / goal) * 100, 100);

  const donate = () => {
    const val = prompt("Amount:");
    if (!val || isNaN(Number(val))) return;
    setRaised((prev) => prev + Number(val));
  };

  const donateFixed = (v: number) => {
    setRaised((prev) => prev + v);
  };

  const addComment = () => {
    if (!commentText) return;
    setComments((prev) => [...prev, commentText]);
    setCommentText("");
  };

  return (
    <div style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#f4f6f9", color: "#222", minHeight: "100vh" }}>
      <header style={{ background: "white", padding: "15px 30px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#28a745" }}>POLUTEK.PL</div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: "bold" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Log in
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>

          <div style={{ flex: "2 1 600px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)" }}>
              <img src="https://picsum.photos/1000/400" alt="Project" style={{ width: "100%", borderRadius: "12px" }} />
              <h2 style={{ marginTop: "20px" }}>About Project</h2>
              <p>This is a secret project. Support now to be part of something big.</p>
            </div>

            <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", gap: "5px", marginBottom: "20px" }}>
                <button
                  onClick={() => setActiveTab(0)}
                  style={{
                    padding: "10px 15px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    background: activeTab === 0 ? "#28a745" : "#ddd",
                    color: activeTab === 0 ? "white" : "#222",
                  }}
                >
                  Story
                </button>
                <button
                  onClick={() => setActiveTab(1)}
                  style={{
                    padding: "10px 15px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    background: activeTab === 1 ? "#28a745" : "#ddd",
                    color: activeTab === 1 ? "white" : "#222",
                  }}
                >
                  Updates
                </button>
                <button
                  onClick={() => setActiveTab(2)}
                  style={{
                    padding: "10px 15px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    background: activeTab === 2 ? "#28a745" : "#ddd",
                    color: activeTab === 2 ? "white" : "#222",
                  }}
                >
                  Comments
                </button>
              </div>

              <div>
                {activeTab === 0 && <p>Long story about the project.</p>}
                {activeTab === 1 && <p>No updates yet.</p>}
                {activeTab === 2 && (
                  <div>
                    <div>
                      {comments.map((c, i) => (
                        <div key={i} style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{c}</div>
                      ))}
                    </div>
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write comment"
                      style={{
                        width: "100%",
                        padding: "10px",
                        marginTop: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        boxSizing: "border-box",
                      }}
                    />
                    <button
                      onClick={addComment}
                      style={{
                        padding: "10px 20px",
                        marginTop: "10px",
                        background: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Add comment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)" }}>
              <h3 style={{ marginTop: 0 }}>Funding</h3>
              <div style={{ height: "10px", background: "#eee", borderRadius: "20px", overflow: "hidden", margin: "10px 0" }}>
                <div style={{ height: "100%", background: "#28a745", width: percent + "%", transition: "0.5s" }}></div>
              </div>
              <p><b>€{raised}</b> raised of €{goal}</p>
              <button
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginTop: "10px",
                }}
                onClick={donate}
              >
                Back this project
              </button>
            </div>

            <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)" }}>
              <h3 style={{ marginTop: 0 }}>Rewards</h3>

              <div style={{ border: "1px solid #eee", padding: "15px", borderRadius: "10px", marginBottom: "10px" }}>
                <b>€10</b>
                <p>Thank you email</p>
                <button
                  style={{ width: "100%", padding: "8px", background: "#28a745", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
                  onClick={() => donateFixed(10)}
                >
                  Select
                </button>
              </div>

              <div style={{ border: "1px solid #eee", padding: "15px", borderRadius: "10px", marginBottom: "10px" }}>
                <b>€50</b>
                <p>Early access</p>
                <button
                  style={{ width: "100%", padding: "8px", background: "#28a745", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
                  onClick={() => donateFixed(50)}
                >
                  Select
                </button>
              </div>

              <div style={{ border: "1px solid #eee", padding: "15px", borderRadius: "10px", marginBottom: "10px" }}>
                <b>€100</b>
                <p>VIP supporter</p>
                <button
                  style={{ width: "100%", padding: "8px", background: "#28a745", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
                  onClick={() => donateFixed(100)}
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
