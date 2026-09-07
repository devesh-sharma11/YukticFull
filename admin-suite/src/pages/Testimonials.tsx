import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

type Testimonial = {
  _id: string;
  feedbackId?: string;
  name: string;
  designation: string;
  avatar?: string;
  rating: number;
  testimonial: string;
  published: boolean;
  featured?: boolean;
  createdAt?: string;
};

export default function Testimonials() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Testimonial[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [testimonialToDelete, setTestimonialToDelete] =
    useState<Testimonial | null>(null);

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function loadTestimonials() {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/admin/testimonials`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: Testimonial[] = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteTestimonial() {
    if (!testimonialToDelete) return;

    try {
      const token = localStorage.getItem("token");

      await fetch(
        `${API}/admin/testimonials/${testimonialToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setItems((prev) =>
        prev.filter(
          (item) => item._id !== testimonialToDelete._id
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setTestimonialToDelete(null);
    }
  }

  async function togglePublish(item: Testimonial) {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API}/admin/testimonials/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...item,
          published: !item.published,
        }),
      });

      loadTestimonials();
    } catch (err) {
      console.error(err);
    }
  }

  async function markFeatured(item: Testimonial) {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API}/testimonials/${item._id}/feature`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      loadTestimonials();
    } catch (err) {
      console.error(err);
    }
  }

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const searchText =
        `${item.name} ${item.designation} ${item.testimonial}`.toLowerCase();

      const matchesSearch = searchText.includes(
        search.toLowerCase()
      );

      let matchesFilter = true;

      if (filter === "published") {
        matchesFilter = item.published;
      }

      if (filter === "draft") {
        matchesFilter = !item.published;
      }

      return matchesSearch && matchesFilter;
    });
  }, [items, search, filter]);

  return (
    <div
      className="relative"
      style={{
        fontFamily: "'Comfortaa', sans-serif",
      }}
    >

      {/* Background Decoration */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-32 w-96 h-96 bg-sky-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-[1600px] mx-auto">

        {/* =====================================================
            TOP HEADER
        ===================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">

          <div>
            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-blue-900 to-sky-500 flex items-center justify-center shadow-xl shadow-blue-500/20">

                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.7"
                    d="M7 8h10M7 12h6m8-1a8 8 0 11-16 0c0 1.38.35 2.68.96 3.81L5 20l4.2-1.68A8 8 0 0021 11z"
                  />
                </svg>

              </div>

              <div>
                <h1 className="text-3xl lg:text-4xl font-extrabold text-blue-950 tracking-tight">
                  Testimonials
                </h1>

                <p className="text-blue-700/60 text-sm mt-1">
                  Manage website testimonials.
                </p>
              </div>

            </div>
          </div>

          <button
            onClick={() =>
              navigate("/testimonials/create")
            }
            className="group flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-900 to-sky-500 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            <span className="text-xl leading-none group-hover:rotate-90 transition-transform duration-300">
              +
            </span>

            Create Testimonial
          </button>

        </div>

        {/* =====================================================
            SEARCH / FILTER BAR
        ===================================================== */}
        <div className="bg-white/75 backdrop-blur-xl border border-blue-100 rounded-[1.75rem] p-4 shadow-[0_15px_50px_rgba(59,130,246,0.07)] mb-8">

          <div className="flex flex-col md:flex-row gap-3">

            {/* Search */}
            <div className="relative flex-1">

              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-900 pointer-events-none">

                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m21 21-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

              </div>

              <input
                placeholder="Search testimonial..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full h-12 bg-blue-50/50 border border-blue-100 rounded-xl pl-11 pr-4 text-sm text-blue-950 placeholder:text-blue-300 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />

            </div>

            {/* Filter */}
            <div className="relative md:w-52">

              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value)
                }
                className="w-full h-12 appearance-none bg-blue-50/50 border border-blue-100 rounded-xl px-4 pr-10 text-sm font-medium text-blue-900 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
              >
                <option value="all">
                  All
                </option>

                <option value="published">
                  Published
                </option>

                <option value="draft">
                  Draft
                </option>
              </select>

              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m6 9 6 6 6-6"
                />
              </svg>

            </div>

          </div>

        </div>

        {/* =====================================================
            SECTION HEADING
        ===================================================== */}
        <div className="flex items-center justify-between mb-5 px-1">

          <div>
            <h2 className="text-lg font-bold text-blue-950">
              Client Feedback
            </h2>

            <p className="text-xs text-blue-600/90 mt-1">
              Customer experiences and published reviews.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm">

            <span className="w-2 h-2 rounded-full bg-blue-500" />

            <span className="text-xs font-bold text-blue-700">
              {filtered.length}{" "}
              {filtered.length === 1
                ? "Review"
                : "Reviews"}
            </span>

          </div>

        </div>

        {/* =====================================================
            TESTIMONIAL CARDS
        ===================================================== */}
        {loading ? (

          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-blue-100 p-16 text-center shadow-[0_20px_60px_rgba(59,130,246,0.07)]">

            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-900 rounded-full animate-spin mx-auto mb-5" />

            <p className="text-sm font-semibold text-blue-700/60">
              Loading testimonials...
            </p>

          </div>

        ) : filtered.length === 0 ? (

          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-blue-100 p-16 text-center shadow-[0_20px_60px_rgba(59,130,246,0.07)]">

            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5">

              <svg
                className="w-8 h-8 text-blue-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M7 8h10M7 12h6m8-1a8 8 0 11-16 0c0 1.38.35 2.68.96 3.81L5 20l4.2-1.68A8 8 0 0021 11z"
                />
              </svg>

            </div>

            <h3 className="font-bold text-blue-900">
              No testimonials found.
            </h3>

          </div>

        ) : (

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-stretch">

            {filtered.map((item) => (

              <div
                key={item._id}
                className="group relative bg-white/90 backdrop-blur-xl rounded-[2rem] border border-blue-100/80 shadow-[0_15px_50px_rgba(125,211,252,0.08)] hover:shadow-[0_20px_60px_rgba(125,211,252,0.16)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full"
              >

                {/* Top Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-900 via-sky-400 to-blue-500" />

                <div className="p-6 lg:p-7 flex flex-col flex-1">

                  {/* =================================================
                      CARD TOP
                  ================================================= */}
                  <div className="flex items-start justify-between gap-4 mb-6">

                    <div className="flex items-center gap-4">

                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-900 to-sky-500 text-white flex items-center justify-center font-bold uppercase text-base shadow-lg shadow-blue-500/20 shrink-0">
                        {item.avatar || "NA"}
                      </div>

                      <div className="min-w-0">

                        <h3 className="text-base font-bold text-blue-950 truncate">
                          {item.name}
                        </h3>

                        <p className="text-sm text-blue-600/60 mt-0.5 truncate">
                          {item.designation}
                        </p>

                      </div>

                    </div>

                    {/* Status */}
                    <div className="shrink-0">

                      {item.published ? (

                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wide">

                          <span className="w-1.5 h-1.5 rounded-full bg-blue-900" />

                          Published

                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wide">

                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />

                          Draft

                        </span>

                      )}

                    </div>

                  </div>

                  {/* =================================================
                      RATING
                  ================================================= */}
                  <div className="flex items-center justify-between mb-5">

                    <div className="flex items-center gap-1">

                      {[1, 2, 3, 4, 5].map((star) => (

                        <svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={
                            star <= item.rating
                              ? "#F59E0B"
                              : "#D9E2EC"
                          }
                          className="w-5 h-5"
                        >
                          <path d="M12 2l2.9 6.26 6.9.59-5.23 4.73 1.57 6.8L12 17.77 5.86 20.38l1.57-6.8L2.2 8.85l6.9-.59L12 2z" />
                        </svg>

                      ))}

                    </div>

                    {item.featured && (

                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-sm shadow-blue-500/20">
                        ★ Featured
                      </span>

                    )}

                  </div>

                  {/* =================================================
                      QUOTE
                  ================================================= */}
                  <div className="relative bg-gradient-to-br from-blue-50/80 via-white to-sky-50/60 border border-blue-100/70 rounded-2xl p-5 mb-6 max-h-[120px] overflow-y-auto">

                    <p className="text-sm text-blue-950/75 leading-7 pt-0">
                      {item.testimonial}
                    </p>

                  </div>

                  {/* =================================================
                      FOOTER
                  ================================================= */}
                  <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-blue-50">

                    <div>

                      <p className="text-[10px] uppercase tracking-widest font-bold text-blue-400">
                        Created
                      </p>

                      <p className="text-xs font-semibold text-blue-800/60 mt-1">
                        {item.createdAt
                          ? new Date(
                              item.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </p>

                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap justify-end gap-2">

                      {/* EDIT */}
                      <button
                        onClick={() =>
                          navigate(
                            `/testimonials/edit/${item._id}`
                          )
                        }
                        className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-all duration-200 text-xs font-bold"
                      >
                        Edit
                      </button>

                      {/* PUBLISH / UNPUBLISH */}
                      <button
                        onClick={() =>
                          togglePublish(item)
                        }
                        className={`px-3.5 py-2 rounded-xl text-white transition-all duration-200 text-xs font-bold ${
                          item.published
                            ? "bg-orange-500 hover:bg-orange-600"
                            : "bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20"
                        }`}
                      >
                        {item.published
                          ? "Unpublish"
                          : "Publish"}
                      </button>

                      {/* FEATURED */}
                      <button
                        onClick={() =>
                          markFeatured(item)
                        }
                        disabled={item.featured}
                        className={`px-3.5 py-2 rounded-xl transition-all duration-200 text-xs font-bold ${
                          item.featured
                            ? "bg-blue-600 text-white cursor-default"
                            : "bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100"
                        }`}
                      >
                        {item.featured
                          ? "★ Featured"
                          : "☆ Featured"}
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() =>
                          setTestimonialToDelete(item)
                        }
                        className="px-3.5 py-2 rounded-xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:border-red-200 transition-all duration-200 text-xs font-bold"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* =========================================================
          DELETE MODAL
      ========================================================= */}
      {testimonialToDelete && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/25 backdrop-blur-sm"
          onClick={() =>
            setTestimonialToDelete(null)
          }
        >

          <div
            className="w-full max-w-md bg-white rounded-[2rem] border border-blue-100 shadow-[0_30px_100px_rgba(30,64,175,0.2)] p-7"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-5">

              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-8 0h10"
                />
              </svg>

            </div>

            <h3 className="text-xl font-bold text-blue-950">
              Delete Testimonial?
            </h3>

            <p className="text-sm text-blue-700/60 mt-3 leading-relaxed">
              Are you sure you want to delete
              <br />
              <b className="text-blue-950">
                {testimonialToDelete.name}
              </b>
              ?
              <br />
              <br />
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-7">

              <button
                className="px-5 py-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition font-semibold text-sm"
                onClick={() =>
                  setTestimonialToDelete(null)
                }
              >
                Cancel
              </button>

              <button
                className="px-5 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition font-semibold text-sm shadow-sm shadow-red-500/20"
                onClick={deleteTestimonial}
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