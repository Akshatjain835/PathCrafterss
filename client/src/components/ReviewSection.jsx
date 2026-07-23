import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star, Send, User } from "lucide-react";
import api from "@/features/auth/authAPI"

export default function ReviewSection({ cityId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch reviews on mount
  useEffect(() => {
    fetchReviews();
  }, [cityId]);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/api/reviews/${cityId}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Submission
  const handleSubmit = async () => {
    if (rating === 0 || !comment.trim()) {
      alert("Please provide a rating and a comment.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post(
        `/api/reviews/${cityId}`,
        {
          rating,
          comment,
          tags: rating > 3 ? ["Recommended"] : ["Mixed Feelings"],
        },
        {
          withCredentials: true,
        },
      );
      console.log("Review posted:", res.data);
      // Build safe review object for instant UI update
      const newReview = {
        ...res.data,
        userName: res.data.userName || res.data.user?.name || "You",
        createdAt: res.data.createdAt || new Date().toISOString(),
      };

      // Instant UI update
      setReviews((prev) => [newReview, ...prev]);

      // Reset form
      setComment("");
      setRating(0);
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Failed to post review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h3
        style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}
      >
        What Travelers Say
      </h3>

      {/* Input Form */}
      <div
        style={{
          border: "1px solid #eee",
          padding: "20px",
          borderRadius: "16px",
          backgroundColor: "#f9f9f9",
          marginBottom: "30px",
        }}
      >
        <p style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: 600 }}>
          Rate your visit
        </p>

        {/* Simple Star Selector */}
        <div style={{ display: "flex", gap: "5px", marginBottom: "15px" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={24}
              onClick={() => setRating(star)}
              style={{ cursor: "pointer" }}
              fill={star <= rating ? "#FFD700" : "none"}
              color={star <= rating ? "#FFD700" : "#ccc"}
            />
          ))}
        </div>

        <textarea
          placeholder="Share your experience (crowds, food, vibes)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{
            width: "100%",
            height: "80px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "14px",
            marginBottom: "12px",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            backgroundColor: "#007AFF",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          <Send size={16} /> {isSubmitting ? "Posting..." : "Post Review"}
        </button>
      </div>

      {/* Review List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p style={{ color: "#888", textAlign: "center" }}>
            No reviews yet. Be the first!
          </p>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev._id}
              style={{
                borderBottom: "1px solid #eee",
                paddingBottom: "15px",
                display: "flex",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "20px",
                  backgroundColor: "#eee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#888",
                }}
              >
                <User size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: "bold", fontSize: "15px" }}>
                    {rev.userName}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "#FFD700",
                      fontSize: "13px",
                    }}
                  >
                    <Star size={14} fill="#FFD700" /> {rev.rating}
                  </div>
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#444",
                    marginTop: "6px",
                    lineHeight: "1.4",
                  }}
                >
                  {rev.comment}
                </p>
                <span style={{ fontSize: "11px", color: "#aaa" }}>
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
