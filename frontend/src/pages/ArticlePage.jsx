import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import "../styles/articlePage.css";

import Footer from "../components/Footer";


const API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");


const ArticlePage = () => {

  const navigate = useNavigate();


  const [articles, setArticles] = useState([]);

  const [featuredArticle, setFeaturedArticle] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  /* =========================================================
     PAGE LOAD

     1. Start from top whenever ArticlePage opens
     2. Add article-page-active class for navbar styling
  ========================================================= */

  useEffect(() => {

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });


    document.body.classList.add(
      "article-page-active"
    );


    return () => {

      document.body.classList.remove(
        "article-page-active"
      );

    };

  }, []);


  /* =========================================================
     IMAGE URL
  ========================================================= */

  const getImageUrl = (image) => {

    if (!image) {
      return "";
    }


    const imagePath =
      typeof image === "string"
        ? image
        : image?.image ||
          image?.url ||
          image?.src ||
          "";


    if (!imagePath) {
      return "";
    }


    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {

      return imagePath;

    }


    return `${API}${
      imagePath.startsWith("/")
        ? ""
        : "/"
    }${imagePath}`;

  };


  /* =========================================================
     REAL BACKEND IMAGE

     Backend article structure contains:

     product_image
     workflow_image
     architecture_image

     We use the first available image.
  ========================================================= */

  const getArticleImage = (article) => {

    return (
      getImageUrl(article?.product_image) ||
      getImageUrl(article?.workflow_image) ||
      getImageUrl(article?.architecture_image) ||
      getImageUrl(article?.image) ||
      getImageUrl(article?.coverImage) ||
      getImageUrl(article?.cover_image) ||
      ""
    );

  };


  /* =========================================================
     REAL CATEGORY
  ========================================================= */

  const getCategory = (article) => {

    return (
      article?.category ||
      article?.industry ||
      article?.type ||
      article?.sector ||
      article?.reviewType ||
      ""
    );

  };


  /* =========================================================
     REAL DESCRIPTION

     No fake fallback text.
  ========================================================= */

  const getDescription = (article) => {

    return (
      article?.description ||
      article?.summary ||
      article?.shortDescription ||
      article?.overview ||
      article?.challenge ||
      article?.problem ||
      article?.subtitle ||
      ""
    );

  };


  /* =========================================================
     REAL DATE
  ========================================================= */

  const getDate = (article) => {

    const value =
      article?.date ||
      article?.publishedAt ||
      article?.createdAt ||
      article?.updatedAt;


    if (!value) {
      return "";
    }


    const parsedDate = new Date(value);


    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      return "";

    }


    return parsedDate.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    );

  };


  /* =========================================================
     REAL READ TIME
  ========================================================= */

  const getReadTime = (article) => {

    if (!article) {
      return "";
    }


    /*
      If backend already provides readTime,
      use the real value.
    */

    if (article?.readTime) {

      return String(
        article.readTime
      ).includes("read")
        ? article.readTime
        : `${article.readTime} min read`;

    }


    /*
      Build text from real backend fields
      to estimate reading time.
    */

    const realText = [

      article?.title,

      article?.subtitle,

      article?.description,

      article?.summary,

      article?.overview,

      article?.challenge,

      article?.problem,

      article?.solution,

      article?.intervention_intro,

      article?.my_role_intro,

      article?.landmark_description,

      article?.client_said,

      ...(Array.isArray(article?.backgrounds)
        ? article.backgrounds
        : []),

      ...(Array.isArray(article?.challenges)
        ? article.challenges
        : []),

      ...(Array.isArray(article?.steps)
        ? article.steps
        : []),

      ...(Array.isArray(article?.my_role_points)
        ? article.my_role_points
        : []),

    ]
      .filter(Boolean)
      .join(" ");


    if (!realText.trim()) {
      return "";
    }


    const words = realText
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .length;


    const minutes = Math.max(
      1,
      Math.ceil(words / 200)
    );


    return `${minutes} min read`;

  };


  /* =========================================================
     OPEN ARTICLE

     IMPORTANT:

     Article listing URL:
       /article

     Article detail URL:
       /articles/:slug

     Example:
       /articles/test11
  ========================================================= */

  const openArticle = (article) => {

    if (!article?.slug) {

      console.warn(
        "Article has no slug:",
        article
      );

      return;

    }


    navigate(
      `/articles/${encodeURIComponent(
        article.slug
      )}`
    );

  };


  /* =========================================================
     LOAD REAL DATA
  ========================================================= */

  useEffect(() => {

    let cancelled = false;


    const loadArticles = async () => {

      setLoading(true);

      setError("");


      try {

        const [
          articlesResponse,
          featuredResponse,
        ] = await Promise.all([

          fetch(
            `${API}/case-studies`
          ),

          fetch(
            `${API}/featured-case-study`
          ),

        ]);


        /* ===============================================
           ARTICLES RESPONSE
        =============================================== */

        if (!articlesResponse.ok) {

          throw new Error(
            "Unable to load articles."
          );

        }


        const articlesData =
          await articlesResponse.json();


        /* ===============================================
           FEATURED RESPONSE

           Featured endpoint may not exist or may
           return an error. That should NOT prevent
           normal articles from loading.
        =============================================== */

        let featuredData = null;


        if (featuredResponse.ok) {

          featuredData =
            await featuredResponse.json();

        }


        if (cancelled) {
          return;
        }


        /* ===============================================
           ONLY REAL BACKEND DATA
        =============================================== */

        const realArticles =
          Array.isArray(articlesData)
            ? articlesData
            : [];


        setArticles(
          realArticles
        );


        setFeaturedArticle(

          featuredData &&
          typeof featuredData === "object" &&
          !Array.isArray(featuredData)

            ? featuredData

            : null

        );

      } catch (err) {

        console.error(
          "Article loading error:",
          err
        );


        if (!cancelled) {

          setError(
            err?.message ||
            "Unable to load articles."
          );


          setArticles([]);

          setFeaturedArticle(null);

        }

      } finally {

        if (!cancelled) {

          setLoading(false);

        }

      }

    };


    loadArticles();


    return () => {

      cancelled = true;

    };

  }, []);


  /* =========================================================
     REMOVE FEATURED FROM NORMAL ARTICLE LIST
  ========================================================= */

  const normalArticles = useMemo(() => {

    if (!featuredArticle?.slug) {

      return articles;

    }


    return articles.filter(
      (article) =>
        article?.slug !==
        featuredArticle.slug
    );

  }, [
    articles,
    featuredArticle,
  ]);


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <main className="articles-page">


      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="article-background">

        <span className="bg-circle bg-circle-1" />

        <span className="bg-circle bg-circle-2" />

        <span className="bg-circle bg-circle-3" />

        <span className="bg-circle bg-circle-4" />

        <span className="bg-circle bg-circle-5" />


        <span className="bg-ring bg-ring-1" />

        <span className="bg-ring bg-ring-2" />

        <span className="bg-ring bg-ring-3" />

        <span className="bg-ring bg-ring-4" />


        <span className="bg-dot-pattern" />

      </div>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="articles-content">


        {/* ===================================================
            HEADER
        =================================================== */}

        <section className="articles-intro">

          <div className="intro-pill">

            YUKTIC / ARTICLES

          </div>


          <h1>

            Ideas worth

            <br />

            <span>
              exploring.
            </span>

          </h1>


          <p>

            Stories, experiences and insights
            from the digital products we create.

          </p>

        </section>


        {/* ===================================================
            LOADING
        =================================================== */}

        {loading && (

          <section className="articles-state">

            <div className="loading-circle" />

            <p>
              Loading articles...
            </p>

          </section>

        )}


        {/* ===================================================
            ERROR
        =================================================== */}

        {!loading && error && (

          <section className="articles-state">

            <div className="state-icon">
              !
            </div>


            <h3>
              Something went wrong
            </h3>


            <p>
              {error}
            </p>

          </section>

        )}


        {/* ===================================================
            FEATURED ARTICLE
        =================================================== */}

        {!loading &&
          !error &&
          featuredArticle && (

            <section className="featured-article">


              {/* FEATURED CONTENT */}

              <div
                className="featured-content"
                onClick={() =>
                  openArticle(
                    featuredArticle
                  )
                }
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {

                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {

                    event.preventDefault();

                    openArticle(
                      featuredArticle
                    );

                  }

                }}
              >

                <div className="featured-meta">

                  <span>
                    ARTICLE
                  </span>


                  {getDate(
                    featuredArticle
                  ) && (

                    <>

                      <i />

                      <span>
                        {getDate(
                          featuredArticle
                        )}
                      </span>

                    </>

                  )}

                </div>


                <h2>
                  {featuredArticle.title}
                </h2>


                {getDescription(
                  featuredArticle
                ) && (

                  <p>
                    {getDescription(
                      featuredArticle
                    )}
                  </p>

                )}

              </div>


              {/* FEATURED IMAGE */}

              <div
                className="featured-visual"
                onClick={() =>
                  openArticle(
                    featuredArticle
                  )
                }
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {

                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {

                    event.preventDefault();

                    openArticle(
                      featuredArticle
                    );

                  }

                }}
              >

                {getArticleImage(
                  featuredArticle
                ) ? (

                  <img
                    src={getArticleImage(
                      featuredArticle
                    )}
                    alt={
                      featuredArticle.title ||
                      "Article"
                    }
                  />

                ) : (

                  <div className="featured-placeholder">

                    <span className="placeholder-circle placeholder-one" />

                    <span className="placeholder-circle placeholder-two" />

                    <span className="placeholder-circle placeholder-three" />

                    <span className="placeholder-label">
                      ARTICLE
                    </span>

                  </div>

                )}

              </div>

            </section>

          )}


        {/* ===================================================
            ARTICLES
        =================================================== */}

        {!loading &&
          !error &&
          normalArticles.length > 0 && (

            <section className="articles-section">


              {/* SECTION HEADING */}

              <div className="section-heading">

                <div>

                  <span className="section-eyebrow">
                    ARTICLES
                  </span>


                  <h2>

                    More to

                    <span>
                      explore.
                    </span>

                  </h2>

                </div>

              </div>


              {/* ARTICLES GRID */}

              <div className="articles-grid">

                {normalArticles.map(
                  (article, index) => {

                    const image =
                      getArticleImage(
                        article
                      );


                    const description =
                      getDescription(
                        article
                      );


                    const category =
                      getCategory(
                        article
                      );


                    const date =
                      getDate(
                        article
                      );


                    const readTime =
                      getReadTime(
                        article
                      );


                    return (

                      <article

                        key={
                          article?._id ||
                          article?.slug ||
                          index
                        }

                        className="article-card"

                        onClick={() =>
                          openArticle(
                            article
                          )
                        }

                        role="button"

                        tabIndex={0}

                        onKeyDown={(event) => {

                          if (
                            event.key === "Enter" ||
                            event.key === " "
                          ) {

                            event.preventDefault();

                            openArticle(
                              article
                            );

                          }

                        }}

                      >


                        {/* =================================
                            IMAGE
                        ================================= */}

                        <div className="card-visual">


                          {image ? (

                            <img

                              src={image}

                              alt={
                                article?.title ||
                                "Article"
                              }

                            />

                          ) : (

                            <div className="card-placeholder">

                              <span className="mini-circle mini-one" />

                              <span className="mini-circle mini-two" />

                              <span className="mini-circle mini-three" />


                              <span>
                                ARTICLE
                              </span>

                            </div>

                          )}


                          <div className="card-number">

                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}

                          </div>

                        </div>


                        {/* =================================
                            CONTENT
                        ================================= */}

                        <div className="card-content">


                          <div className="card-meta">

                            <span>
                              ARTICLE
                            </span>


                            {category && (

                              <>

                                <i />

                                <span>
                                  {category}
                                </span>

                              </>

                            )}


                            {date && (

                              <>

                                <i />

                                <span>
                                  {date}
                                </span>

                              </>

                            )}

                          </div>


                          <h3>
                            {article?.title}
                          </h3>


                          {description && (

                            <p>
                              {description}
                            </p>

                          )}


                          <div className="card-footer">

                            {readTime && (

                              <span>
                                {readTime}
                              </span>

                            )}


                            <span className="article-read-arrow">
                              →
                            </span>

                          </div>


                        </div>


                      </article>

                    );

                  }
                )}

              </div>

            </section>

          )}


        {/* ===================================================
            NO ARTICLES
        =================================================== */}

        {!loading &&
          !error &&
          !featuredArticle &&
          normalArticles.length === 0 && (

            <section className="articles-state">

              <div className="state-icon">
                +
              </div>


              <h3>
                No articles available
              </h3>

            </section>

          )}

      </div>


      {/* =====================================================
          CONTACT US
      ===================================================== */}

      <section className="article-contact-section2">


        <div className="contact-circle contact-circle-one" />

        <div className="contact-circle contact-circle-two" />

        <div className="contact-circle contact-circle-three" />


        <div className="contact-ring contact-ring-one" />

        <div className="contact-ring contact-ring-two" />


        <div className="article-contact-content">


          <h2>

            There is always

            <br />

            <span>
              more to create.
            </span>

          </h2>


          <p>

            Have a project in mind?
            Let&apos;s talk about how we can
            turn your idea into something meaningful.

          </p>


          <button

            type="button"

            className="contact-us-button"

            onClick={() => {

              navigate("/contact");


              window.setTimeout(() => {

                window.scrollTo({

                  top: 0,

                  left: 0,

                  behavior: "smooth",

                });

              }, 50);

            }}

          >

            <span>
              Contact Us
            </span>


            <span className="contact-button-arrow">
              ↗
            </span>

          </button>


        </div>

      </section>


      {/* =====================================================
          REAL FOOTER
      ===================================================== */}

      <Footer />


    </main>

  );

};


export default ArticlePage;