import React, { useEffect, useState } from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

type TestimonialForm = {
  feedbackId?: string;

  name: string;

  designation: string;

  avatar: string;

  rating: number;

  testimonial: string;

  published: boolean;
};

export default function CreateTestimonial() {
  const navigate = useNavigate();

  const location = useLocation();

  const { id } = useParams();

  const feedback = location.state?.feedback;

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [pageTitle, setPageTitle] =
    useState("Create Testimonial");

  const [form, setForm] = useState<TestimonialForm>({
    feedbackId: "",

    name: "",

    designation: "",

    avatar: "",

    rating: 5,

    testimonial: "",

    published: false,
  });

  useEffect(() => {
    if (id) {
      setPageTitle("Edit Testimonial");

      loadTestimonial();
    } else if (feedback) {
      setPageTitle("Review Client Testimonial");

      setForm({
        feedbackId: feedback._id,

        // Submitted Name
        name: feedback.name || "",

        // Job Title
        designation: feedback.title || "",

        // Avatar initials
        avatar:
          (feedback.avatar ||
            feedback.name ||
            "")
            .split(" ")
            .map((x: string) => x.charAt(0))
            .join("")
            .substring(0, 2)
            .toUpperCase(),

        // Overall Experience
        rating:
          feedback.ratings?.overall || 5,

        // Provided Recommendation
        testimonial:
          feedback.recommendation || "",

        published: false,
      });
    }
  }, []);

  async function loadTestimonial() {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `${API}/admin/testimonials/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await res.json();

      setForm(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const target = e.target;

    const name = target.name;
    const value = target.value;

    setForm((prev) => ({
      ...prev,
      [name]:
        target instanceof HTMLInputElement &&
        target.type === "checkbox"
          ? target.checked
          : value,
    }));
  }

  function setRating(star: number) {
    setForm((prev) => ({
      ...prev,
      rating: star,
    }));
  }

  async function saveTestimonial(
    publish = false
  ) {
    try {
      setSaving(true);

      const token =
        localStorage.getItem("token");

      const payload = {
        ...form,
        published: publish,
      };

      let url =
        `${API}/testimonials`;

      let method = "POST";

      if (id) {
        url =
          `${API}/admin/testimonials/${id}`;

        method = "PUT";
      }

      await fetch(url, {
        method,

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },

        body:
          JSON.stringify(payload),
      });

      navigate("/testimonials");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div
        className="p-10"
        style={{
          fontFamily: "'Comfortaa', sans-serif",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className="max-w-5xl mx-auto p-8"
      style={{
        fontFamily: "'Comfortaa', sans-serif",
      }}
    >
      <h1 className="text-3xl font-bold text-[#155E9E]">
        {pageTitle}
      </h1>

      <p className="text-gray-500 mt-2">
        Review and publish the client's testimonial.
      </p>

      {/* ============================
          CLIENT DETAILS
      ============================ */}

      <div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm">

        <div className="px-8 py-5 border-b bg-[#F0F7FC] rounded-t-2xl">

          <h2 className="text-xl font-semibold text-[#155E9E]">
            Client Details
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Review or edit the client information before publishing.
          </p>

        </div>

        <div className="p-8 space-y-6">

          {/* Client Name */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Client Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Mr Jack Soudant"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#155E9E] focus:outline-none"
            />

          </div>

          {/* Designation */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Designation
            </label>

            <input
              type="text"
              name="designation"
              value={form.designation}
              onChange={handleChange}
              placeholder="Ambulatory Specialist / Team Lead, Maastricht UMC+"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#155E9E] focus:outline-none"
            />

          </div>

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Avatar Initials
            </label>

            <input
              type="text"
              name="avatar"
              maxLength={2}
              value={form.avatar}
              onChange={handleChange}
              placeholder="JS"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#155E9E] focus:outline-none"
            />

            <p className="text-xs text-gray-500 mt-2">
              Example: JS, JK, KP
            </p>

          </div>

        </div>

      </div>

      {/* ============================
              RATING
      ============================ */}

      <div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm">

        <div className="px-8 py-5 border-b bg-[#F0F7FC] rounded-t-2xl">

          <h2 className="text-xl font-semibold text-[#155E9E]">
            Rating
          </h2>

        </div>

        <div className="p-8 flex justify-center">

          <div className="flex gap-2">

            {[1, 2, 3, 4, 5].map((star) => (

              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
              >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={
                    star <= form.rating
                      ? "#E64013"
                      : "#D1D5DB"
                  }
                  className="w-10 h-10 hover:scale-110 transition"
                >

                  <path d="M12 2l2.9 6.26 6.9.59-5.23 4.73 1.57 6.8L12 17.77 5.86 20.38l1.57-6.8L2.2 8.85l6.9-.59L12 2z" />

                </svg>

              </button>

            ))}

          </div>

        </div>

      </div>

      {/* ============================
          ORIGINAL FEEDBACK
      ============================ */}

      {feedback && (

        <div className="mt-8 bg-[#FFF8F6] border border-[#F3C7B8] rounded-2xl">

          <div className="px-8 py-5 border-b border-[#F3C7B8]">

            <h2 className="text-xl font-semibold text-[#E64013]">
              Original Client Testimonial
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              This is what the client originally submitted.
            </p>

          </div>

          <div className="p-8">

            <p className="whitespace-pre-wrap leading-8 text-gray-700">
              {feedback.data?.recommendation}
            </p>

          </div>

        </div>

      )}

      {/* ============================
          TESTIMONIAL
      ============================ */}

      <div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm">

        <div className="px-8 py-5 border-b bg-[#F0F7FC] rounded-t-2xl">

          <h2 className="text-xl font-semibold text-[#155E9E]">
            Website Testimonial
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Edit the text exactly how it should appear on the website.
          </p>

        </div>

        <div className="p-8">

          <textarea
            rows={12}
            name="testimonial"
            value={form.testimonial}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-5 py-4 resize-none focus:ring-2 focus:ring-[#155E9E] focus:outline-none"
            placeholder="Client testimonial..."
          />

        </div>

      </div>

      {/* ============================
          LIVE PREVIEW
      ============================ */}

      <div className="mt-8">

        <h2 className="text-xl font-bold text-[#155E9E] mb-5">
          Live Preview
        </h2>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">

          {/* Stars */}

          <div className="flex gap-1 mb-6">

            {[1, 2, 3, 4, 5].map((star) => (

              <svg
                key={star}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={
                  star <= form.rating
                    ? "#E64013"
                    : "#D1D5DB"
                }
                className="w-6 h-6"
              >

                <path d="M12 2l2.9 6.26 6.9.59-5.23 4.73 1.57 6.8L12 17.77 5.86 20.38l1.57-6.8L2.2 8.85l6.9-.59L12 2z" />

              </svg>

            ))}

          </div>

          {/* Testimonial */}

          <p className="text-gray-700 leading-8 whitespace-pre-wrap">
            {form.testimonial ||
              "Your testimonial preview will appear here..."}
          </p>

          <div className="border-t mt-8 pt-6 flex items-center gap-4">

            <div className="w-14 h-14 rounded-full bg-[#E8F3FA] flex items-center justify-center text-[#155E9E] font-bold text-xl">

              {form.avatar || "NA"}

            </div>

            <div>

              <h3 className="font-bold text-[#1F2937] text-xl">
                {form.name || "Client Name"}
              </h3>

              <p className="text-gray-500">
                {form.designation ||
                  "Designation"}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ============================
            ACTION BUTTONS
      ============================ */}

      <div className="mt-10 flex justify-end gap-4">

        <button
          type="button"
          onClick={() =>
            navigate("/testimonials")
          }
          className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={() =>
            saveTestimonial(false)
          }
          className="px-6 py-3 rounded-xl bg-gray-700 text-white hover:bg-gray-800"
        >
          {saving
            ? "Saving..."
            : "Save Draft"}
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={() =>
            saveTestimonial(true)
          }
          className="px-6 py-3 rounded-xl bg-[#155E9E] text-white hover:bg-[#104A7D]"
        >
          {saving
            ? "Publishing..."
            : "Publish"}
        </button>

      </div>

    </div>
  );
}