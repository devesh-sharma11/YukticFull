
import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

interface CaseStudy {
  title: string;
  subtitle: string;
  slug: string;
  featured?: boolean;
  project_summary?: {
    region?: string;
    organisation?: string;
    service_types?: string[];
  };
}

export default function ListEditCaseStudy() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  // State for delete confirmation modal updated to hold the full object
  const [studyToDelete, setStudyToDelete] = useState<CaseStudy | null>(null);

  const makeFeatured = async (slug: string) => {
    try {
      await API.put(`/case-studies/${slug}/feature`);
      fetchCaseStudies();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const res = await API.get("/case-studies");
      console.log("Fetched Data:", res.data);
      setCaseStudies(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!studyToDelete) return;

    try {
      await API.delete(`/case-studies/${studyToDelete.slug}`);

      // Remove the deleted study from the local state to update the UI
      setCaseStudies(prev =>
        prev.filter(
          study => study.slug !== studyToDelete.slug
        )
      );
    } catch (err) {
      console.error("Delete Error:", err);
    } finally {
      setStudyToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <p
          className="text-center text-lg font-semibold"
          style={{
            color: "#3b82c4",
            fontFamily: "'Comfortaa', sans-serif"
          }}
        >
          Loading Article...
        </p>
      </div>
    );
  }

  return (
    <div
      className="app-container"
      style={{
        padding: "0px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "'Comfortaa', sans-serif"
      }}
    >
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&display=swap');

      /* ── GRID LAYOUT ────────────────────────────────────────────── */
      .related-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 24px;
        margin-top: 36px;
      }

      /* ── CARD CONTAINER ─────────────────────────────────────────── */
      .rel-card {
        background: #ffffff;
        border: 1px solid #E2E8F0;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        transition: box-shadow 0.2s ease, transform 0.2s ease;
        display: flex;
        flex-direction: column;
        height: 100%;
        font-family: 'Comfortaa', sans-serif;
      }

      .rel-card:hover {
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
        transform: translateY(-4px);
      }

      /* Thick light blue line at the top */
      .rel-stripe {
        height: 8px;
        background: #3b82c4;
        width: 100%;
      }

      .rel-body {
        padding: 24px;
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      /* ── BADGES ─────────────────────────────────────────────────── */
      .rel-meta {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 16px;
      }

      .rmc {
        font-family: 'Comfortaa', sans-serif;
        font-size: 0.75rem;
        font-weight: 700;
        padding: 6px 14px;
        border-radius: 20px;
      }

      /* Light Blue Badge ("Case Study") */
      .rmc-opt,
      .rmc-db {
        background: #e6f3ff;
        color: #3b82c4;
      }

      /* Blue Badge ("Global", "GB United Kingdom", etc.) */
      .rmc-loc {
        background: #24577f;
        color: #ffffff;
      }

      /* ── TYPOGRAPHY ─────────────────────────────────────────────── */
      .rel-title {
        font-family: 'Comfortaa', sans-serif;
        font-size: 1.25rem;
        font-weight: 600;
        color: #163b5c;
        margin: 0 0 8px 0;
        line-height: 1.4;
      }

      .rel-org {
        font-family: 'Comfortaa', sans-serif;
        font-size: 0.75rem;
        color: #3b82c4;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin: 0 0 12px 0;
      }

      .rel-excerpt {
        font-family: 'Comfortaa', sans-serif;
        font-size: 0.95rem;
        color: #5a6e7d;
        line-height: 1.6;
        margin: 0;

        /* Limits excerpt to 3 lines and adds '...' at the end */
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      /* ── FOOTER & LINK ──────────────────────────────────────────── */
      .rel-foot {
        padding: 16px 24px;
        border-top: 1px solid #F1F5F9;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #ffffff;
        margin-top: auto;
      }

      .rel-link {
        font-family: 'Comfortaa', sans-serif;
        font-size: 0.9rem;
        font-weight: 700;
        color: #163b5c;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: color 0.18s ease, gap 0.18s ease;
        text-decoration: none;
      }

      .rel-link:hover {
        color: #3b82c4;
        gap: 10px;
      }

      .delete-btn-text {
        background: transparent;
        border: none;
        color: #E64013;
        font-family: 'Comfortaa', sans-serif;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        padding: 6px 0;
        transition: opacity 0.2s;
      }

      .delete-btn-text:hover {
        opacity: 0.7;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        justify-content: center;
        font-family: 'Comfortaa', sans-serif;
        font-size: .875rem;
        font-weight: 600;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        border: none;
        transition: all .18s;
        text-decoration: none;
      }

      .btn-outline {
        background: transparent;
        color: #3b82c4;
        border: 1.5px solid #E2E8F0;
      }

      .btn-outline:hover {
        background: #e6f3ff;
      }

      /* ── RESPONSIVE GRID ADJUSTMENTS ────────────────────────────── */
      @media (max-width: 1024px) {
        .related-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 768px) {
        .related-grid {
          grid-template-columns: minmax(0, 1fr);
        }
      }

      /* ── STANDARDIZED MODAL STYLES ──────────────────────────────── */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(20, 60, 90, 0.6);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: flex-start;
        padding-top: 200px;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.2s ease-out;
        font-family: 'Comfortaa', sans-serif;
      }

      .modal-content {
        background: white;
        padding: 32px;
        border-radius: 20px;
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        animation: slideUp 0.3s ease-out;
      }

      .modal-title {
        margin: 0 0 12px 0;
        color: #24577f;
        font-size: 1.5rem;
        font-family: 'Comfortaa', sans-serif;
        font-weight: 700;
      }

      .modal-text {
        color: #4b5563;
        margin-bottom: 24px;
        line-height: 1.5;
        font-family: 'Comfortaa', sans-serif;
      }

      .modal-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
      }

      .btn-cancel {
        background: #f3f4f6;
        color: #374151;
        border: none;
        padding: 12px 24px;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        font-family: 'Comfortaa', sans-serif;
      }

      .btn-cancel:hover {
        background: #e5e7eb;
      }

      .btn-delete-modal {
        background: #dc2626;
        color: #ffffff;
        border: none;
        padding: 12px 24px;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        font-family: 'Comfortaa', sans-serif;
      }

      .btn-delete-modal:hover {
        background: #b91c1c;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      `}</style>

      <div style={{ marginBottom: "40px" }}>
        <h1
          style={{
            fontSize: "2.4rem",
            color: "#163b5c",
            marginBottom: "8px",
            fontFamily: "'Comfortaa', sans-serif",
            fontWeight: 700
          }}
        >
          Published Article
        </h1>
      </div>

      <div className="related-grid">
        {caseStudies.length === 0 ? (
          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              minHeight: "53vh",
            }}
          >
            <p
              style={{
                textAlign: "center",
                color: "#5a7d98",
                fontFamily: "'Comfortaa', sans-serif",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              No Article Found
            </p>
          </div>
        ) : (
          caseStudies.map((study, index) => (
            <div
              key={`${study.slug}-${index}`}
              className="rel-card"
            >
              <div className="rel-stripe"></div>

              <div className="rel-body">
                <div className="rel-meta">
                  <span className="rmc rmc-opt">
                    Article
                  </span>

                  <span className="rmc rmc-loc">
                    {study.project_summary?.region || "Global"}
                  </span>
                </div>

                <h3 className="rel-title">
                  {study.title}
                </h3>

                <p className="rel-org">
                  {study.project_summary?.organisation || study.slug}
                </p>

                <p className="rel-excerpt">
                  {study.subtitle}
                </p>
              </div>

              <div className="rel-foot">
                <button
                  className="delete-btn-text"
                  onClick={() => setStudyToDelete(study)}
                >
                  Delete
                </button>

                <button
                  onClick={() => makeFeatured(study.slug)}
                  style={{
                    background: study.featured
                      ? "#3b82c4"
                      : "#e6f3ff",
                    color: study.featured
                      ? "#fff"
                      : "#3b82c4",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontFamily: "'Comfortaa', sans-serif"
                  }}
                >
                  {study.featured ? "★ Featured" : "Make Featured"}
                </button>

                <Link
                  to={`/edit-case-study/${study.slug}`}
                  className="btn btn-outline"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── CUSTOM CONFIRMATION MODAL ──────────────────────────── */}
      {studyToDelete && (
        <div
          className="modal-overlay"
          onClick={() => setStudyToDelete(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="modal-title">
              Delete Article?
            </h3>

            <p className="modal-text">
              Are you sure you want to delete the Article "
              <b>{studyToDelete.title}</b>"?
              This action cannot be undone.
            </p>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setStudyToDelete(null)}
              >
                Cancel
              </button>

              <button
                className="btn-delete-modal"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

