import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface ImageItem {
    _id: string;
    original_name: string;
    uploaded_by: string;
    uploaded_at: string;
    url: string;
    usage_count: number;
    used_by: string[];
}

export default function ImageLibrary() {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const API_URL = import.meta.env.VITE_API_URL;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const loadImages = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/image-library`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setImages(res.data);
        } catch (error) {
            console.error("Failed to load images", error);
        }
    };

    useEffect(() => {
        loadImages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const uploadImage = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.post(
                `${API_URL}/image-library/upload`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            await loadImages();

            toast.success("Image uploaded successfully.");
        } catch (error: any) {
            console.error(error);

            const message =
                error.response?.data?.detail ||
                "Failed to upload image.";

            toast.error(message);
        }
    };

    const deleteImage = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;

        try {
            await axios.delete(
                `${API_URL}/image-library/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await loadImages();

            toast.success("Image deleted successfully.");
        } catch (error: any) {
            console.error(error);

            const message =
                error.response?.data?.detail ||
                "Failed to delete image.";

            toast.error(message);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.headerWrapper}>
                <h1 style={styles.title}>Image Library</h1>
            </div>

            {/* Upload Section */}
            <div style={styles.uploadCard}>
                <div style={styles.uploadControls}>
                    <label style={styles.fileLabel}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            style={styles.hiddenInput}
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        {file ? file.name : "Browse Files"}
                    </label>

                    <button
                        onClick={uploadImage}
                        style={{
                            ...styles.uploadButton,
                            opacity: file ? 1 : 0.6,
                            cursor: file ? "pointer" : "not-allowed"
                        }}
                        disabled={!file}
                    >
                        Upload Image
                    </button>
                </div>
            </div>

            {/* Image Grid */}
            {images.length === 0 ? (
                <div style={styles.emptyState}>
                    No images found in the library.
                </div>
            ) : (
                <div style={styles.grid}>
                    {images.map((img) => (
                        <div key={img._id} style={styles.card}>
                            <div style={styles.imageWrapper}>
                                <img
                                    src={`${API_URL}${img.url}`}
                                    alt={img.original_name}
                                    style={styles.image}
                                />
                            </div>

                            <div style={styles.cardBody}>
                                <p style={styles.metaText}>
                                    <span style={styles.metaLabel}>Filename:</span>{" "}
                                    <span style={{ wordBreak: "break-all" }}>
                                        {img.original_name}
                                    </span>
                                </p>

                                <p style={styles.metaText}>
                                    <span style={styles.metaLabel}>Uploaded By:</span>{" "}
                                    {img.uploaded_by}
                                </p>

                                <p style={styles.metaText}>
                                    <span style={styles.metaLabel}>Date:</span>{" "}
                                    {new Date(img.uploaded_at).toLocaleDateString(
                                        undefined,
                                        {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric"
                                        }
                                    )}
                                </p>

                                <p style={styles.metaText}>
                                    <span style={styles.metaLabel}>Usage Count:</span>{" "}
                                    <span style={styles.badge}>
                                        {img.usage_count}
                                    </span>
                                </p>

                                <div style={styles.caseStudySection}>
                                    <span style={styles.metaLabel}>
                                        Linked Case Studies:
                                    </span>

                                    {img.used_by.length === 0 ? (
                                        <p style={styles.mutedText}>
                                            Not Currently Used
                                        </p>
                                    ) : (
                                        <ul style={styles.tagList}>
                                            {img.used_by.map((item) => (
                                                <li key={item} style={styles.tag}>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <button
                                    onClick={() => deleteImage(img._id)}
                                    style={styles.deleteButton}
                                >
                                    Delete Image
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------
// Styles
// ---------------------------------------------------------
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: "40px",
        fontFamily: "'Comfortaa', sans-serif",
        backgroundColor: "#f3f9ff",
        minHeight: "100vh",
        color: "#2d3748",
    },

    headerWrapper: {
        marginBottom: "24px",
    },

    title: {
        margin: 0,
        fontSize: "28px",
        fontWeight: 700,
        color: "#1976a8",
    },

    uploadCard: {
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
        border: "1px solid #e1edf7",
        marginBottom: "32px",
    },

    uploadControls: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap",
    },

    hiddenInput: {
        display: "none",
    },

    fileLabel: {
        padding: "10px 20px",
        backgroundColor: "#eef7ff",
        border: "1px dashed #6baed6",
        borderRadius: "8px",
        color: "#1976a8",
        fontWeight: 600,
        cursor: "pointer",
        display: "inline-block",
        transition: "background-color 0.2s",
    },

    uploadButton: {
        padding: "12px 24px",
        backgroundColor: "#1976a8",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontWeight: 600,
        fontSize: "14px",
        boxShadow: "0 2px 4px rgba(25, 118, 168, 0.2)",
        transition: "transform 0.1s, opacity 0.2s",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "24px",
    },

    card: {
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
        border: "1px solid #e1edf7",
        display: "flex",
        flexDirection: "column",
    },

    imageWrapper: {
        height: "180px",
        width: "100%",
        backgroundColor: "#f5faff",
        borderBottom: "1px solid #e1edf7",
    },

    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
    },

    cardBody: {
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        flexGrow: 1,
    },

    metaText: {
        margin: 0,
        fontSize: "14px",
        color: "#4a5568",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    metaLabel: {
        fontWeight: 600,
        color: "#2d3748",
    },

    badge: {
        backgroundColor: "#e4f3fc",
        color: "#1976a8",
        padding: "2px 8px",
        borderRadius: "12px",
        fontWeight: 600,
        fontSize: "12px",
    },

    caseStudySection: {
        marginTop: "10px",
        paddingTop: "10px",
        borderTop: "1px dashed #e1edf7",
    },

    mutedText: {
        margin: "6px 0 0 0",
        fontSize: "13px",
        color: "#a0aec0",
        fontStyle: "italic",
    },

    tagList: {
        listStyle: "none",
        padding: 0,
        margin: "8px 0 0 0",
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
    },

    tag: {
        backgroundColor: "#edf2f7",
        color: "#4a5568",
        fontSize: "12px",
        padding: "4px 8px",
        borderRadius: "6px",
        fontWeight: 500,
    },

    deleteButton: {
        marginTop: "auto",
        alignSelf: "flex-end",
        backgroundColor: "transparent",
        color: "#e53e3e",
        border: "1px solid #fc8181",
        padding: "8px 16px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "13px",
        transition: "all 0.2s",
    },

    emptyState: {
        textAlign: "center",
        padding: "60px",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        color: "#718096",
        border: "1px dashed #cbd5e0",
    }
};