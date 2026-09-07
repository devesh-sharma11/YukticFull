
import { useState, useEffect } from "react";
import {
  createCaseStudy,
  getImageLibrary,
} from "../services/api";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { useNavigate } from "react-router-dom";


export default function CreateCaseStudy() {


  const navigate = useNavigate();

  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
    type: "success",
  });

  const { slug } = useParams();

  const isEditMode = !!slug;
  const [visibleSteps, setVisibleSteps] = useState(3);
  const [visibleMyRoleSteps, setVisibleMyRoleSteps] = useState(3);
  const [visibleDifficultFactors, setVisibleDifficultFactors] = useState(2);
  const [visibleBackgrounds,setVisibleBackgrounds]=useState(2);
  const [visibleChallenges,setVisibleChallenges]=useState(2);
  const [visibleResults, setVisibleResults] = useState(4);
  const [images, setImages] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    filter_title: "",
    subtitle: "",
    landmark_banner: "",

    architecture_image: {
      image: "",
      caption: "",
    },

    workflow_image: {
      image: "",
      caption: "",
    },

    product_image: {
      image: "",
      caption: "",
    },

    backgrounds: ["", ""],

    event_types: "",

    difficult_factors: ["", ""],

    challenges:["",""],

    intervention_intro: "",


    my_role_intro: "",



    step_1: "",
    step_2: "",
    step_3: "",
    step_4: "",
    step_5: "",
    step_6: "",
    step_7: "",
    step_8: "",
    step_9: "",
    step_10: "",
    step_11: "",
    step_12: "",
    step_13: "",
    step_14: "",
    step_15: "",

    my_role_1: "",
    my_role_2: "",
    my_role_3: "",
    my_role_4: "",
    my_role_5: "",
    my_role_6: "",
    my_role_7: "",
    my_role_8: "",
    my_role_9: "",
    my_role_10: "",
    my_role_11: "",
    my_role_12: "",
    my_role_13: "",
    my_role_14: "",
    my_role_15: "",


    results: [
      "",
      "",
      "",
      ""
    ],

    

    stat1_number: "",
    stat1_label: "",

    stat2_number: "",
    stat2_label: "",

    stat3_number: "",
    stat3_label: "",

    landmark_title: "",
    landmark_description: "",
    client_said: "",
    organisation: "",
    
    region: "",
    service_types: "",
    stakeholders: "",
    epic_modules: "",
    specialties: "",
    landmark: "",

    published: true,
  });



  useEffect(() => {

      loadImages();

  }, []);

  const loadImages = async () => {

      try {

          const data = await getImageLibrary();

          setImages(data);

      } catch (e) {

          console.error(e);

      }

  };



  useEffect(() => {

  if (isEditMode) {
      loadCaseStudy();
    }

  }, [slug]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const loadCaseStudy = async () => {

  try {

    const res = await API.get(
      `/admin/case-studies/${slug}`
    );

    const data = res.data;

    const totalSteps =
      data.steps?.filter(
        (step: string) => step?.trim()
      ).length || 3;

    setVisibleSteps(
      Math.min(
        Math.max(totalSteps, 3),
        15
      )
    );
    setVisibleBackgrounds(
      Math.min(
        Math.max(data.backgrounds?.length || 2, 2),
        5
      )
    );

    setVisibleChallenges(
      Math.min(
        Math.max(data.challenges?.length || 2, 2),
        5
      )
    );

    setVisibleResults(
      Math.min(
        Math.max(data.results?.length || 4, 4),
        10
      )
    );
    

    

    setFormData({

      title: data.title || "",
      slug: data.slug || "",
      filter_title: data.filter_title || "",
      subtitle: data.subtitle || "",
      landmark_banner: data.landmark_banner || "",

      architecture_image:
        data.architecture_image || {
          image: "",
          caption: "",
        },

      workflow_image:
        data.workflow_image || {
          image: "",
          caption: "",
        },

      product_image:
        data.product_image || {
          image: "",
          caption: "",
        },

      backgrounds:
        data.backgrounds?.length
          ? data.backgrounds
          : ["", ""],
      

      event_types:
        data.event_types?.join("\n") || "",

      difficult_factors:
        data.difficult_factors?.length
          ? data.difficult_factors
          : ["", ""],

      challenges:
        data.challenges?.length
          ? data.challenges
          : ["", ""],

      intervention_intro:
        data.intervention_intro || "",

      my_role_intro:
        data.my_role_intro || "",

      step_1: data.steps?.[0] || "",
      step_2: data.steps?.[1] || "",
      step_3: data.steps?.[2] || "",
      step_4: data.steps?.[3] || "",
      step_5: data.steps?.[4] || "",
      step_6: data.steps?.[5] || "",
      step_7: data.steps?.[6] || "",
      step_8: data.steps?.[7] || "",
      step_9: data.steps?.[8] || "",
      step_10: data.steps?.[9] || "",
      step_11: data.steps?.[10] || "",
      step_12: data.steps?.[11] || "",
      step_13: data.steps?.[12] || "",
      step_14: data.steps?.[13] || "",
      step_15: data.steps?.[14] || "",



      my_role_1: data.my_role_points?.[0] || "",
      my_role_2: data.my_role_points?.[1] || "",
      my_role_3: data.my_role_points?.[2] || "",
      my_role_4: data.my_role_points?.[3] || "",
      my_role_5: data.my_role_points?.[4] || "",
      my_role_6: data.my_role_points?.[5] || "",
      my_role_7: data.my_role_points?.[6] || "",
      my_role_8: data.my_role_points?.[7] || "",
      my_role_9: data.my_role_points?.[8] || "",
      my_role_10: data.my_role_points?.[9] || "",
      my_role_11: data.my_role_points?.[10] || "",
      my_role_12: data.my_role_points?.[11] || "",
      my_role_13: data.my_role_points?.[12] || "",
      my_role_14: data.my_role_points?.[13] || "",
      my_role_15: data.my_role_points?.[14] || "",

      results:
        data.results?.length
          ? data.results.map((r:any)=>r.text)
          : ["","","",""],
          

      

      stat1_number:
        data.stats?.[0]?.number || "",

      stat1_label:
        data.stats?.[0]?.label || "",

      stat2_number:
        data.stats?.[1]?.number || "",

      stat2_label:
        data.stats?.[1]?.label || "",

      stat3_number:
        data.stats?.[2]?.number || "",

      stat3_label:
        data.stats?.[2]?.label || "",

      landmark_title:
        data.landmark_title || "",

      landmark_description:
        data.landmark_description || "",

      client_said:
        data.client_said || "",

      organisation:
        data.project_summary?.organisation || "",

      region:
        data.project_summary?.region || "",

      service_types:
        data.project_summary?.service_types?.join(",") || "",

      stakeholders:
        data.project_summary?.stakeholders || "",

      epic_modules:
        data.project_summary?.epic_modules?.join(",") || "",

      specialties:
        data.project_summary?.specialties || "",

      landmark:
        data.project_summary?.landmark || "",

      published: true

    });

  } catch (err) {

    console.error(err);

  }

};

const addStep = () => {

  if (visibleSteps >= 15) return;

  setVisibleSteps(prev => prev + 1);

};

const addBackground = () => {

  if (visibleBackgrounds >= 5) return;

  setVisibleBackgrounds(prev => prev + 1);

  setFormData(prev => ({
    ...prev,
    backgrounds: [...prev.backgrounds, ""]
  }));

};

const addChallenge = () => {

  if (visibleChallenges >= 5) return;

  setVisibleChallenges(prev => prev + 1);

  setFormData(prev => ({
    ...prev,
    challenges: [...prev.challenges, ""]
  }));

};

const addResult = () => {

  if (visibleResults >= 10) return;

  setVisibleResults(prev => Math.min(prev + 2, 10));

  setFormData(prev => ({
    ...prev,
    results: [
      ...prev.results,
      "",
      ""
    ]
  }));

};


const checkSlugExists = async (slug: string) => {
  try {
    const res = await API.get(
      `/case-studies/check-slug/${encodeURIComponent(slug)}`
    );

    console.log("Slug API Response:", res.data);

    return res.data.exists;
  } catch (err) {
    console.error(err);
    return false;
  }
};



  const handleSubmit = async () => {

     if (!formData.slug.trim()) {
    setPopup({
      show: true,
      title: "Required Field",
      message: "Case Study Slug is mandatory.",
      type: "error",
    });
    return;
  
  }


const slugExists = await checkSlugExists(formData.slug.trim());

console.log("isEditMode:", isEditMode);
console.log("slugExists:", slugExists);

if (!isEditMode && slugExists) {
  console.log("Duplicate popup should open");

  setPopup({
    show: true,
    title: "Duplicate Slug",
    message: "This slug already exists. Please choose another slug.",
    type: "error",
  });

  return;
}



  const icons = [
        "⚡",
        "🔒",
        "⏱️",
        "🧩",
        "📈",
        "💰",
        "🚀",
        "🎯",
        "🏆",
        "⭐"
      ];

    const payload = {
      title: formData.title,
      slug: formData.slug,
      filter_title: formData.filter_title,
      subtitle: formData.subtitle,
      landmark_banner: formData.landmark_banner,

      architecture_image: formData.architecture_image,

      workflow_image: formData.workflow_image,

      product_image: formData.product_image,

      backgrounds: formData.backgrounds.filter(Boolean),

      event_types: formData.event_types
        .split("\n")
        .filter((item) => item.trim()),

      challenges: formData.challenges.filter(Boolean),

      intervention_intro: formData.intervention_intro,

      difficult_factors: formData.difficult_factors.filter(Boolean),

      my_role_intro: formData.my_role_intro,

      steps: [
        formData.step_1,
        formData.step_2,
        formData.step_3,
        formData.step_4,
        formData.step_5,
        formData.step_6,
        formData.step_7,
        formData.step_8,
        formData.step_9,
        formData.step_10,
        formData.step_11,
        formData.step_12,
        formData.step_13,
        formData.step_14,
        formData.step_15,
      ].filter(Boolean),

      my_role_points: [
          formData.my_role_1,
          formData.my_role_2,
          formData.my_role_3,
          formData.my_role_4,
          formData.my_role_5,
          formData.my_role_6,
          formData.my_role_7,
          formData.my_role_8,
          formData.my_role_9,
          formData.my_role_10,
          formData.my_role_11,
          formData.my_role_12,
          formData.my_role_13,
          formData.my_role_14,
          formData.my_role_15,
      ].filter(Boolean),

      results: formData.results
        .filter(Boolean)
        .map((text,index)=>({

          icon: icons[index],

          text

        })),

      stats: [
        {
          number: formData.stat1_number,
          label: formData.stat1_label,
        },
        {
          number: formData.stat2_number,
          label: formData.stat2_label,
        },
        {
          number: formData.stat3_number,
          label: formData.stat3_label,
        },
      ],

      landmark_title: formData.landmark_title,
      landmark_description: formData.landmark_description,
      client_said: formData.client_said,

      project_summary: {
        organisation: formData.organisation,
        region: formData.region,

        service_types: formData.service_types
          .split(",")
          .map((x) => x.trim()),

        stakeholders: formData.stakeholders,

        epic_modules: formData.epic_modules
          .split(",")
          .map((x) => x.trim()),

        specialties: formData.specialties,
        landmark: formData.landmark,
      },

      published: true,
    };

    if (isEditMode) {

  try {

    await API.put(
      `/case-studies/${slug}`,
      payload
    );

    setPopup({
      show: true,
      title: "Success",
      message: "Case Study Updated Successfully",
      type: "success",
    });

    setTimeout(() => {
      navigate("/list-edit-case-study");
    }, 1500);

  } catch (err: any) {

    if (err.response?.status === 409) {

      setPopup({
        show: true,
        title: "Duplicate Slug",
        message: "This slug already exists. Please choose another slug.",
        type: "error",
      });

      return;
    }

    console.error(err);
  }
} else {

      await createCaseStudy(payload);

       setPopup({
          show: true,
          title: "Published",
          message: "Case Study Published Successfully",
          type: "success",
        });

        setTimeout(() => {
          navigate("/list-edit-case-study");
        }, 1500);

    }
  };


  return (
    <div className="app-container ">

      <style>{`

      @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');

      :root {
        --red:#E64013;
        --red-dk:#C43410;
        --forest:#2A6049;
        --forest-dk:#1E4535;
        --forest-xdk:#0F2318;
        --sage:#3D8A68;
        --mint:#F5FAF7;
        --tint:#E8F4EF;
        --night:#0F2318;
        --white:#ffffff;
        --muted:#5A6E62;
        --border:#C8DDD0;
        --r:10px;
        --r-lg:16px;
        --sh-sm: 0 2px 10px rgba(15,35,24,.07);
        --sh-md: 0 6px 24px rgba(15,35,24,.12);
      }



      .app-container *::after {
        box-sizing:border-box;
        margin:0; padding:0;
      }

      html, body { overflow-x: hidden; width: 100%; scroll-behavior: smooth; }

      .app-container {
        font-family:'Montserrat',sans-serif;
        color:var(--night);
        background: var(--white);
        line-height: 1.7;
        -webkit-font-smoothing: antialiased;
        
      }

      .app-container h1,
      .app-container h2,
      .app-container h3 {
        font-family:'Comfortaa',sans-serif;
        line-height: 1.3;
      }
      
      .app-container a { color: inherit; text-decoration: none; }
      .app-container p { margin-bottom: 1em; }
      .app-container p:last-child { margin-bottom: 0; }
      
  .popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;

  align-items: flex-start; /* move upward */
  padding-top: 220px;      /* adjust height here */

  z-index: 9999;
}

.popup-card {
  background: #fff;
  border-radius: 16px;
  padding: 30px;
  width: 420px;
  max-width: 90%;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
}
      `}</style>

      {/* TOP BAR */}

      <div className="admin-topbar ">

        <button
          className="btn btn-red"
          onClick={handleSubmit}
        >
          {isEditMode
          ? "Update Artcile"
          : "Publish Artcile"}
        </button>

      </div>

      {/* HERO */}

      <header className="cs-hero">

        <div className="cs-hero-inner">

          <input
            className="hero-title-input"
            name="title"
            placeholder="Artcile Title"
            value={formData.title}
            onChange={handleChange}
          />

          <input
            name="slug"
            placeholder="article-slug (Make sure Slug much be unique for all article)"
            value={formData.slug}
            onChange={handleChange}
            style={{
              width:"100%",
              marginBottom:"20px",
              padding:"12px",
              borderRadius:"10px",
              border:"1px solid #C8DDD0"
            }}
          />

          <input
              name="filter_title"
              placeholder="Filter Title (Example: Clinical Transformation)"
              value={formData.filter_title}
              onChange={handleChange}
              style={{
                  width: "100%",
                  marginBottom: "20px",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #C8DDD0"
              }}
          />

          <textarea
            className="hero-subtitle-input"
            name="subtitle"
            placeholder="Article Subtitle"
            value={formData.subtitle}
            onChange={handleChange}
          />

          <div className="landmark-banner">

            <div className="lm-star">
              ★
            </div>

            <div style={{width:"100%"}}>

              <div
                style={{
                  fontSize:".7rem",
                  fontWeight:"700",
                  marginBottom:"8px"
                }}
              >
                LANDMARK ACHIEVEMENT
              </div>

              <textarea
                className="banner-input"
                name="landmark_banner"
                placeholder="Landmark Banner"
                value={formData.landmark_banner}
                onChange={handleChange}
              />

            </div>

          </div>

        </div>

      </header>



      
      {/* ── MAIN CONTENT + SIDEBAR ─────────────────────────────── */}


<section className="cs-section">

  <span className="section-label">
    Architecture Illustration
  </span>

  <h2>Architecture</h2>

  <select
    value={formData.architecture_image.image}
    onChange={(e) => {

      setFormData({
        ...formData,
        architecture_image: {
          ...formData.architecture_image,
          image: e.target.value,
        },
      });

    }}
    className="editor-input"
    style={{ width: "100%", marginTop: "20px" }}
  >

    <option value="">
      Select Image From Library
    </option>

    {images.map((img) => (

      <option
        key={img._id}
        value={img.url}
      >
        {img.original_name}
      </option>

    ))}

  </select>

  {formData.architecture_image.image && (

    <img
      src={`${import.meta.env.VITE_API_URL}${formData.architecture_image.image}`}
      style={{
        width: "100%",
        marginTop: "20px",
        borderRadius: "16px",
      }}
    />

  )}

  <textarea
    placeholder="Architecture Image Caption"
    value={formData.architecture_image.caption}
    onChange={(e) =>
      setFormData({
        ...formData,
        architecture_image: {
          ...formData.architecture_image,
          caption: e.target.value,
        },
      })
    }
    className="editor-textarea"
    style={{ marginTop: "20px" }}
  />

</section>


<div className="cs-layout">

  {/* LEFT SIDE */}

  <main>

    {/* Background */}

    <section className="cs-section" id="context">

      <span className="section-label">
        Context
      </span>

      <h2>
        Background
      </h2>

      <div className="context-box">

        {formData.backgrounds
          .slice(0, visibleBackgrounds)
          .map((text, index) => (

          <textarea
          key={index}
          value={text}
          placeholder={`Background Paragraph ${index + 1}`}
          className="editor-textarea"

          onChange={(e)=>{

          const arr=[...formData.backgrounds];

          arr[index]=e.target.value;

          setFormData({

          ...formData,

          backgrounds:arr

          });

          }}

          />

          ))}

          <div
style={{
display:"flex",
justifyContent:"center",
marginTop:"20px"
}}
>

<button

type="button"

onClick={addBackground}

style={{

width:"50px",

height:"50px",

borderRadius:"50%",

border:"none",

background:"#2A6049",

color:"#fff",

fontSize:"28px",

cursor:"pointer"

}}

>

+

</button>

</div>

      </div>


      <table className="nems-table">

        <thead>
          <tr>
            <th>
              Event Types
            </th>
          </tr>
        </thead>

        <tbody>

          <tr>

            <td>

              <textarea
                name="event_types"
                value={formData.event_types}
                onChange={handleChange}
                placeholder={`One event per line Like:-
ADT
Appointments
Referrals
Orders
Results`}
                className="editor-textarea"
              />

            </td>

          </tr>

        </tbody>

      </table>

    </section>



    {/* Challenge */}

    <section className="cs-section" id="problem">

      <span className="section-label">
        Problem
      </span>

      <h2>
        The Challenge
      </h2>

      <div className="problem-box">

        {formData.challenges
.slice(0, visibleChallenges)
.map((text,index)=>(

<textarea

key={index}

value={text}

placeholder={`Challenge Paragraph ${index+1}`}

className="editor-textarea"

onChange={(e)=>{

const arr=[...formData.challenges];

arr[index]=e.target.value;

setFormData({

...formData,

challenges:arr

});

}}

 />

))}

<div
style={{
display:"flex",
justifyContent:"center",
marginTop:"20px"
}}
>

<button

type="button"

onClick={addChallenge}

style={{

width:"50px",

height:"50px",

borderRadius:"50%",

border:"none",

background:"#2A6049",

color:"#fff",

fontSize:"28px",

cursor:"pointer"

}}

>

+

</button>

</div>

      </div>

    </section>

<section className="cs-section">

  <span className="section-label">
    Complexity
  </span>

  <h2>
    The Complexity
  </h2>

  <div className="problem-box">

    {formData.difficult_factors
      .slice(0, visibleDifficultFactors)
      .map((text, index) => (

        <textarea
          key={index}
          value={text}
          placeholder={`Complexity ${index + 1}`}
          className="editor-textarea"
          onChange={(e) => {

            const arr = [...formData.difficult_factors];

            arr[index] = e.target.value;

            setFormData({
              ...formData,
              difficult_factors: arr
            });

          }}
        />

      ))}

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "20px"
      }}
    >

      <button
        type="button"
        onClick={() => {

          if (visibleDifficultFactors >= 5) return;

          setVisibleDifficultFactors(prev => prev + 1);

          setFormData(prev => ({
            ...prev,
            difficult_factors: [...prev.difficult_factors, ""]
          }));

        }}
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          border: "none",
          background: "#2A6049",
          color: "#fff",
          fontSize: "28px",
          cursor: "pointer"
        }}
      >

        +

      </button>

    </div>

  </div>

</section>

<section className="cs-section">

  <span className="section-label">
    Workflow / Process Diagram
  </span>

  <h2>Workflow</h2>

  <select
    value={formData.workflow_image.image}
    onChange={(e) => {

      setFormData({
        ...formData,
        workflow_image: {
          ...formData.workflow_image,
          image: e.target.value,
        },
      });

    }}
    className="editor-input"
    style={{ width: "100%", marginTop: "20px" }}
  >

    <option value="">
      Select Image From Library
    </option>

    {images.map((img) => (

      <option
        key={img._id}
        value={img.url}
      >
        {img.original_name}
      </option>

    ))}

  </select>






  {formData.workflow_image.image && (

    <img
      src={`${import.meta.env.VITE_API_URL}${formData.workflow_image.image}`}
      style={{
        width: "100%",
        marginTop: "20px",
        borderRadius: "16px",
      }}
    />

  )}

  <textarea
    placeholder="Workflow Image Caption"
    value={formData.workflow_image.caption}
    onChange={(e) =>
      setFormData({
        ...formData,
        workflow_image: {
          ...formData.workflow_image,
          caption: e.target.value,
        },
      })
    }
    className="editor-textarea"
    style={{ marginTop: "20px" }}
  />

</section>


    




    {/* Intervention */}

    <section
      className="cs-section"
      id="intervention"
    >

      <span className="section-label">
        Approach
      </span>

      <h2>
        The Approach
      </h2>

      <textarea
        name="intervention_intro"
        value={formData.intervention_intro}
        onChange={handleChange}
        placeholder="Intervention Intro"
        className="editor-textarea"
      />

      <ul className="int-list">

  {Array.from(
    { length: visibleSteps },
    (_, index) => {

      const stepNo = index + 1;

      return (

        <li key={stepNo}>

          <span className="int-bullet">
            {String(stepNo).padStart(2, "0")}
          </span>

          <input
            name={`step_${stepNo}`}
            value={
              formData[
                `step_${stepNo}` as keyof typeof formData
              ] as string
            }
            onChange={handleChange}
            placeholder={`Step ${stepNo}`}
            className="editor-input"
          />

        </li>

      );

    }
  )}

</ul>

<div
  style={{
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  }}
>

  <button
    type="button"
    onClick={addStep}
    style={{
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      border: "none",
      background: "#2A6049",
      color: "#fff",
      fontSize: "28px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    +
  </button>

</div>

    </section>

    {/* Outcome */}

    <section
      className="cs-section"
      id="outcome"
    >

      <span className="section-label">
        Results & Impact
      </span>

      <h2>
        Outcomes
      </h2>

      <div className="outcome-grid">

{formData.results
.slice(0,visibleResults)
.map((text,index)=>(

<div
className="out-card"
key={index}
>

<span className="out-icon">

{["⚡","🔒","⏱️","🧩","📈","💰","🚀","🎯","🏆","⭐"][index]}

</span>

<textarea

value={text}

placeholder={`Result ${index+1}`}

className="editor-textarea"

onChange={(e)=>{

const arr=[...formData.results];

arr[index]=e.target.value;

setFormData({

...formData,

results:arr

});

}}

 />

</div>

))}

</div>
<div
style={{
display:"flex",
justifyContent:"center",
marginTop:"20px"
}}
>

<button

type="button"

onClick={addResult}

style={{
width:"50px",
height:"50px",
borderRadius:"50%",
border:"none",
background:"#2A6049",
color:"#fff",
fontSize:"28px",
cursor:"pointer"
}}

>

+

</button>

</div>


<section className="cs-section">

  <span className="section-label">
    My Role
  </span>

  <h2>
    My Contribution
  </h2>

  <textarea
    name="my_role_intro"
    value={formData.my_role_intro}
    onChange={handleChange}
    placeholder="My Role Intro"
    className="editor-textarea"
  />

  <ul className="int-list">

    {Array.from(
      { length: visibleMyRoleSteps },
      (_, index) => {

        const stepNo = index + 1;

        return (

          <li key={stepNo}>

            <span className="int-bullet">
              {String(stepNo).padStart(2, "0")}
            </span>

            <input
              name={`my_role_${stepNo}`}
              value={
                formData[
                  `my_role_${stepNo}` as keyof typeof formData
                ] as string
              }
              onChange={handleChange}
              placeholder={`Role ${stepNo}`}
              className="editor-input"
            />

          </li>

        );

      }
    )}

  </ul>

  <div
    style={{
      display: "flex",
      justifyContent: "center",
      marginTop: "20px",
    }}
  >

    <button
      type="button"
      onClick={() => {

        if (visibleMyRoleSteps >= 15) return;

        setVisibleMyRoleSteps(prev => prev + 1);

      }}
      style={{
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        border: "none",
        background: "#2A6049",
        color: "#fff",
        fontSize: "28px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      +
    </button>

  </div>

</section>


<section className="cs-section">

    <span className="section-label">
        Client Feedback
    </span>

    <h2>
        What the Client Said?
    </h2>

    <textarea
        name="client_said"
        value={formData.client_said}
        onChange={handleChange}
        placeholder="Write client testimonial..."
        className="editor-textarea"
        rows={8}
    />

</section>



<section className="cs-section">

  <span className="section-label">
    Real Product Screenshot
  </span>

  <h2>Product Screenshot</h2>

  <select
    value={formData.product_image.image}
    onChange={(e) => {

      setFormData({
        ...formData,
        product_image: {
          ...formData.product_image,
          image: e.target.value,
        },
      });

    }}
    className="editor-input"
    style={{ width: "100%", marginTop: "20px" }}
  >

    <option value="">
      Select Image From Library
    </option>

    {images.map((img) => (

      <option
        key={img._id}
        value={img.url}
      >
        {img.original_name}
      </option>

    ))}

  </select>

  {formData.product_image.image && (

    <img
      src={`${import.meta.env.VITE_API_URL}${formData.product_image.image}`}
      style={{
        width: "100%",
        marginTop: "20px",
        borderRadius: "16px",
      }}
    />

  )}

  <textarea
    placeholder="Product Screenshot Caption"
    value={formData.product_image.caption}
    onChange={(e) =>
      setFormData({
        ...formData,
        product_image: {
          ...formData.product_image,
          caption: e.target.value,
        },
      })
    }
    className="editor-textarea"
    style={{ marginTop: "20px" }}
  />

</section>


            {/* Stats Callout */}

      <div className="stat-callout">

        <div className="sc-item">

          <input
            name="stat1_number"
            value={formData.stat1_number}
            onChange={handleChange}
            placeholder="99%"
            className="stat-number-input"
          />

          <input
            name="stat1_label"
            value={formData.stat1_label}
            onChange={handleChange}
            placeholder="Stat Label"
            className="stat-label-input"
          />

        </div>

        <div className="sc-divider"></div>

        <div className="sc-item">

          <input
            name="stat2_number"
            value={formData.stat2_number}
            onChange={handleChange}
            placeholder="250k"
            className="stat-number-input"
          />

          <input
            name="stat2_label"
            value={formData.stat2_label}
            onChange={handleChange}
            placeholder="Stat Label"
            className="stat-label-input"
          />

        </div>

        <div className="sc-divider"></div>

        <div className="sc-item">

          <input
            name="stat3_number"
            value={formData.stat3_number}
            onChange={handleChange}
            placeholder="24/7"
            className="stat-number-input"
          />

          <input
            name="stat3_label"
            value={formData.stat3_label}
            onChange={handleChange}
            placeholder="Stat Label"
            className="stat-label-input"
          />

        </div>

      </div>

      {/* Landmark Section */}

      <div className="landmark-section">

        <div className="lm-icon-lg">
          🏆
        </div>

        <div style={{ width: "100%" }}>

          <input
            name="landmark_title"
            value={formData.landmark_title}
            onChange={handleChange}
            placeholder="Key Takeaway Title"
            className="landmark-title-input"
          />

          <textarea
            name="landmark_description"
            value={formData.landmark_description}
            onChange={handleChange}
            placeholder="Key Takeaway Description"
            className="landmark-desc-input"
          />

        </div>

      </div>

    </section>

  </main>

  {/* SIDEBAR */}

  <aside className="sidebar">

    <div className="sidebar-card">

      <div className="sb-head">

        <p className="sb-eyebrow">
          Overview
        </p>

        <p className="sb-title">
          About This Article
        </p>

      </div>

      <div className="sb-rows">

        <div className="sb-row">

          <span className="sb-ico">👤</span>

          <div>

            <p className="sb-k">
              About
            </p>

            <input
              name="organisation"
              value={formData.organisation}
              onChange={handleChange}
              placeholder="e.g., NHS Trust"
              className="sidebar-input"
            />

          </div>

        </div>

        <div className="sb-row">

          <span className="sb-ico">📍</span>

          <div>

            <p className="sb-k">
              Location
            </p>

            <input
              name="region"
              value={formData.region}
              onChange={handleChange}
              placeholder="e.g., London, UK"
              className="sidebar-input"
            />

          </div>

        </div>

        <div className="sb-row">

          <span className="sb-ico">🔎</span>

          <div>

            <p className="sb-k">
              Focus
            </p>

            <textarea
              name="service_types"
              value={formData.service_types}
              onChange={handleChange}
              className="sidebar-textarea"
              placeholder="Design & Build,System Integration"
            />

          </div>

        </div>

        <div className="sb-row">

          <span className="sb-ico">👥</span>

          <div>

            <p className="sb-k">
              People Involved
            </p>

            <textarea
              name="stakeholders"
              value={formData.stakeholders}
              onChange={handleChange}
              className="sidebar-textarea"
              placeholder="e.g., Consultants, Nurses, Clinicians"
            />

          </div>

        </div>

        <div className="sb-row">

          <span className="sb-ico">💻</span>

          <div>

            <p className="sb-k">
              Technology
            </p>

            <textarea
              name="epic_modules"
              value={formData.epic_modules}
              onChange={handleChange}
              className="sidebar-textarea"
              placeholder="Ambulatory,Community"
            />

          </div>

        </div>

        <div className="sb-row">

          <span className="sb-ico">🎯</span>

          <div>

            <p className="sb-k">
              Area
            </p>

            <textarea
              name="specialties"
              value={formData.specialties}
              onChange={handleChange}
              className="sidebar-textarea"
              placeholder="e.g., Cardiology, Oncology"
            />

          </div>

        </div>

        <div className="sb-row">

          <span className="sb-ico">💡</span>

          <div>

            <p className="sb-k">
              Key Insight
            </p>

            <textarea
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              className="sidebar-textarea"
              placeholder="e.g., First in region to..."
            />

          </div>

        </div>

      </div>

      

    </div>

    

  </aside>

</div>

{popup.show && (
  <div className="popup-overlay">
    <div
  className="popup-card"
  style={{ position: "relative" }}
>

  <button
  onClick={() =>
    setPopup({
      ...popup,
      show: false,
    })
  }
  style={{
    position: "absolute",
    top: "1px",
    right: "18px",

    width: "0px",
    height: "45px",

    border: "none",
    borderRadius: "50%",

    background: "#f3f3f3",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    cursor: "pointer",

    fontSize: "24px",
    fontWeight: "600",
    color: "#555",

    transition: "0.25s",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#E64013";
    e.currentTarget.style.color = "#fff";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#f3f3f3";
    e.currentTarget.style.color = "#555";
  }}
>
  ✕
</button>
      <div
        className={`popup-icon ${
          popup.type === "success"
            ? "success"
            : "error"
        }`}
      >
        {popup.type === "success" ? "✓" : "!"}
      </div>

      <h3>{popup.title}</h3>

      <p>{popup.message}</p>

     
    </div>
  </div>
)}

</div>
);
}
