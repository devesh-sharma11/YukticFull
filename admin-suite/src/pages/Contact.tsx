import { useEffect, useState } from "react";

import API from "../services/api";

interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  organisation: string;
  email: string;
  phone?: string;
  service: string;
  overview: string;
  additional?: string;
  status?: string;
  submittedAt?: string;
  jobTitle?: string;
  contactMethod?: string;
  orgType?: string;
  orgSize?: string;
  stage?: string;
  timescale?: string;
  platform?: string;
  source?: string;
  buttonSource?: string;
}

const styles = `
  .admin-dashboard {
    font-family: 'Comfortaa', sans-serif;
    background-color: #f4f9ff;
    min-height: auto;
    padding: 15px;
    color: #102f4d;
  }
  
  .dashboard-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: 32px;
    height: calc(100vh - 180px);
  }

  .header-title {
    font-size: 2rem;
    font-weight: 400;
    color: #155b8a;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .badge-count {
    background: #155b8a;
    color: white;
    padding: 4px 12px;
    border-radius: 99px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .left-sidebar {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .contact-list-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
    padding-right: 8px;
    flex: 1;
    min-height: 0;
  }

  .contact-list-container::-webkit-scrollbar { width: 6px; }
  .contact-list-container::-webkit-scrollbar-track { background: transparent; }
  .contact-list-container::-webkit-scrollbar-thumb { background: #c9e3f4; border-radius: 4px; }

  .contact-card {
    background: #ffffff;
    border: 2px solid transparent;
    border-radius: 16px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    box-shadow: 0 4px 6px -1px rgba(21, 91, 138, 0.05);
  }

  .contact-card:hover {
    background: #e8f4fc;
    border-color: #c9e3f4;
    transform: translateY(-2px);
  }

  .contact-card.active {
    background: #ffffff;
    border-color: #155b8a;
    box-shadow: 0 10px 15px -3px rgba(21, 91, 138, 0.1);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .card-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: #102f4d;
    margin: 0;
  }

  .card-date {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
  }

  .card-org {
    font-size: 0.9rem;
    color: #4b5563;
    margin: 0 0 12px 0;
  }

  .tag-service {
    display: inline-block;
    background: #e8f4fc;
    color: #155b8a;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid #c9e3f4;
  }

  .details-panel {
    background: #ffffff;
    border-radius: 24px;
    padding: 40px;
    box-shadow: 0 10px 30px -5px rgba(21, 91, 138, 0.08);
    border: 1px solid #edf5fb;
    overflow-y: auto;
  }

  .details-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid #e8f4fc;
    padding-bottom: 24px;
    margin-bottom: 32px;
  }

  .details-name {
    font-size: 2rem;
    font-weight: 800;
    color: #155b8a;
    margin: 0 0 8px 0;
    letter-spacing: -0.02em;
  }

  .details-email {
    font-size: 1rem;
    color: #6b7280;
    margin: 0;
  }

  .btn-delete {
    background: #dc2626;
    color: #ffffff;
    border: none;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.2);
  }

  .btn-delete:hover {
    background: #b91c1c;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px -1px rgba(220, 38, 38, 0.3);
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 32px;
  }

  .info-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .info-label {
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #7f9bb0;
  }

  .info-value {
    font-size: 1rem;
    color: #102f4d;
    font-weight: 500;
    background: #f7fbfe;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1px solid #e8f4fc;
  }

  .overview-section {
    background: #155b8a;
    color: white;
    padding: 32px;
    border-radius: 16px;
    margin-top: 32px;
  }

  .overview-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0 16px 0;
    color: #e8f4fc;
  }

  .overview-text {
    font-size: 1.05rem;
    line-height: 1.7;
    opacity: 0.95;
    margin: 0;
  }

  .additional-section {
    background: #fdfdfd;
    border: 1px dashed #c9e3f4;
    padding: 24px;
    border-radius: 16px;
    margin-top: 24px;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #7f9bb0;
    text-align: center;
    padding: 40px 20px;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 16px;
    opacity: 0.5;
  }

   .modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(16, 47, 77, 0.6);
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

  .modal-title {
    margin: 0 0 12px 0;
    color: #155b8a;
    font-size: 1.5rem;
  }

  .modal-text {
    color: #4b5563;
    margin-bottom: 24px;
    line-height: 1.5;
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
  }

  .btn-cancel:hover {
    background: #e5e7eb;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
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
  
  .spinner {
    border: 3px solid rgba(21, 91, 138, 0.1);
    border-left-color: #155b8a;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
    margin: 20px auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* =========================================
     MOBILE & TABLET RESPONSIVENESS
     ========================================= */
  @media (max-width: 1024px) {
    .dashboard-wrapper {
      grid-template-columns: 1fr;
      height: auto;
      gap: 24px;
    }

    .left-sidebar {
      max-height: 500px;
    }
  }

  @media (max-width: 768px) {
    .admin-dashboard {
      padding: 16px;
    }

    .details-panel {
      padding: 24px;
    }

    .details-header {
      flex-direction: column;
      gap: 16px;
    }

    .btn-delete {
      width: 100%;
      justify-content: center;
    }

    .info-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .overview-section {
      padding: 24px;
    }
  }
`;

export default function Contact() {
  const [contacts, setContacts] =
    useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [deleteAllModal, setDeleteAllModal] =
    useState(false);

  const confirmDeleteAll = async () => {
    try {
      await API.delete("/admin/contact");

      setContacts([]);
      setSelected(null);

    } catch (error) {
      console.error(error);
    } finally {
      setDeleteAllModal(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const response =
        await API.get("/admin/contact");

      setContacts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const confirmDelete = async () => {
    if (!contactToDelete) return;
    const id = contactToDelete._id;

    try {
      const response =
        await API.delete(
          `/admin/contact/${id}`
        );

      const result = response.data;

      if (result.success) {
        setContacts((prev) => prev.filter((item) => item._id !== id));
        if (selected?._id === id) {
          setSelected(null);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setContactToDelete(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  const handleSelectContact = (contact: Contact) => {
    setSelected(contact);

    // Smooth scroll to details panel on mobile/tablet devices
    if (window.innerWidth <= 1024) {
      setTimeout(() => {
        document.getElementById('mobile-details-view')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const exportContactsExcel = async () => {
    try {
      const response = await API.get(
        "/export/contact",
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
      link.download = "contacts.xlsx";

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

  return (
    <>
      <style>{styles}</style>
      
      {contactToDelete && (
        <div
          className="modal-overlay"
          onClick={() => setContactToDelete(null)}
        >
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="modal-title">Delete Request?</h3>

            <p className="modal-text">
              Are you sure you want to delete the inquiry from{" "}
              <b>
                {contactToDelete.firstName} {contactToDelete.lastName}
              </b>
              ? This action cannot be undone.
            </p>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setContactToDelete(null)}
              >
                Cancel
              </button>

              <button
                className="btn-delete"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteAllModal && (
        <div
          className="modal-overlay"
          onClick={() => setDeleteAllModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="modal-title">
              Delete ALL Contacts?
            </h3>

            <p className="modal-text">
              WARNING: Are you sure you want to permanently
              delete all contact inquiries? This action
              cannot be undone.
            </p>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setDeleteAllModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn-delete"
                onClick={confirmDeleteAll}
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-dashboard">
        <div className="dashboard-wrapper">
          
          <div className="left-sidebar">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <h2 className="header-title" style={{ marginBottom: 0 }}>
                Inquiries Received

                <span className="badge-count">
                  {contacts.length}
                </span>
              </h2>

              {contacts.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={exportContactsExcel}
                    style={{
                      background: "#2479b8",
                      color: "#fff",
                      border: "none",
                      padding: "10px 18px",
                      borderRadius: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Export Excel
                  </button>

                  <button
                    onClick={() => setDeleteAllModal(true)}
                    style={{
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      padding: "10px 18px",
                      borderRadius: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Delete All
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div
                style={{
                  flex: 1,
                  minHeight: "300px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className="spinner"></div>
              </div>
            ) : contacts.length === 0 ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  color: "#607d94",
                  fontFamily: "'Comfortaa', sans-serif",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                No Contacts Found
              </div>
            ) : (
              <div className="contact-list-container">
                {contacts.map((contact) => (
                  <div
                    key={contact._id}
                    onClick={() => handleSelectContact(contact)}
                    className={`contact-card ${
                      selected?._id === contact._id ? "active" : ""
                    }`}
                  >
                    <div className="card-header">
                      <h4 className="card-name">
                        {contact.firstName} {contact.lastName}
                      </h4>

                      <span className="card-date">
                        {formatDate(contact.submittedAt)}
                      </span>
                    </div>

                    <p className="card-org">
                      🏢 {contact.organisation || "No Organisation"}
                    </p>

                    <span className="tag-service">
                      {contact.service}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className="details-panel"
            id="mobile-details-view"
          >
            {!selected ? (
              <div className="empty-state">
                <div className="empty-icon">✉️</div>

                <h3>Select an inquiry</h3>

                <p>
                  Choose a contact request from the list to view details.
                </p>
              </div>
            ) : (
              <div className="details-content fade-in">
                <div className="details-header">
                  <div>
                    <h2 className="details-name">
                      {selected.firstName} {selected.lastName}
                    </h2>

                    <p className="details-email">
                      {selected.email}
                    </p>
                  </div>

                  <button
                    onClick={() => setContactToDelete(selected)}
                    className="btn-delete"
                  >
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>

                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>

                    Delete
                  </button>
                </div>

                {selected.buttonSource && (
                  <div
                    style={{
                      background: "#edf7fd",
                      border: "2px solid #155b8a",
                      borderRadius: "14px",
                      padding: "18px",
                      marginBottom: "28px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#58758b",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        marginBottom: "10px",
                      }}
                    >
                      Lead Source
                    </div>

                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#155b8a",
                      }}
                    >
                      {selected.buttonSource}
                    </div>
                  </div>
                )}

                <div className="info-grid">
                  <div className="info-group">
                    <span className="info-label">Organisation</span>

                    <span className="info-value">
                      {selected.organisation || "-"}
                    </span>
                  </div>

                  <div className="info-group">
                    <span className="info-label">Phone</span>

                    <span className="info-value">
                      {selected.phone || "-"}
                    </span>
                  </div>

                  <div className="info-group">
                    <span className="info-label">Job Title</span>

                    <span className="info-value">
                      {selected.jobTitle || "-"}
                    </span>
                  </div>

                  <div className="info-group">
                    <span className="info-label">Preferred Contact</span>

                    <span className="info-value">
                      {selected.contactMethod || "-"}
                    </span>
                  </div>

                  <div className="info-group">
                    <span className="info-label">Service Required</span>

                    <span
                      className="info-value"
                      style={{
                        color: "#155b8a",
                        fontWeight: 700
                      }}
                    >
                      {selected.service}
                    </span>
                  </div>

                  <div className="info-group">
                    <span className="info-label">Current Stage</span>

                    <span className="info-value">
                      {selected.stage || "-"}
                    </span>
                  </div>

                  <div className="info-group">
                    <span className="info-label">Timescale</span>

                    <span className="info-value">
                      {selected.timescale || "-"}
                    </span>
                  </div>

                  <div className="info-group">
                    <span className="info-label">Platform</span>

                    <span className="info-value">
                      {selected.platform || "-"}
                    </span>
                  </div>

                  <div className="info-group">
                    <span className="info-label">Organisation Type</span>

                    <span className="info-value">
                      {selected.orgType || "-"}
                    </span>
                  </div>

                  <div className="info-group">
                    <span className="info-label">Organisation Size</span>

                    <span className="info-value">
                      {selected.orgSize || "-"}
                    </span>
                  </div>

                  <div className="info-group">
                    <span className="info-label">Source / Referral</span>

                    <span className="info-value">
                      {selected.source || "-"}
                    </span>
                  </div>
                </div>

                <div className="overview-section">
                  <h3 className="overview-title">
                    Project Overview
                  </h3>

                  <p className="overview-text">
                    {selected.overview}
                  </p>
                </div>

                {selected.additional && (
                  <div className="additional-section">
                    <span
                      className="info-label"
                      style={{
                        marginBottom: "12px",
                        display: "block"
                      }}
                    >
                      Additional Information
                    </span>

                    <p
                      style={{
                        margin: 0,
                        color: "#4b5563",
                        lineHeight: 1.6
                      }}
                    >
                      {selected.additional}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </>
  );
}