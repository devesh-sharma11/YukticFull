


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
interface Feedback {
  _id: string;
  name?: string;
  orgName?: string;
  org2?: string;
  projectName?: string;
  services?: string[];
  ratings?: {
    overall?: number;
    [key: string]: number | undefined;
  };
  nps?: number;
  impact?: string;
  workedWell?: string;
  recommendation?: string;
  createdAt?: string;
}

// Define the types of deletion actions available
type DeleteAction = 
  | { type: "SINGLE"; id: string; name: string }
  | { type: "ALL" }
  | { type: "MARKED" }; // <-- Added new type

const modalStyles = `

 
  @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');

 .modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(17, 42, 30, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: flex-start;
padding-top: 200px;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease-out;
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

  .modal-title { margin: 0 0 12px 0; color: #1a4d2e; font-size: 1.5rem; font-weight: bold; }
  .modal-text { color: #4b5563; margin-bottom: 24px; line-height: 1.5; }
  .modal-actions { display: flex; gap: 12px; justify-content: center; }
  
  .btn-cancel {
    background: #f3f4f6; color: #374151; border: none; padding: 12px 24px;
    border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;
  }
  .btn-cancel:hover { background: #e5e7eb; }
  
  .btn-delete-modal {
    background: #dc2626; color: #ffffff; border: none; padding: 12px 24px;
    border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;
  }
  .btn-delete-modal:hover { background: #b91c1c; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`;

export default function FeedbackResponses() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State to control the custom modal
  const [deleteAction, setDeleteAction] = useState<DeleteAction | null>(null);
  
  // State to track selected (marked) items
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const reloadFeedbacks = async () => {
  try {
    const res = await API.get("/feedback");

    setFeedbacks(
      Array.isArray(res.data)
        ? res.data.sort(
            (a, b) =>
              new Date(b.createdAt || "").getTime() -
              new Date(a.createdAt || "").getTime()
          )
        : []
    );
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  const loadFeedbacks = async () => {
    try {
      const res = await API.get("/feedback");

      setFeedbacks(
  Array.isArray(res.data)
    ? res.data.sort(
        (a, b) =>
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
      )
    : []
);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  loadFeedbacks();
}, []);

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };


  
  // Unified execution function for all deletion types
  const executeDelete = async () => {
    if (!deleteAction) return;

    try {
      if (deleteAction.type === "SINGLE") {
        await API.delete(
            `/feedback/${deleteAction.id}`
          );
        setFeedbacks((prev) => prev.filter((item) => item._id !== deleteAction.id));
        
        // Remove from selected if it was marked
        if (selectedIds.has(deleteAction.id)) toggleSelection(deleteAction.id);
        
      } else if (deleteAction.type === "MARKED") {
        // Run concurrent delete requests for all selected items
        const deletePromises =
          Array.from(selectedIds).map((id) =>
            API.delete(`/feedback/${id}`)
          );
        await Promise.all(deletePromises);
        
        // Update UI
        setFeedbacks((prev) => prev.filter((item) => !selectedIds.has(item._id)));
        setSelectedIds(new Set()); // Clear selections

      } else if (deleteAction.type === "ALL") {
          await API.delete("/feedback");

          setSelectedIds(new Set());
          reloadFeedbacks();
}
    } catch (error) {
      console.error("Deletion failed:", error);
    } finally {
      setDeleteAction(null); // Close modal after success or failure
    }
  };


  const exportFeedbackExcel = async () => {
  try {
    const response = await API.get(
      "/export/feedback",
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link =
      document.createElement("a");

    link.href = url;
    link.setAttribute(
      "download",
      "feedback.xlsx"
    );

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error(
      "Export failed",
      error
    );
  }
};

  // Helper to determine modal text based on action
  const getModalContent = () => {
    switch (deleteAction?.type) {
      case "SINGLE":
        return {
          title: "Delete Feedback?",
          text: (
            <>
              Are you sure you want to delete the feedback from <b>{deleteAction.name}</b>? This action cannot be undone.
            </>
          ),
        };
      case "MARKED":
        return {
          title: `Delete ${selectedIds.size} Marked Items?`,
          text: `Are you sure you want to permanently delete the ${selectedIds.size} selected feedback responses? This action cannot be undone.`,
        };
      
      
      case "ALL":
        return {
          title: "Delete ALL Feedback?",
          text: "WARNING: Are you sure you want to permanently delete ALL feedback responses? This action cannot be undone.",
        };
      default:
        return { title: "", text: "" };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
  <p className="text-center text-lg font-semibold text-[#56685E]">
    Loading Feedback Responses...
  </p>
  </div>
    );
  }

  const modalContent = getModalContent();

  return (
    <>
      <style>{modalStyles}</style>

      {/* Custom Confirmation Modal */}
      {deleteAction && (
        <div className="modal-overlay" onClick={() => setDeleteAction(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{modalContent.title}</h3>
            <p className="modal-text">{modalContent.text}</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteAction(null)}>
                Cancel
              </button>
              <button className="btn-delete-modal" onClick={executeDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

<div className="flex flex-wrap items-center justify-between mb-10 gap-4">
  <h1
    className="text-[2.4rem] font-bold text-[#0F2318]"
    style={{
      fontFamily: "'Comfortaa', sans-serif"
    }}
  >
    Feedback Responses
  </h1>

  {feedbacks.length > 0 && (
  <div className="flex flex-wrap gap-3">

    <button
    onClick={exportFeedbackExcel}
    className="px-5 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
  >
    Export Excel
  </button>

    {selectedIds.size > 0 && (
      <button
        onClick={() => setDeleteAction({ type: "MARKED" })}
        className="px-5 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
      >
        Delete Marked ({selectedIds.size})
      </button>
    )}

    <button
      onClick={() => setDeleteAction({ type: "ALL" })}
      className="px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
    >
      Delete All
    </button>

  </div>
)}
         {feedbacks.length === 0 && (
  <div className="flex items-center justify-center min-h-[60vh] w-full">
    <p
      className="text-center text-lg font-semibold text-[#56685E]"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      No feedback responses found.
    </p>
  </div>
)}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {feedbacks.map((item) => {
            const previewText = item.impact || item.workedWell || item.recommendation || "No detailed written feedback provided.";
            const displayOrg = item.orgName || item.org2 || "No Organisation";
            const isSelected = selectedIds.has(item._id);

            return (
              <div
  key={item._id}
  className={`min-w-[360px] flex flex-col overflow-hidden rounded-[20px] border bg-white shadow-sm hover:shadow-xl transition-all duration-300 ${
    isSelected
      ? "border-purple-500 ring-2 ring-purple-100"
      : "border-[#E5E7EB]"
  }`}
>
                {/* Top Accent Bar */}
                <div className={`h-[8px] flex-shrink-0 ${isSelected ? 'bg-purple-500' : 'bg-[#2A6049]'}`} />

                {/* Content */}
                <div className="p-8 flex-grow">
                  
                  {/* Badge & Checkbox */}
                  <div className="flex justify-between items-center w-full">
                    <div className="inline-flex items-center rounded-full bg-[#EEF5F1] px-5 py-2 text-sm font-semibold text-[#2A6049]">
                      Feedback
                    </div>
                    {/* Checkbox for Marking */}
                    <input 
                      type="checkbox"
                      className="w-5 h-5 cursor-pointer accent-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      checked={isSelected}
                      onChange={() => toggleSelection(item._id)}
                    />
                  </div>

                  {/* Ratings Row */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.ratings?.overall ? (
                      <div className="inline-flex items-center rounded-full bg-[#13261D] px-4 py-2 text-sm font-bold text-white shadow-sm">
                        ⭐ {item.ratings.overall}/5 Overall
                      </div>
                    ) : null}

                    {item.nps !== null && item.nps !== undefined ? (
                      <div className="inline-flex items-center rounded-full bg-[#E64013] px-4 py-2 text-sm font-bold text-white shadow-sm">
                        NPS: {item.nps}/10
                      </div>
                    ) : null}
                  </div>

                  {/* Name */}
                  <h2 className="mt-6 text-[30px] font-bold text-[#0F2318] leading-tight line-clamp-2">
                    {item.name || "Anonymous User"}
                  </h2>

                  {/* Organisation */}
                  <div className="mt-3 text-[#3D8A68] font-bold uppercase tracking-wide text-[13px]">
                    {displayOrg}
                  </div>

                  {/* Extra Project/Service Details */}
                  {(item.projectName || (item.services && item.services.length > 0)) && (
                    <div className="mt-4 bg-[#F8FAF9] p-4 rounded-xl text-sm text-[#56685E] border border-[#D7E7DF]">
                      {item.projectName && (
                        <div className="mb-1">
                          <span className="font-bold text-[#2A6049]">Project:</span> {item.projectName}
                        </div>
                      )}
                      {item.services && item.services.length > 0 && (
                        <div className="truncate">
                          <span className="font-bold text-[#2A6049]">Services:</span> {item.services.join(", ")}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Feedback Preview */}
                  <p className="mt-6 text-[16px] leading-relaxed text-[#5B6F65] line-clamp-3">
                    "{previewText}"
                  </p>
                </div>

                {/* Footer */}
                <div className="border-t border-[#E5E7EB] px-8 py-6 flex items-center justify-between bg-[#FDFDFD] flex-shrink-0">
                  <button
                    onClick={() => setDeleteAction({ type: "SINGLE", id: item._id, name: item.name || "Anonymous User" })}
                    className="text-red-600 font-semibold hover:text-red-800"
                  >
                    Delete
                  </button>

                  <Link
                    to={`/feedback-responses/${item._id}`}
                    className="font-bold text-[#2A6049] hover:text-[#E64013] transition flex items-center gap-2"
                  >
                    Read Full
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                </div>
              </div>
              
            );
          })}
         
        </div>
      </div>
    </>
  );
}