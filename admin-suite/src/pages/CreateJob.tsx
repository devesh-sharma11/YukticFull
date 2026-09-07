
import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  createJob,
  getAdminJob,
  updateJob,
} from "../services/api";

interface JobData {
  title: string;
  location: string;
  work_mode: string[];
  job_type: string;

  recruiter_ids: string[];

  mandatory_skills: string[];
  optional_skills: string[];

  min_experience: string;
  max_experience: string;

  min_package: string;
  max_package: string;

  min_notice_period: string;
  max_notice_period: string;

  description: string;

  // External Application Link
  applyLink: string;

  slug: string;
  published: boolean;
}

const emptyForm: JobData = {
  title: "",
  location: "",
  work_mode: [],
  job_type: "",

  recruiter_ids: [],

  mandatory_skills: [],
  optional_skills: [],

  min_experience: "",
  max_experience: "",

  min_package: "",
  max_package: "",

  min_notice_period: "",
  max_notice_period: "",

  description: "",

  // External Application Link
  applyLink: "",

  slug: "",
  published: true,
};

const CreateJob = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /*
   * Edit mode:
   * /create-job?edit=job-slug
   */
  const editSlug = searchParams.get("edit");
  const isEditMode = Boolean(editSlug);

  const [formData, setFormData] =
    useState<JobData>(emptyForm);

  const [
    mandatorySkillInput,
    setMandatorySkillInput,
  ] = useState("");

  const [
    optionalSkillInput,
    setOptionalSkillInput,
  ] = useState("");

  const [
    recruiterInput,
    setRecruiterInput,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [loadingJob, setLoadingJob] =
    useState(isEditMode);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /*
   * Always start at top when page opens.
   */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, []);

  /*
   * Load complete existing job when
   * opening edit mode.
   */
  useEffect(() => {
    if (!editSlug) {
      setFormData({
        ...emptyForm,
        work_mode: [],
        recruiter_ids: [],
        mandatory_skills: [],
        optional_skills: [],
      });

      setLoadingJob(false);
      return;
    }

    const loadJobForEdit = async () => {
      try {
        setLoadingJob(true);
        setError("");
        setSuccess("");

        const job = await getAdminJob(
          editSlug
        );

        /*
         * Populate EVERY field returned
         * from the database.
         */
        setFormData({
          title: job?.title ?? "",

          location: job?.location ?? "",

          work_mode: Array.isArray(
            job?.work_mode
          )
            ? job.work_mode
            : [],

          job_type: job?.job_type ?? "",

          recruiter_ids: Array.isArray(
            job?.recruiter_ids
          )
            ? job.recruiter_ids
            : [],

          mandatory_skills:
            Array.isArray(
              job?.mandatory_skills
            )
              ? job.mandatory_skills
              : [],

          optional_skills:
            Array.isArray(
              job?.optional_skills
            )
              ? job.optional_skills
              : [],

          min_experience:
            job?.min_experience === null ||
            job?.min_experience === undefined
              ? ""
              : String(job.min_experience),

          max_experience:
            job?.max_experience === null ||
            job?.max_experience === undefined
              ? ""
              : String(job.max_experience),

          min_package:
            job?.min_package === null ||
            job?.min_package === undefined
              ? ""
              : String(job.min_package),

          max_package:
            job?.max_package === null ||
            job?.max_package === undefined
              ? ""
              : String(job.max_package),

          min_notice_period:
            job?.min_notice_period === null ||
            job?.min_notice_period === undefined
              ? ""
              : String(
                  job.min_notice_period
                ),

          max_notice_period:
            job?.max_notice_period === null ||
            job?.max_notice_period === undefined
              ? ""
              : String(
                  job.max_notice_period
                ),

          description:
            job?.description ?? "",

          /*
           * NEW:
           * Load existing external application
           * link when editing.
           */
          applyLink:
            job?.applyLink ?? "",

          slug: job?.slug ?? editSlug,

          published:
            Boolean(job?.published),
        });
      } catch (err: any) {
        console.error(
          "Get Job For Edit Error:",
          err
        );

        setError(
          err?.response?.data?.detail ||
            "Failed to load job details."
        );
      } finally {
        setLoadingJob(false);
      }
    };

    loadJobForEdit();
  }, [editSlug]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWorkModeChange = (
    mode: string
  ) => {
    setFormData((prev) => {
      const exists =
        prev.work_mode.includes(mode);

      return {
        ...prev,

        work_mode: exists
          ? prev.work_mode.filter(
              (item) => item !== mode
            )
          : [
              ...prev.work_mode,
              mode,
            ],
      };
    });
  };

  const createSlug = (
    value: string
  ) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      title: value,

      /*
       * In edit mode, do NOT silently
       * change the existing slug just
       * because the title changes.
       */
      slug: isEditMode
        ? prev.slug
        : createSlug(value),
    }));
  };

  const addMandatorySkill = () => {
    const skill =
      mandatorySkillInput.trim();

    if (!skill) return;

    if (
      !formData.mandatory_skills.some(
        (item) =>
          item.toLowerCase() ===
          skill.toLowerCase()
      )
    ) {
      setFormData((prev) => ({
        ...prev,

        mandatory_skills: [
          ...prev.mandatory_skills,
          skill,
        ],
      }));
    }

    setMandatorySkillInput("");
  };

  const removeMandatorySkill = (
    skill: string
  ) => {
    setFormData((prev) => ({
      ...prev,

      mandatory_skills:
        prev.mandatory_skills.filter(
          (item) => item !== skill
        ),
    }));
  };

  const addOptionalSkill = () => {
    const skill =
      optionalSkillInput.trim();

    if (!skill) return;

    if (
      !formData.optional_skills.some(
        (item) =>
          item.toLowerCase() ===
          skill.toLowerCase()
      )
    ) {
      setFormData((prev) => ({
        ...prev,

        optional_skills: [
          ...prev.optional_skills,
          skill,
        ],
      }));
    }

    setOptionalSkillInput("");
  };

  const removeOptionalSkill = (
    skill: string
  ) => {
    setFormData((prev) => ({
      ...prev,

      optional_skills:
        prev.optional_skills.filter(
          (item) => item !== skill
        ),
    }));
  };

  const addRecruiter = () => {
    const recruiter =
      recruiterInput.trim();

    if (!recruiter) return;

    if (
      !formData.recruiter_ids.includes(
        recruiter
      )
    ) {
      setFormData((prev) => ({
        ...prev,

        recruiter_ids: [
          ...prev.recruiter_ids,
          recruiter,
        ],
      }));
    }

    setRecruiterInput("");
  };

  const removeRecruiter = (
    recruiter: string
  ) => {
    setFormData((prev) => ({
      ...prev,

      recruiter_ids:
        prev.recruiter_ids.filter(
          (item) =>
            item !== recruiter
        ),
    }));
  };

  const handleSkillKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type:
      | "mandatory"
      | "optional"
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (type === "mandatory") {
        addMandatorySkill();
      } else {
        addOptionalSkill();
      }
    }
  };

  const handleRecruiterKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addRecruiter();
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      return "Job Title is required.";
    }

    if (!formData.location.trim()) {
      return "Location is required.";
    }

    if (
      formData.work_mode.length === 0
    ) {
      return "Please select at least one Work Mode.";
    }

    if (!formData.job_type.trim()) {
      return "Job Type is required.";
    }

    if (
      formData.mandatory_skills.length ===
      0
    ) {
      return "Please add at least one Mandatory Skill.";
    }

    if (!formData.description.trim()) {
      return "Job Description is required.";
    }

    /*
     * Apply Link is optional.
     *
     * If admin enters one, it must be
     * a proper external HTTP/HTTPS URL.
     */
    if (formData.applyLink.trim()) {
      const applyLink =
        formData.applyLink.trim();

      if (
        !/^https?:\/\/.+/i.test(
          applyLink
        )
      ) {
        return "Apply Link must start with http:// or https://";
      }
    }

    if (!formData.slug.trim()) {
      return "Job slug is required.";
    }

    return "";
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title.trim(),

        location:
          formData.location.trim(),

        work_mode:
          formData.work_mode,

        job_type:
          formData.job_type.trim(),

        recruiter_ids:
          formData.recruiter_ids,

        mandatory_skills:
          formData.mandatory_skills,

        optional_skills:
          formData.optional_skills,

        min_experience:
          formData.min_experience === ""
            ? null
            : Number(
                formData.min_experience
              ),

        max_experience:
          formData.max_experience === ""
            ? null
            : Number(
                formData.max_experience
              ),

        min_package:
          formData.min_package === ""
            ? null
            : Number(
                formData.min_package
              ),

        max_package:
          formData.max_package === ""
            ? null
            : Number(
                formData.max_package
              ),

        min_notice_period:
          formData.min_notice_period === ""
            ? null
            : Number(
                formData.min_notice_period
              ),

        max_notice_period:
          formData.max_notice_period === ""
            ? null
            : Number(
                formData.max_notice_period
              ),

        description:
          formData.description.trim(),

        /*
         * NEW:
         * Send empty link as null so MongoDB
         * stores a clean null value.
         */
        applyLink:
          formData.applyLink.trim() === ""
            ? null
            : formData.applyLink.trim(),

        slug: formData.slug.trim(),

        published:
          formData.published,
      };

      if (isEditMode && editSlug) {
        /*
         * UPDATE EXISTING JOB
         */
        await updateJob(
          editSlug,
          payload
        );

        setSuccess(
          "Job updated successfully."
        );
      } else {
        /*
         * CREATE NEW JOB
         */
        await createJob(payload);

        setSuccess(
          "Job created successfully."
        );
      }

      setTimeout(() => {
        navigate("/list-edit-job");
      }, 800);
    } catch (err: any) {
      console.error(
        isEditMode
          ? "Update Job Error:"
          : "Create Job Error:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          (isEditMode
            ? "Failed to update job."
            : "Failed to create job.")
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * While fetching an existing job,
   * don't show an empty create form.
   */
  if (loadingJob) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f7f8fa",
          padding: "30px",
          boxSizing: "border-box",
          fontFamily:
            "'Comfortaa', sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e1e5e9",
              borderRadius: "12px",
              padding: "70px 30px",
              textAlign: "center",
              color: "#68737d",
              fontSize: "15px",
              fontFamily:
                "'Comfortaa', sans-serif",
            }}
          >
            Loading job details...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f8fa",
        padding: "30px",
        boxSizing: "border-box",
        fontFamily:
          "'Comfortaa', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            marginBottom: "28px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 700,
              color: "#263746",
              fontFamily:
                "'Comfortaa', sans-serif",
            }}
          >
            {isEditMode
              ? "Edit Job"
              : "Create Job"}
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#68737d",
              fontSize: "15px",
              fontFamily:
                "'Comfortaa', sans-serif",
            }}
          >
            {isEditMode
              ? "Update the existing job details."
              : "Add a new job opening."}
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div
            style={{
              background: "#fff1f0",
              border: "1px solid #ffc9c5",
              color: "#c62828",
              padding: "14px 16px",
              borderRadius: "8px",
              marginBottom: "18px",
              fontFamily:
                "'Comfortaa', sans-serif",
            }}
          >
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div
            style={{
              background: "#eef9f1",
              border: "1px solid #b9e3c2",
              color: "#26733a",
              padding: "14px 16px",
              borderRadius: "8px",
              marginBottom: "18px",
              fontFamily:
                "'Comfortaa', sans-serif",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* BASIC DETAILS */}

          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>
              Basic Details
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "18px",
              }}
            >
              <div>
                <label style={labelStyle}>
                  Job Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={
                    handleTitleChange
                  }
                  placeholder="Job Title"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={
                    formData.location
                  }
                  onChange={handleChange}
                  placeholder="Location"
                  style={inputStyle}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div>
                  <label style={labelStyle}>
                    Work Mode
                  </label>

                  <div
                    style={{
                      border:
                        "1px solid #d8dde2",
                      borderRadius: "8px",
                      padding: "14px",
                      background: "#fff",
                    }}
                  >
                    {[
                      "WFH",
                      "WFO",
                      "Hybrid",
                    ].map((mode) => (
                      <label
                        key={mode}
                        style={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: "10px",
                          marginBottom:
                            "10px",
                          cursor:
                            "pointer",
                          fontFamily:
                            "'Comfortaa', sans-serif",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.work_mode.includes(
                            mode
                          )}
                          onChange={() =>
                            handleWorkModeChange(
                              mode
                            )
                          }
                        />

                        <span>{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>
                    Job Type
                  </label>

                  <select
                    name="job_type"
                    value={
                      formData.job_type
                    }
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="">
                      Select Job Type
                    </option>

                    <option value="Full Time">
                      Full Time
                    </option>

                    <option value="Part Time">
                      Part Time
                    </option>

                    <option value="Contract">
                      Contract
                    </option>

                    <option value="Internship">
                      Internship
                    </option>
                  </select>
                </div>
              </div>

              {/* RECRUITERS */}

              <div>
                <label style={labelStyle}>
                  Recruiter(s){" "}
                  <span
                    style={{
                      color: "#929aa2",
                      fontWeight: 400,
                    }}
                  >
                    (Optional)
                  </span>
                </label>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    value={
                      recruiterInput
                    }
                    onChange={(e) =>
                      setRecruiterInput(
                        e.target.value
                      )
                    }
                    onKeyDown={
                      handleRecruiterKeyDown
                    }
                    placeholder="Recruiter ID"
                    style={{
                      ...inputStyle,
                      flex: 1,
                    }}
                  />

                  <button
                    type="button"
                    onClick={addRecruiter}
                    style={
                      secondaryButtonStyle
                    }
                  >
                    Add
                  </button>
                </div>

                {formData
                  .recruiter_ids.length >
                  0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap:
                        "wrap",
                      gap: "8px",
                      marginTop:
                        "12px",
                    }}
                  >
                    {formData.recruiter_ids.map(
                      (recruiter) => (
                        <span
                          key={recruiter}
                          style={tagStyle}
                        >
                          {recruiter}

                          <button
                            type="button"
                            onClick={() =>
                              removeRecruiter(
                                recruiter
                              )
                            }
                            style={
                              tagRemoveStyle
                            }
                          >
                            ×
                          </button>
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SKILLS */}

          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>
              Skills
            </h2>

            <div
              style={{
                marginBottom: "22px",
              }}
            >
              <label style={labelStyle}>
                Mandatory Skills
              </label>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  value={
                    mandatorySkillInput
                  }
                  onChange={(e) =>
                    setMandatorySkillInput(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) =>
                    handleSkillKeyDown(
                      e,
                      "mandatory"
                    )
                  }
                  placeholder="Select skills..."
                  style={{
                    ...inputStyle,
                    flex: 1,
                  }}
                />

                <button
                  type="button"
                  onClick={
                    addMandatorySkill
                  }
                  style={
                    secondaryButtonStyle
                  }
                >
                  Add
                </button>
              </div>

              {formData
                .mandatory_skills
                .length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap:
                      "wrap",
                    gap: "8px",
                    marginTop:
                      "12px",
                  }}
                >
                  {formData.mandatory_skills.map(
                    (skill) => (
                      <span
                        key={skill}
                        style={tagStyle}
                      >
                        {skill}

                        <button
                          type="button"
                          onClick={() =>
                            removeMandatorySkill(
                              skill
                            )
                          }
                          style={
                            tagRemoveStyle
                          }
                        >
                          ×
                        </button>
                      </span>
                    )
                  )}
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>
                Optional Skills
              </label>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  value={
                    optionalSkillInput
                  }
                  onChange={(e) =>
                    setOptionalSkillInput(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) =>
                    handleSkillKeyDown(
                      e,
                      "optional"
                    )
                  }
                  placeholder="Select skills..."
                  style={{
                    ...inputStyle,
                    flex: 1,
                  }}
                />

                <button
                  type="button"
                  onClick={
                    addOptionalSkill
                  }
                  style={
                    secondaryButtonStyle
                  }
                >
                  Add
                </button>
              </div>

              {formData
                .optional_skills
                .length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap:
                      "wrap",
                    gap: "8px",
                    marginTop:
                      "12px",
                  }}
                >
                  {formData.optional_skills.map(
                    (skill) => (
                      <span
                        key={skill}
                        style={tagStyle}
                      >
                        {skill}

                        <button
                          type="button"
                          onClick={() =>
                            removeOptionalSkill(
                              skill
                            )
                          }
                          style={
                            tagRemoveStyle
                          }
                        >
                          ×
                        </button>
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          </section>

          {/* EXPERIENCE / PACKAGE / NOTICE */}

          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>
              Experience & Compensation
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "18px",
              }}
            >
              <div>
                <label style={labelStyle}>
                  Min Experience (Yrs)
                </label>

                <input
                  type="number"
                  name="min_experience"
                  value={
                    formData.min_experience
                  }
                  onChange={handleChange}
                  placeholder="Min Exp (Yrs)"
                  min="0"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Max Experience (Yrs)
                </label>

                <input
                  type="number"
                  name="max_experience"
                  value={
                    formData.max_experience
                  }
                  onChange={handleChange}
                  placeholder="Max Exp (Yrs)"
                  min="0"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Min Package (LPA)
                </label>

                <input
                  type="number"
                  name="min_package"
                  value={
                    formData.min_package
                  }
                  onChange={handleChange}
                  placeholder="Min Package (LPA)"
                  min="0"
                  step="0.1"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Max Package (LPA)
                </label>

                <input
                  type="number"
                  name="max_package"
                  value={
                    formData.max_package
                  }
                  onChange={handleChange}
                  placeholder="Max Package (LPA)"
                  min="0"
                  step="0.1"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Min Notice Period (Days)
                </label>

                <input
                  type="number"
                  name="min_notice_period"
                  value={
                    formData.min_notice_period
                  }
                  onChange={handleChange}
                  placeholder="Min Notice Period (Days)"
                  min="0"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Max Notice Period (Days)
                </label>

                <input
                  type="number"
                  name="max_notice_period"
                  value={
                    formData.max_notice_period
                  }
                  onChange={handleChange}
                  placeholder="Max Notice Period (Days)"
                  min="0"
                  style={inputStyle}
                />
              </div>
            </div>
          </section>

          {/* DESCRIPTION */}

          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>
              Job Description
            </h2>

            <textarea
              name="description"
              value={
                formData.description
              }
              onChange={handleChange}
              placeholder="Detailed JD"
              rows={12}
              style={{
                ...inputStyle,
                resize: "vertical",
                lineHeight: 1.6,
              }}
            />
          </section>

          {/* EXTERNAL APPLICATION LINK */}

          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>
              Application
            </h2>

            <div>
              <label style={labelStyle}>
                Apply Link{" "}
                <span
                  style={{
                    color: "#929aa2",
                    fontWeight: 400,
                  }}
                >
                  (Optional)
                </span>
              </label>

              <input
                type="url"
                name="applyLink"
                value={
                  formData.applyLink
                }
                onChange={handleChange}
                placeholder="https://example.com/apply"
                style={inputStyle}
              />

              <p
                style={{
                  margin:
                    "8px 0 0",
                  color: "#7a858e",
                  fontSize: "13px",
                  lineHeight: 1.5,
                  fontFamily:
                    "'Comfortaa', sans-serif",
                }}
              >
                Add the external application
                page where candidates should
                apply for this job. When
                provided, the frontend will
                show an Apply Now button that
                opens this link.
              </p>
            </div>
          </section>

          {/* PUBLISHING */}

          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>
              Publishing
            </h2>

            <div
              style={{
                marginBottom: "18px",
              }}
            >
              <label style={labelStyle}>
                Job Slug
              </label>

              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="job-slug"
                style={inputStyle}
              />
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                fontFamily:
                  "'Comfortaa', sans-serif",
              }}
            >
              <input
                type="checkbox"
                checked={
                  formData.published
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    published:
                      e.target.checked,
                  }))
                }
              />

              <span>
                Publish this job immediately
              </span>
            </label>
          </section>

          {/* ACTIONS */}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              paddingBottom: "40px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/list-edit-job"
                )
              }
              style={
                cancelButtonStyle
              }
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={
                primaryButtonStyle
              }
              disabled={loading}
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Job"
                : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================
   STYLES
========================================================= */

const sectionStyle: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "26px",
  marginBottom: "22px",
  border: "1px solid #e1e5e9",
  fontFamily:
    "'Comfortaa', sans-serif",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: "0 0 22px",
  fontSize: "20px",
  color: "#34495e",
  fontFamily:
    "'Comfortaa', sans-serif",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontSize: "14px",
  fontWeight: 600,
  color: "#34495e",
  fontFamily:
    "'Comfortaa', sans-serif",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #d8dde2",
  borderRadius: "8px",
  padding: "13px 14px",
  fontSize: "15px",
  color: "#303840",
  background: "#ffffff",
  outline: "none",
  fontFamily:
    "'Comfortaa', sans-serif",
};

const primaryButtonStyle: React.CSSProperties = {
  border: "none",
  borderRadius: "8px",
  padding: "13px 28px",
  background: "#075bd8",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 600,
  cursor: "pointer",
  fontFamily:
    "'Comfortaa', sans-serif",
};

const secondaryButtonStyle: React.CSSProperties = {
  border: "1px solid #075bd8",
  borderRadius: "8px",
  padding: "0 20px",
  background: "#ffffff",
  color: "#075bd8",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  fontFamily:
    "'Comfortaa', sans-serif",
};

const cancelButtonStyle: React.CSSProperties = {
  border: "1px solid #d0d5da",
  borderRadius: "8px",
  padding: "13px 24px",
  background: "#ffffff",
  color: "#4d5862",
  fontSize: "15px",
  fontWeight: 600,
  cursor: "pointer",
  fontFamily:
    "'Comfortaa', sans-serif",
};

const tagStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  background: "#eef5ff",
  border: "1px solid #c9ddff",
  color: "#075bd8",
  borderRadius: "20px",
  padding: "6px 10px",
  fontSize: "13px",
  fontFamily:
    "'Comfortaa', sans-serif",
};

const tagRemoveStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  color: "#075bd8",
  cursor: "pointer",
  padding: 0,
  fontSize: "17px",
  lineHeight: 1,
  fontFamily:
    "'Comfortaa', sans-serif",
};

export default CreateJob;

