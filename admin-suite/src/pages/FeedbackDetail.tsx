import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../services/api";



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


export default function FeedbackDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  function publishTestimonial() {

  navigate(
    "/testimonials/create",
    {
      state: {
        feedback
      }
    }
  );

}


  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] =
  useState(false);

useEffect(() => {
  if (!id) return;

  const loadFeedback = async () => {
    try {
      const res = await API.get(
        `/feedback/${id}`
      );

      setFeedback(res.data);
    } catch (err) {
      console.error(err);
      setFeedback(null);
    } finally {
      setLoading(false);
    }
  };

  loadFeedback();
}, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-xl text-[#56685E]">
        Loading Feedback...
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="p-10 text-center text-red-500 font-semibold">
        Feedback not found.
      </div>
    );
  }

  // Helper map for Review Types
  const TYPE_LABELS: Record<string, string> = {
    company: "Company experience",
    service: "Specific service",
    project: "Specific project",
    consultant: "Consultant feedback",
    recommendation: "Recommendation"
  };


  

const executeDelete = async () => {
  if (!id) return;

  try {
    await API.delete(
      `/feedback/${id}`
    );

    navigate(
      "/feedback-responses"
    );

  } catch (error) {
    console.error(error);
  }
};

  return (
  <>
    <style>{modalStyles}</style>

    {showDeleteModal && (
  <div
    className="modal-overlay"
    onClick={() => setShowDeleteModal(false)}
  >
    <div
      className="modal-content"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="modal-title">
        Delete Feedback?
      </h3>

      <p className="modal-text">
        Are you sure you want to delete the feedback from{" "}
        <b>
          {feedback?.name || "Anonymous User"}
        </b>
        ? This action cannot be undone.
      </p>

      <div className="modal-actions">
        <button
          className="btn-cancel"
          onClick={() => setShowDeleteModal(false)}
        >
          Cancel
        </button>

        <button
          className="btn-delete-modal"
          onClick={executeDelete}
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}
    <div className="max-w-6xl mx-auto p-0 font-sans text-[#0F2318]">

      <div className="flex items-center justify-between mb-8">
  <Link
    to="/feedback-responses"
    className="inline-flex items-center gap-2 text-[#2A6049] font-semibold hover:text-[#E64013] transition-colors"
  >
    ← Back to Responses
  </Link>

  <div className="flex gap-3">

<button
  onClick={publishTestimonial}
  className="
  px-5
  py-2
  rounded-xl
  bg-[#2A6049]
  text-white
  font-semibold
  hover:bg-[#214b39]
  "
>
Publish Testimonial
</button>

<button
  onClick={() => setShowDeleteModal(true)}
  className="
  px-5
  py-2
  rounded-xl
  bg-red-600
  text-white
  font-semibold
  hover:bg-red-700
  "
>
Delete Feedback
</button>

</div>
</div>

      <div className="bg-white rounded-[28px] overflow-hidden border border-[#D7E7DF] shadow-md">

        {/* Top Header Bar */}
        <div className="h-4 bg-[#2A6049]" />

        <div className="p-7">

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap gap-4 items-center mb-8">
            <div className="px-5 py-2 rounded-full bg-[#EEF5F1] text-[#2A6049] font-semibold text-sm">
              Feedback Submission
            </div>
            {feedback.ratings?.overall && (
              <div className="px-5 py-2 rounded-full bg-[#13261D] text-white font-bold text-sm">
                Overall ⭐ {feedback.ratings.overall}/5
              </div>
            )}
            {feedback.nps !== null && feedback.nps !== undefined && (
              <div className="px-5 py-2 rounded-full bg-[#E64013] text-white font-bold text-sm">
                NPS: {feedback.nps}/10
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#0F2318] mb-3">
            {feedback.name || "Anonymous User"}
          </h1>

          <div className="text-[#3D8A68] font-bold uppercase tracking-wider mb-12 text-sm">
            {feedback.orgName || feedback.org2 || "No Organisation Provided"}
          </div>


          {/* 1. REVIEW OVERVIEW */}
          <Section title="1. Review Overview">
            {feedback.types?.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {feedback.types.map((type: string) => (
                  <span key={type} className="px-4 py-2 rounded-full bg-[#F5FAF7] border border-[#D7E7DF] text-[#2A6049] font-medium">
                    {TYPE_LABELS[type] || type}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No specific review types selected.</p>
            )}
          </Section>


          {/* 2. ENGAGEMENT INFORMATION */}
          <Section title="2. Engagement Information">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <InfoCard title="Organisation Name" value={feedback.orgName} />
              <InfoCard title="Country" value={feedback.country} />
              <InfoCard title="Organisation Type" value={feedback.orgType} />
              <InfoCard title="Project Name" value={feedback.projectName} />
              <InfoCard title="Project Duration" value={feedback.duration} />
            </div>

            {feedback.services?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-[#56685E] mb-3">Services Reviewed</h3>
                <div className="flex flex-wrap gap-3">
                  {feedback.services.map((service: string) => (
                    <span key={service} className="px-4 py-2 rounded-full bg-[#EEF5F1] text-[#2A6049] font-medium">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Section>


          {/* 3. RATINGS & EXPERIENCE */}
          <Section title="3. Ratings & Experience">
            {/* <div className="grid md:grid-cols-2 gap-6 mb-8">
              <InfoCard title="Recommendation Score (NPS)" value={feedback.nps !== null && feedback.nps !== undefined ? `${feedback.nps} / 10` : ""} />
              <InfoCard title="Would work with us again?" value={feedback.again} />
            </div> */}

            {feedback.ratings && Object.keys(feedback.ratings).length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-[#56685E] mb-3">Detailed Assessment Ratings</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {Object.entries(feedback.ratings).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between bg-white border border-[#D7E7DF] rounded-xl p-4">
                      <span className="font-medium text-[#0F2318] capitalize">{key === 'overall' ? 'Overall Experience' : key}</span>
                      <span className="text-[#2A6049] font-bold">⭐ {val as number}/5</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Section>


          {/* 4. OUTCOMES & IMPACT */}
          <Section title="4. Outcomes & Impact">
            {feedback.outcomes?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-[#56685E] mb-3">Positive Outcomes Achieved</h3>
                <div className="flex flex-wrap gap-3">
                  {feedback.outcomes.map((item: string) => (
                    <span key={item} className="px-4 py-2 rounded-full bg-[#F5FAF7] border border-[#D7E7DF] text-[#2A6049] font-medium">
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6">
              {feedback.impact && (
                <div>
                  <h3 className="text-sm font-bold text-[#56685E] mb-2">Impact Delivered</h3>
                  <p className="bg-white p-5 rounded-xl border border-[#D7E7DF] text-[#0F2318] whitespace-pre-wrap">{feedback.impact}</p>
                </div>
              )}
              {feedback.workedWell && (
                <div>
                  <h3 className="text-sm font-bold text-[#56685E] mb-2">What Worked Well</h3>
                  <p className="bg-white p-5 rounded-xl border border-[#D7E7DF] text-[#0F2318] whitespace-pre-wrap">{feedback.workedWell}</p>
                </div>
              )}
              {feedback.improve && (
                <div>
                  <h3 className="text-sm font-bold text-[#56685E] mb-2">Opportunities For Improvement</h3>
                  <p className="bg-white p-5 rounded-xl border border-[#D7E7DF] text-[#0F2318] whitespace-pre-wrap">{feedback.improve}</p>
                </div>
              )}
            </div>
          </Section>


          {/* 5. CONSULTANT FEEDBACK */}
          {(feedback.consultant || feedback.excellence?.length > 0 || feedback.consultantNotes) && (
            <Section title="5. Consultant Feedback">
              <div className="mb-6">
                <InfoCard title="Consultant Name" value={feedback.consultant} />
              </div>

              {feedback.excellence?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-[#56685E] mb-3">Areas Of Excellence</h3>
                  <div className="flex flex-wrap gap-3">
                    {feedback.excellence.map((item: string) => (
                      <span key={item} className="px-4 py-2 rounded-full bg-[#EEF5F1] text-[#2A6049] font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {feedback.consultantNotes && (
                <div>
                  <h3 className="text-sm font-bold text-[#56685E] mb-2">Additional Feedback</h3>
                  <p className="bg-white p-5 rounded-xl border border-[#D7E7DF] text-[#0F2318] whitespace-pre-wrap">{feedback.consultantNotes}</p>
                </div>
              )}
            </Section>
          )}


          {/* 6. RECOMMENDATION STATUS */}
          <Section title="6. Recommendation Status">
            <div className="mb-6">
              <InfoCard title="Willing to provide a testimonial?" value={feedback.willing} />
            </div>

            {feedback.recommendation && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-[#56685E] mb-2">Provided Recommendation</h3>
                <p className="bg-white p-5 rounded-xl border border-[#D7E7DF] text-[#0F2318] italic whitespace-pre-wrap">
                  "{feedback.recommendation}"
                </p>
              </div>
            )}

            {feedback.publish?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-[#56685E] mb-3">Publication Permissions Granted</h3>
                <div className="flex flex-wrap gap-3">
                  {feedback.publish.map((item: string) => (
                    <span key={item} className="px-4 py-2 rounded-full bg-[#F5FAF7] border border-[#D7E7DF] text-[#2A6049] font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Section>


          {/* 7. YOUR DETAILS & CONSENT */}
          <Section title="7. User Details & Privacy">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <InfoCard title="Submitted Name" value={feedback.name} />
              <InfoCard title="Job Title" value={feedback.title} />
              <InfoCard title="Organisation (Additional Details)" value={feedback.org2} />
              <InfoCard title="LinkedIn Profile" value={feedback.linkedin} />
            </div>

            <h3 className="text-sm font-bold text-[#56685E] mb-3">Data Consents</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Permission label="Consent to Process Feedback" value={feedback.consentProcess} />
              <Permission label="Acknowledges Removal Rights" value={feedback.consentRemoval} />
              <Permission label="Consent to Contact" value={feedback.consentContact} />
              <Permission label="Consent to Publish" value={feedback.consentPublish} />
            </div>
          </Section>

        </div>
      </div>
    </div>
    </>
  );
}

// --- HELPER COMPONENTS ---

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-5 text-[#0F2318] border-b-2 border-[#D7E7DF] pb-2">
        {title}
      </h2>
      <div className="bg-[#F8FAF9] rounded-2xl p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value?: string | null;
}) {
  return (
    <div className="bg-white border border-[#D7E7DF] shadow-sm rounded-xl p-5">
      <div className="text-[13px] font-bold uppercase tracking-wide text-[#56685E] mb-2">
        {title}
      </div>
      <div className="font-semibold text-[#0F2318] text-lg">
        {value || <span className="text-gray-400 font-normal">Not provided</span>}
      </div>
    </div>
    
  );
}

function Permission({
  label,
  value,
}: {
  label: string;
  value?: boolean;
}) {
  return (
  <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-[#D7E7DF] shadow-sm">
    <span className="font-medium text-[#0F2318]">
      {label}
    </span>

    <span
      className={`font-bold px-3 py-1 rounded-full text-sm ${
        value
          ? "bg-[#EEF5F1] text-[#2A6049]"
          : "bg-[#FDECE6] text-[#E64013]"
      }`}
    >
      {value ? "Granted" : "Declined"}
    </span>
  </div>
  
);
}