import { useEffect, useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Globe,
  BriefcaseBusiness,
  ExternalLink,
  ArrowRight,
  MessageSquare,
  X,
  Send,
  SendIcon,
  Lock,
  Link2,
  Activity,
  Mail,
  Users,
  FileText,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import GoogleMail from "../assets/google-mail.png";
import { FaLinkedinIn } from "react-icons/fa";
import API from "../services/api";
import { Link } from "react-router-dom";

const generateMessage = (
  name: string,
  organisation: string
) => `Dear ${name},
Thank you for the opportunity to work with you and your organisation, ${organisation}.
At YUTIC, we are committed to delivering high-quality consultancy and exceptional client service. Your feedback helps us understand what we have done well and where we can continue to improve.
We would be grateful if you could take a moment to complete our feedback form using the personalised link below. The questionnaire contains a small number of questions and typically takes less than two minutes to complete.
Your comments will be reviewed personally and will help shape how we continue to support our clients.
If you have any questions, please feel free to reply directly to this email.
Thank you once again for your time and for the opportunity to work with you.
Kind regards,
Shailesh Bansal
Founder/Director
YUTIC Limited
`;

interface NotificationItem {
  _id: string;
  url: string;
  title: string;
  message: string;
}

const Dashboard = () => {
  const [caseStudyCount, setCaseStudyCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [testimonialCount, setTestimonialCount] = useState(0);
  const [jobPublishedCount, setJobPublishedCount] = useState(0);

  const [notifications, setNotifications] = useState<
    NotificationItem[]
  >([]);

  // Modal & Form States
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [organisationName, setOrganisationName] = useState("");

  const [emailMessage, setEmailMessage] = useState(
    generateMessage("", "")
  );

  const [isMessageEdited, setIsMessageEdited] =
    useState(false);

  const [previousClientName, setPreviousClientName] =
    useState("");

  const [previousOrganisation, setPreviousOrganisation] =
    useState("");

  const [emailSubject, setEmailSubject] = useState(
    "Yuktic values your Feedback"
  );

  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const isValidEmail =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail);

  const isFormValid =
    clientName.trim() !== "" &&
    organisationName.trim() !== "" &&
    isValidEmail;

  /* ============================================================
     FETCH NOTIFICATIONS
  ============================================================ */

  useEffect(() => {
    API.get("/notifications")
      .then((res) => {
        setNotifications(res.data);
      })
      .catch(console.error);
  }, []);

  /* ============================================================
     FETCH TESTIMONIALS
  ============================================================ */

  useEffect(() => {
    API.get("/testimonials")
      .then((res) => {
        setTestimonialCount(res.data.length);
      })
      .catch(console.error);
  }, []);

  /* ============================================================
     FETCH PUBLISHED JOBS
  ============================================================ */

  useEffect(() => {
    API.get("/jobs")
      .then((res) => {
        setJobPublishedCount(res.data.length);
      })
      .catch(console.error);
  }, []);

  /* ============================================================
     AUTO GENERATE MESSAGE
  ============================================================ */

  useEffect(() => {
    if (!isMessageEdited) {
      setEmailMessage(
        generateMessage(
          clientName,
          organisationName
        )
      );
    } else {
      setEmailMessage((prev) =>
        prev
          .replace(previousClientName, clientName)
          .replace(
            previousOrganisation,
            organisationName
          )
      );
    }

    setPreviousClientName(clientName);
    setPreviousOrganisation(organisationName);
  }, [clientName, organisationName]);

  /* ============================================================
     FETCH FEEDBACK
  ============================================================ */

  useEffect(() => {
    API.get("/feedback")
      .then((res) => {
        setFeedbackCount(res.data.length);
      })
      .catch(console.error);
  }, []);

  /* ============================================================
     FETCH CONTACTS
  ============================================================ */

  useEffect(() => {
    API.get("/admin/contact")
      .then((res) => {
        setContactCount(res.data.length);
      })
      .catch(console.error);
  }, []);

  /* ============================================================
     ESCAPE TO CLOSE MODAL
  ============================================================ */

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsShareModalOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      listener
    );

    return () => {
      window.removeEventListener(
        "keydown",
        listener
      );
    };
  }, []);

  /* ============================================================
     CTRL + ENTER SEND
  ============================================================ */

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (
        e.ctrlKey &&
        e.key === "Enter" &&
        isShareModalOpen &&
        isFormValid
      ) {
        handleSendEmail();
      }
    };

    window.addEventListener(
      "keydown",
      listener
    );

    return () => {
      window.removeEventListener(
        "keydown",
        listener
      );
    };
  }, [
    clientEmail,
    isShareModalOpen,
    isValidEmail,
  ]);

  /* ============================================================
     FETCH CASE STUDIES
  ============================================================ */

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const res = await API.get(
          "/case-studies"
        );

        setCaseStudyCount(res.data.length);
      } catch (err) {
        console.error(
          "Error fetching case studies for dashboard:",
          err
        );
      }
    };

    fetchCaseStudies();
  }, []);

  /* ============================================================
     MARK ALL NOTIFICATIONS AS READ
  ============================================================ */

  const markAllAsRead = async () => {
    try {
      await API.delete("/notifications");

      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  /* ============================================================
     SEND EMAIL
  ============================================================ */

  const handleSendEmail = async () => {
    if (!isFormValid) return;

    setSending(true);

    try {
      await API.post(
        "/feedback/send-request",
        {
          email: clientEmail,
          subject: emailSubject,
          message: emailMessage,
        }
      );

      setSuccessMessage(
        "Feedback request sent successfully."
      );

      setShowSuccess(true);

      setClientName("");
      setOrganisationName("");
      setClientEmail("");

      setEmailSubject(
        "Yuktic values your Feedback"
      );

      setEmailMessage(
        generateMessage("", "")
      );

      setIsMessageEdited(false);

      setTimeout(() => {
        setShowSuccess(false);
        setIsShareModalOpen(false);
      }, 2500);
    } catch (err) {
      console.error(err);

      alert(
        "Failed to send feedback request."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* =======================================================
          CONTENT
      ======================================================= */}

      <div className="relative z-10 mx-auto w-full max-w-[1450px] px-4 py-0 sm:px-6 lg:px-0">

        {/* =====================================================
            METRICS
        ===================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

          {/* CASE STUDIES */}

          <div className="group relative overflow-hidden rounded-[26px] border border-[#dcecf5] bg-white p-6 shadow-[0_12px_35px_rgba(21,92,132,0.07)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(21,92,132,0.12)]">

            <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[100px] bg-[#e8f7ff]" />

            <div className="relative z-10 flex items-start justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f7ff] text-[#1683c4]">
                <FileText size={21} />
              </div>

              <span className="rounded-full bg-[#eaf8f1] px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#1b9b61]">
                Live
              </span>

            </div>

            <div className="relative z-10 mt-8">

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7d91a2]">
                Published Case Studies
              </p>

              <div className="mt-2 flex items-end gap-3">

                <h2
                  className="text-5xl font-black tracking-tight text-[#116b9e]"
                  style={{
                    fontFamily:
                      "'Comfortaa', sans-serif",
                  }}
                >
                  {caseStudyCount}
                </h2>

                <span className="mb-2 text-xs font-semibold text-[#92a3b1]">
                  published
                </span>

              </div>

            </div>

            <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#1683c4] transition-all duration-500 group-hover:w-full" />

          </div>

          {/* FEEDBACK */}

          <div className="group relative overflow-hidden rounded-[26px] border border-[#dcefe7] bg-white p-6 shadow-[0_12px_35px_rgba(27,155,97,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(27,155,97,0.11)]">

            <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[100px] bg-[#ebf9f2]" />

            <div className="relative z-10 flex items-start justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eaf8f1] text-[#1b9b61]">
                <MessageSquare size={21} />
              </div>

              <span className="rounded-full bg-[#eaf8f1] px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#1b9b61]">
                Clients
              </span>

            </div>

            <div className="relative z-10 mt-8">

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7d91a2]">
                Total Feedback Responses
              </p>

              <div className="mt-2 flex items-end gap-3">

                <h2
                  className="text-5xl font-black tracking-tight text-[#188354]"
                  style={{
                    fontFamily:
                      "'Comfortaa', sans-serif",
                  }}
                >
                  {feedbackCount}
                </h2>

                <span className="mb-2 text-xs font-semibold text-[#92a3b1]">
                  responses
                </span>

              </div>

            </div>

            <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#1b9b61] transition-all duration-500 group-hover:w-full" />

          </div>

          {/* TESTIMONIALS */}

          <div className="group relative overflow-hidden rounded-[26px] border border-[#dce7f6] bg-white p-6 shadow-[0_12px_35px_rgba(28,92,150,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(28,92,150,0.11)]">

            <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[100px] bg-[#edf5ff]" />

            <div className="relative z-10 flex items-start justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf5ff] text-[#377fc0]">
                <Sparkles size={21} />
              </div>

              <span className="rounded-full bg-[#edf5ff] px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#377fc0]">
                Published
              </span>

            </div>

            <div className="relative z-10 mt-8">

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7d91a2]">
                Published Testimonials
              </p>

              <div className="mt-2 flex items-end gap-3">

                <h2
                  className="text-5xl font-black tracking-tight text-[#377fc0]"
                  style={{
                    fontFamily:
                      "'Comfortaa', sans-serif",
                  }}
                >
                  {testimonialCount}
                </h2>

                <span className="mb-2 text-xs font-semibold text-[#92a3b1]">
                  live
                </span>

              </div>

            </div>

            <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#377fc0] transition-all duration-500 group-hover:w-full" />

          </div>

          {/* JOBS */}

          <div className="group relative overflow-hidden rounded-[26px] border border-[#dcecf5] bg-white p-6 shadow-[0_12px_35px_rgba(21,92,132,0.07)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(21,92,132,0.12)]">

            <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[100px] bg-[#e8f7ff]" />

            <div className="relative z-10 flex items-start justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f7ff] text-[#1683c4]">
                <BriefcaseBusiness size={21} />
              </div>

              <span className="rounded-full bg-[#eaf8f1] px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#1b9b61]">
                Live
              </span>

            </div>

            <div className="relative z-10 mt-8">

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7d91a2]">
                Published Jobs
              </p>

              <div className="mt-2 flex items-end gap-3">

                <h2
                  className="text-5xl font-black tracking-tight text-[#116b9e]"
                  style={{
                    fontFamily:
                      "'Comfortaa', sans-serif",
                  }}
                >
                  {jobPublishedCount}
                </h2>

                <span className="mb-2 text-xs font-semibold text-[#92a3b1]">
                  published
                </span>

              </div>

            </div>

            <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#1683c4] transition-all duration-500 group-hover:w-full" />

          </div>

          {/* CONTACTS */}

          <div className="group relative overflow-hidden rounded-[26px] border border-[#dcecf5] bg-[#116b9e] p-6 shadow-[0_15px_40px_rgba(17,107,158,0.16)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(17,107,158,0.22)]">

            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-[18px] border-white/10" />

            <div className="absolute bottom-0 right-0 h-32 w-32 rounded-tl-full bg-[#1b9b61]/20" />

            <div className="relative z-10 flex items-start justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                <Users size={21} />
              </div>

              <span className="rounded-full bg-white/15 px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white">
                Secure
              </span>

            </div>

            <div className="relative z-10 mt-8">

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/65">
                Total Website Contacts
              </p>

              <div className="mt-2 flex items-end gap-3">

                <h2
                  className="text-5xl font-black tracking-tight text-white"
                  style={{
                    fontFamily:
                      "'Comfortaa', sans-serif",
                  }}
                >
                  {contactCount}
                </h2>

                <span className="mb-2 text-xs font-semibold text-white/60">
                  enquiries
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            LOWER SECTION
        ===================================================== */}

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_0.85fr]">

          {/* ===================================================
              FEEDBACK CENTRE
          =================================================== */}

          <div className="relative overflow-hidden rounded-[30px] border border-[#dbeaf2] bg-white shadow-[0_15px_45px_rgba(28,78,110,0.07)]">

            <div className="absolute left-0 top-0 h-full w-1.5 bg-[#1683c4]" />

            <div className="relative p-6 sm:p-8">

              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

                <div className="max-w-md">

                  <div className="mb-4 flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eaf6fd] text-[#1683c4]">
                      <MessageSquare size={20} />
                    </div>

                    <div>

                      <h2
                        className="mt-1 text-xl font-black text-[#102a43]"
                        style={{
                          fontFamily:
                            "'Comfortaa', sans-serif",
                        }}
                      >
                        Feedback Centre
                      </h2>

                    </div>

                  </div>

                  <p className="text-sm leading-6 text-[#667d91]">
                    Manage your feedback journey
                    from sending invitations to
                    reviewing client responses.
                  </p>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">

                {/* LIVE FORM */}

                <a
                  href={`${import.meta.env.VITE_WEBSITE_URL}/feedback`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-2xl border border-[#dcebf3] bg-[#f8fcfe] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#9ed4ed] hover:bg-white hover:shadow-[0_12px_30px_rgba(22,131,196,0.10)]"
                >

                  <div className="flex items-center justify-between">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6f5fc] text-[#1683c4]">
                      <Globe size={18} />
                    </div>

                    <ExternalLink
                      size={16}
                      className="text-[#9bb0bf] transition-all group-hover:text-[#1683c4]"
                    />

                  </div>

                  <h3 className="mt-5 text-sm font-extrabold text-[#173b54]">
                    Live Form
                  </h3>

                  <p className="mt-1 text-[10px] font-medium text-[#7890a2]">
                    Open client-facing form
                  </p>

                  <div className="mt-5 flex items-center gap-1 text-[10px] font-bold text-[#1683c4]">
                    Open form
                    <ChevronRight size={13} />
                  </div>

                </a>

                {/* SEND REQUEST */}

                <button
                  onClick={() =>
                    setIsShareModalOpen(true)
                  }
                  className="group relative overflow-hidden rounded-2xl bg-[#1683c4] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-[#116b9e] hover:shadow-[0_15px_35px_rgba(22,131,196,0.25)]"
                >

                  <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-150" />

                  <div className="relative z-10 flex items-center justify-between">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white">
                      <SendIcon size={18} />
                    </div>

                    <ArrowRight
                      size={17}
                      className="text-white/70 transition-all group-hover:translate-x-1 group-hover:text-white"
                    />

                  </div>

                  <h3 className="relative z-10 mt-5 text-sm font-extrabold text-white">
                    Send Request
                  </h3>

                  <p className="relative z-10 mt-1 text-[10px] font-medium text-white/65">
                    Email feedback invitation
                  </p>

                  <div className="relative z-10 mt-5 text-[10px] font-bold text-white">
                    Create invitation →
                  </div>

                </button>

              </div>

            </div>

          </div>

          {/* ===================================================
              NOTIFICATIONS
          =================================================== */}

          <div className="relative overflow-hidden rounded-[30px] border border-[#dbeaf2] bg-white shadow-[0_15px_45px_rgba(28,78,110,0.07)]">

            <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-[#eaf7ff]" />

            <div className="relative p-6 sm:p-8">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <div className="flex items-center gap-2">

                  </div>

                  <h2
                    className="mt-2 text-xl font-black text-[#102a43]"
                    style={{
                      fontFamily:
                        "'Comfortaa', sans-serif",
                    }}
                  >
                    Notifications
                  </h2>

                  <p className="mt-1 text-[11px] text-[#8194a4]">
                    Recent updates and actions
                  </p>

                </div>

                <button
                  onClick={markAllAsRead}
                  className="rounded-xl border border-[#dcebf3] bg-[#f8fbfd] px-3 py-2 text-[9px] font-extrabold uppercase tracking-wider text-[#1683c4] transition-all hover:border-[#a9d5e9] hover:bg-[#eaf6fc]"
                >
                  Clear all
                </button>

              </div>

              <div className="mt-6 h-[250px] overflow-y-auto pr-1 custom-scrollbar">

                {notifications.length === 0 ? (

                  <div className="flex h-full flex-col items-center justify-center">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0f7fa]">

                      <CheckCircle2
                        size={24}
                        className="text-[#1b9b61]"
                      />

                    </div>

                    <p className="mt-4 text-sm font-bold text-[#506b7d]">
                      You're all caught up
                    </p>

                    <p className="mt-1 text-[10px] text-[#9aabb8]">
                      No new notifications
                    </p>

                  </div>

                ) : (

                  <div className="space-y-3">

                    {notifications.map(
                      (item) => (

                        <Link
                          key={item._id}
                          to={item.url}
                          onClick={async () => {
                            try {
                              await API.delete(
                                `/notifications/${item._id}`
                              );

                              setNotifications(
                                (prev) =>
                                  prev.filter(
                                    (n) =>
                                      n._id !==
                                      item._id
                                  )
                              );
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className="group flex gap-3 rounded-2xl border border-[#e6eef3] bg-[#fbfdfe] p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#acd9ec] hover:bg-white hover:shadow-[0_10px_25px_rgba(22,131,196,0.08)]"
                        >

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f6fd] text-[#1683c4] transition-colors group-hover:bg-[#1683c4] group-hover:text-white">

                            <CheckCircle2 size={18} />

                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="flex items-center justify-between gap-2">

                              <h3 className="truncate text-xs font-extrabold text-[#294b61]">
                                {item.title}
                              </h3>

                              <span className="shrink-0 rounded-full bg-[#eaf8f1] px-2 py-1 text-[8px] font-extrabold uppercase tracking-wider text-[#1b9b61]">
                                New
                              </span>

                            </div>

                            <p className="mt-1 truncate text-[10px] leading-5 text-[#8195a5]">
                              {item.message}
                            </p>

                          </div>

                        </Link>

                      )
                    )}

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            SOCIAL / WEBSITE STRIP
        ===================================================== */}

      </div>

      {/* =========================================================
          EMAIL MODAL
      ========================================================= */}

      {isShareModalOpen && (

        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#123047]/25 p-3 backdrop-blur-md sm:p-5 lg:p-8">

          {/* Background */}

          <div className="pointer-events-none absolute inset-0 overflow-hidden">

            <div className="absolute -left-32 -top-32 h-[400px] w-[400px] rounded-full bg-[#bce9ff]/40 blur-3xl" />

            <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-[#bcefd7]/40 blur-3xl" />

          </div>

          {/* MAIN WINDOW */}

          <div className="relative z-10 flex h-full max-h-[94vh] w-full max-w-[1250px] flex-col overflow-hidden rounded-[30px] border border-white/80 bg-[#f8fbfd] shadow-[0_35px_100px_rgba(16,61,87,0.28)] animate-in zoom-in-95 duration-300">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="relative shrink-0 border-b border-[#dfebf1] bg-white px-5 py-4 sm:px-7">

              <div className="flex items-center justify-between gap-4">

                <div className="flex min-w-0 items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e9f6fc]">

                    <img
                      src={GoogleMail}
                      alt="Mail Logo"
                      className="h-7 w-7 object-contain"
                    />

                  </div>

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-2">

                      <h2
                        className="truncate text-base font-black text-[#173b54] sm:text-lg"
                        style={{
                          fontFamily:
                            "'Comfortaa', sans-serif",
                        }}
                      >
                        Feedback Invitation
                      </h2>

                      <span className="rounded-full bg-[#eaf8f1] px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-wider text-[#1b9b61]">
                        Microsoft 365
                      </span>

                    </div>

                    <p className="mt-1 text-[10px] text-[#8195a5]">
                      Compose and securely send a
                      client feedback request
                    </p>

                  </div>

                </div>

                <div className="flex shrink-0 items-center gap-2">

                  <div className="hidden items-center gap-2 rounded-xl bg-[#eaf8f1] px-3 py-2 md:flex">

                    <ShieldCheck
                      size={14}
                      className="text-[#1b9b61]"
                    />

                    <span className="text-[9px] font-bold text-[#1b9b61]">
                      Verified
                    </span>

                  </div>

                  <div className="hidden items-center gap-2 rounded-xl bg-[#eaf6fc] px-3 py-2 md:flex">

                    <Lock
                      size={13}
                      className="text-[#1683c4]"
                    />

                    <span className="text-[9px] font-bold text-[#1683c4]">
                      TLS
                    </span>

                  </div>

                  <button
                    onClick={() =>
                      setIsShareModalOpen(false)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e0eaf0] bg-white text-[#668093] transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                  >
                    <X size={18} />
                  </button>

                </div>

              </div>

            </div>

            {/* =================================================
                BODY
            ================================================= */}

            <div className="flex-1 overflow-y-auto custom-scrollbar">

              <div className="grid min-h-full grid-cols-1 lg:grid-cols-[0.8fr_1.2fr]">

                {/* =============================================
                    LEFT
                ============================================= */}

                <div className="border-b border-[#e0ebf0] bg-[#f3f8fb] p-5 sm:p-7 lg:border-b-0 lg:border-r">

                  <div className="mb-7">

                    <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#1683c4]">
                      Recipient details
                    </p>

                    <h3
                      className="mt-2 text-xl font-black text-[#173b54]"
                      style={{
                        fontFamily:
                          "'Comfortaa', sans-serif",
                      }}
                    >
                      Who are you sending to?
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-[#8195a5]">
                      Add the client information
                      below. The message will
                      automatically personalise
                      itself.
                    </p>

                  </div>

                  <div className="space-y-5">

                    {/* CLIENT NAME */}

                    <div>

                      <label className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#718899]">
                        Client Name *
                      </label>

                      <input
                        type="text"
                        autoFocus
                        value={clientName}
                        onChange={(e) =>
                          setClientName(
                            e.target.value
                          )
                        }
                        placeholder="John Smith"
                        className="mt-2 h-12 w-full rounded-xl border border-[#d5e3ea] bg-white px-4 text-sm font-medium text-[#294b61] outline-none transition-all placeholder:text-[#a4b2bd] focus:border-[#1683c4] focus:ring-4 focus:ring-[#1683c4]/10"
                      />

                    </div>

                    {/* ORGANISATION */}

                    <div>

                      <label className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#718899]">
                        Organisation Name *
                      </label>

                      <input
                        type="text"
                        value={organisationName}
                        onChange={(e) =>
                          setOrganisationName(
                            e.target.value
                          )
                        }
                        placeholder="ABC Healthcare"
                        className="mt-2 h-12 w-full rounded-xl border border-[#d5e3ea] bg-white px-4 text-sm font-medium text-[#294b61] outline-none transition-all placeholder:text-[#a4b2bd] focus:border-[#1683c4] focus:ring-4 focus:ring-[#1683c4]/10"
                      />

                    </div>

                    {/* EMAIL */}

                    <div>

                      <label className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#718899]">
                        Client Email Address *
                      </label>

                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) =>
                          setClientEmail(
                            e.target.value
                          )
                        }
                        placeholder="john.smith@company.com"
                        className="mt-2 h-12 w-full rounded-xl border border-[#d5e3ea] bg-white px-4 text-sm font-medium text-[#294b61] outline-none transition-all placeholder:text-[#a4b2bd] focus:border-[#1683c4] focus:ring-4 focus:ring-[#1683c4]/10"
                      />

                      <div className="mt-3">

                        {clientEmail.length === 0 ? (

                          <span className="inline-flex rounded-full border border-[#f1dfb0] bg-[#fff9e9] px-3 py-1.5 text-[9px] font-bold text-[#9b7217]">
                            Waiting for recipient
                            email
                          </span>

                        ) : isValidEmail ? (

                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c9ead9] bg-[#ebf9f2] px-3 py-1.5 text-[9px] font-bold text-[#1b8755]">

                            <CheckCircle2 size={13} />

                            Valid Email Address

                          </span>

                        ) : (

                          <span className="inline-flex rounded-full border border-[#f1cccc] bg-[#fff1f1] px-3 py-1.5 text-[9px] font-bold text-[#c24b4b]">
                            Invalid email address
                          </span>

                        )}

                      </div>

                    </div>

                  </div>

                  {/* SECURITY */}

                  <div className="mt-8 rounded-2xl border border-[#d8e8ef] bg-white p-5">

                    <div className="mb-4 flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf8f1]">

                        <ShieldCheck
                          size={17}
                          className="text-[#1b9b61]"
                        />

                      </div>

                      <div>

                        <p className="text-xs font-extrabold text-[#294b61]">
                          Secure delivery
                        </p>

                        <p className="text-[9px] text-[#8b9eac]">
                          Protected communication
                          channel
                        </p>

                      </div>

                    </div>

                    <div className="space-y-3">

                      <div className="flex gap-3">

                        <CheckCircle2
                          size={15}
                          className="mt-0.5 shrink-0 text-[#1b9b61]"
                        />

                        <div>

                          <p className="text-[10px] font-bold text-[#506b7d]">
                            TLS 1.3 Encryption
                          </p>

                          <p className="mt-0.5 text-[9px] text-[#91a2ae]">
                            Email transmission is
                            encrypted.
                          </p>

                        </div>

                      </div>

                      <div className="flex gap-3">

                        <CheckCircle2
                          size={15}
                          className="mt-0.5 shrink-0 text-[#1b9b61]"
                        />

                        <div>

                          <p className="text-[10px] font-bold text-[#506b7d]">
                            Verified Organization
                          </p>

                          <p className="mt-0.5 break-all text-[9px] text-[#91a2ae]">
                            Message is sent from
                            info@yutic.com
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* LINK */}

                  <div className="mt-4 rounded-2xl border border-[#d5e7df] bg-[#f3fbf7] p-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1b9b61] text-white">
                        <Link2 size={16} />
                      </div>

                      <div>

                        <p className="text-xs font-extrabold text-[#294b61]">
                          Feedback link
                        </p>

                        <p className="text-[9px] text-[#8195a5]">
                          Manual share available
                        </p>

                      </div>

                    </div>

                    <div className="mt-4 rounded-xl border border-dashed border-[#a9d7c0] bg-white px-3 py-2.5">

                      <p className="truncate font-mono text-[9px] text-[#738b99]">
                        https://yutic.com/feedback
                      </p>

                    </div>

                    <div className="mt-3 flex items-center gap-2 text-[9px] font-semibold text-[#1b8755]">

                      <ShieldCheck size={13} />

                      Copy and share directly if
                      required.

                    </div>

                  </div>

                </div>

                {/* =============================================
                    RIGHT COMPOSER
                ============================================= */}

                <div className="flex flex-col bg-white p-5 sm:p-7">

                  <div className="mb-5">

                    <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#1683c4]">
                      Message composer
                    </p>

                    <h3
                      className="mt-2 text-xl font-black text-[#173b54]"
                      style={{
                        fontFamily:
                          "'Comfortaa', sans-serif",
                      }}
                    >
                      Prepare your invitation
                    </h3>

                  </div>

                  {/* SUBJECT */}

                  <div className="rounded-2xl border border-[#dce8ee] bg-[#f8fbfd] p-4">

                    <label className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#718899]">
                      Subject Line
                    </label>

                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) =>
                        setEmailSubject(
                          e.target.value
                        )
                      }
                      className="mt-2 h-11 w-full rounded-xl border border-[#d5e3ea] bg-white px-4 text-sm font-semibold text-[#294b61] outline-none transition-all focus:border-[#1683c4] focus:ring-4 focus:ring-[#1683c4]/10"
                    />

                  </div>

                  {/* MESSAGE */}

                  <div className="mt-4 flex min-h-[400px] flex-1 flex-col overflow-hidden rounded-2xl border border-[#dce8ee] bg-white">

                    <div className="flex shrink-0 items-center justify-between border-b border-[#e6eef2] bg-[#f8fbfd] px-4 py-3">

                      <div className="flex items-center gap-3">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf6fc]">

                          <Mail
                            size={14}
                            className="text-[#1683c4]"
                          />

                        </div>

                        <div>

                          <p className="text-[10px] font-extrabold text-[#405f73]">
                            Email message
                          </p>

                          <p className="text-[8px] text-[#94a5b1]">
                            Personalised invitation
                          </p>

                        </div>

                      </div>

                      <span className="rounded-full bg-[#eaf8f1] px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-wider text-[#1b9b61]">
                        Editable
                      </span>

                    </div>

                    <div className="flex flex-1 p-3">

                      <textarea
                        value={emailMessage}
                        onChange={(e) => {
                          setEmailMessage(
                            e.target.value
                          );

                          setIsMessageEdited(
                            true
                          );
                        }}
                        className="min-h-[350px] w-full flex-1 resize-none rounded-xl border border-[#e0e9ee] bg-[#fbfdfe] px-4 py-4 text-[13px] leading-6 text-[#4e6879] outline-none transition-all focus:border-[#1683c4] focus:bg-white focus:ring-4 focus:ring-[#1683c4]/10"
                      />

                    </div>

                  </div>

                  {/* INFO */}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#f4f8fa] px-4 py-3">

                    <div className="flex items-center gap-2">

                      <Lock
                        size={13}
                        className="text-[#1683c4]"
                      />

                      <span className="text-[9px] font-semibold text-[#718899]">
                        Secure email delivery
                      </span>

                    </div>

                    <span className="text-[9px] font-semibold text-[#9aabb7]">
                      Ctrl + Enter to send
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="shrink-0 border-t border-[#dfeaf0] bg-white px-5 py-4 sm:px-7">

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-2">

                  <span
                    className={`h-2 w-2 rounded-full ${
                      isFormValid
                        ? "bg-[#1b9b61]"
                        : "bg-[#d9a52f]"
                    }`}
                  />

                  <span className="text-[9px] font-bold text-[#8195a5]">

                    {isFormValid
                      ? "Ready to send"
                      : "Complete recipient details to continue"}

                  </span>

                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">

                  <button
                    onClick={() =>
                      setIsShareModalOpen(false)
                    }
                    className="w-full rounded-xl border border-[#d5e2e9] bg-white px-6 py-3 text-xs font-bold text-[#617b8d] transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 sm:w-auto"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSendEmail}
                    disabled={
                      !isFormValid || sending
                    }
                    className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#1683c4] px-7 py-3 text-xs font-extrabold text-white shadow-[0_10px_25px_rgba(22,131,196,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#116b9e] disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
                  >

                    <Send
                      size={15}
                      className={
                        sending
                          ? "animate-pulse"
                          : "transition-transform group-hover:translate-x-0.5"
                      }
                    />

                    <span>

                      {sending
                        ? "Sending..."
                        : isFormValid
                        ? "Send Secure Email"
                        : "Complete Required Fields"}

                    </span>

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* =========================================================
          SUCCESS
      ========================================================= */}

      {showSuccess && (

        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#123047]/30 p-4 backdrop-blur-md">

          <div className="relative w-full max-w-[420px] overflow-hidden rounded-[30px] border border-white bg-white p-8 shadow-[0_30px_80px_rgba(16,61,87,0.25)] animate-in zoom-in-95">

            <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-[#eaf8f1]" />

            <div className="relative z-10">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#eaf8f1]">

                <CheckCircle2
                  size={44}
                  strokeWidth={2}
                  className="text-[#1b9b61]"
                />

              </div>

              <p className="mt-6 text-center text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#1b9b61]">
                Delivery confirmed
              </p>

              <h2
                className="mt-2 text-center text-2xl font-black text-[#173b54]"
                style={{
                  fontFamily:
                    "'Comfortaa', sans-serif",
                }}
              >
                Email Sent
              </h2>

              <p className="mt-3 text-center text-sm leading-6 text-[#7890a2]">
                {successMessage}
              </p>

              <button
                onClick={() => {
                  setShowSuccess(false);
                  setIsShareModalOpen(false);
                }}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1683c4] py-3 text-xs font-extrabold text-white shadow-[0_10px_25px_rgba(22,131,196,0.20)] transition-all hover:-translate-y-0.5 hover:bg-[#116b9e]"
              >
                Done
                <ArrowRight size={14} />
              </button>

            </div>

          </div>

        </div>

      )}
    </>
  );
};

export default Dashboard;