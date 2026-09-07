import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/aiBot.css";

const AiBot = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [footerVisible, setFooterVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Hey! 👋 I'm Yuktic AI. Ask me anything and I'll take you to the right place.",
    },
  ]);

  /*
  =========================================================
  FOOTER DETECTION
  =========================================================
  */

  useEffect(() => {
    const footer = document.querySelector("footer");

    if (!footer) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFooterVisible(entry.isIntersecting);
      },
      {
        threshold: 0.05,
      }
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);

  /*
  =========================================================
  CLOSE BOT WHEN FOOTER IS VISIBLE
  =========================================================
  */

  useEffect(() => {
    if (footerVisible) {
      setIsOpen(false);
    }
  }, [footerVisible]);

  /*
  =========================================================
  PAGE NAVIGATION
  =========================================================
  */

  const goToPage = (path) => {
    setIsOpen(false);

    navigate(path);

    /*
      Always start the new page from the top.
    */
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 50);
  };

  /*
  =========================================================
  AI NAVIGATION ENGINE
  =========================================================
  */

  const understandQuestion = (input) => {
    const text = input.toLowerCase().trim();

    /*
    HOME
    */
    const homeWords = [
      "home",
      "homepage",
      "main page",
      "go home",
      "take me home",
      "back to home",
      "yuktic home",
    ];

    /*
    ABOUT
    */
    const aboutWords = [
      "about",
      "who are you",
      "who is yuktic",
      "tell me about yuktic",
      "company",
      "about company",
      "about yuktic",
      "your company",
      "know more about yuktic",
      "learn about yuktic",
      "what is yuktic",
    ];

    /*
    SERVICES
    */
    const serviceWords = [
      "service",
      "services",
      "what do you do",
      "what does yuktic do",
      "what you do",
      "offer",
      "offerings",
      "solutions",
      "capabilities",
      "products",
      "technology services",
      "business services",
      "your services",
      "show services",
      "tell me your services",
    ];

    /*
    ARTICLES
    */
    const articleWords = [
      "article",
      "articles",
      "blog",
      "blogs",
      "read",
      "reading",
      "insights",
      "stories",
      "posts",
      "knowledge",
      "latest articles",
      "show articles",
      "read articles",
      "show blogs",
      "read blog",
    ];

    /*
    CONTACT
    */
    const contactWords = [
      "contact",
      "contact you",
      "contact yuktic",
      "talk to you",
      "talk to yuktic",
      "reach you",
      "reach yuktic",
      "get in touch",
      "connect",
      "connection",
      "email you",
      "phone you",
      "contact page",
      "how can i contact",
      "where can i contact",
    ];

    /*
    JOBS
    */
    const jobWords = [
      "job",
      "jobs",
      "career",
      "careers",
      "vacancy",
      "vacancies",
      "hiring",
      "hire",
      "work",
      "work at yuktic",
      "join yuktic",
      "join your team",
      "open position",
      "open positions",
      "job openings",
      "career opportunities",
      "employment",
      "recruitment",
      "looking for a job",
      "looking for jobs",
      "available jobs",
    ];

    /*
    FEEDBACK
    */
    const feedbackWords = [
      "feedback",
      "give feedback",
      "send feedback",
      "review",
      "suggestion",
      "suggestions",
      "complaint",
      "complaints",
      "share my feedback",
    ];

    /*
    =========================================================
    SCORING SYSTEM

    Instead of checking only one exact word,
    we calculate which page has the strongest match.
    =========================================================
    */

    const scores = {
      "/": 0,
      "/about": 0,
      "/services": 0,
      "/article": 0,
      "/contact": 0,
      "/jobs": 0,
      "/feedback": 0,
    };

    const addScore = (words, path) => {
      words.forEach((word) => {
        if (text.includes(word)) {
          /*
            Longer phrases get more importance.
          */
          scores[path] += word.length > 8 ? 3 : 1;
        }
      });
    };

    addScore(homeWords, "/");
    addScore(aboutWords, "/about");
    addScore(serviceWords, "/services");
    addScore(articleWords, "/article");
    addScore(contactWords, "/contact");
    addScore(jobWords, "/jobs");
    addScore(feedbackWords, "/feedback");

    /*
    =========================================================
    EXTRA CONTEXTUAL UNDERSTANDING
    =========================================================
    */

    if (
      text.includes("team") ||
      text.includes("company history") ||
      text.includes("mission") ||
      text.includes("vision")
    ) {
      scores["/about"] += 5;
    }

    if (
      text.includes("development") ||
      text.includes("design") ||
      text.includes("consulting") ||
      text.includes("ai solution") ||
      text.includes("software solution")
    ) {
      scores["/services"] += 4;
    }

    if (
      text.includes("apply") ||
      text.includes("resume") ||
      text.includes("cv") ||
      text.includes("developer position") ||
      text.includes("developer job")
    ) {
      scores["/jobs"] += 5;
    }

    if (
      text.includes("message you") ||
      text.includes("send you a message") ||
      text.includes("speak with someone")
    ) {
      scores["/contact"] += 5;
    }

    /*
    =========================================================
    FIND HIGHEST SCORE
    =========================================================
    */

    let bestPage = "/";
    let bestScore = 0;

    Object.entries(scores).forEach(([path, score]) => {
      if (score > bestScore) {
        bestScore = score;
        bestPage = path;
      }
    });

    /*
    Nothing understood.
    */
    if (bestScore === 0) {
      return null;
    }

    return bestPage;
  };

  /*
  =========================================================
  FRIENDLY RESPONSE
  =========================================================
  */

  const getPageResponse = (path) => {
    switch (path) {
      case "/":
        return "Sure! Taking you back to the Yuktic home page. 🏠";

      case "/about":
        return "Sure! I'll take you to learn more about Yuktic. ✨";

      case "/services":
        return "Absolutely! Let's explore what Yuktic can do for you. 🚀";

      case "/article":
        return "Sure! I'll take you to our articles and insights. 📚";

      case "/contact":
        return "Of course! Let's get you to the contact page. 📩";

      case "/jobs":
        return "Looking for opportunities? I'll take you to our careers page. 💼";

      case "/feedback":
        return "Sure! I'll take you to the feedback page. 💬";

      default:
        return "I'll take you to the relevant page.";
    }
  };

  /*
  =========================================================
  ASK AI
  =========================================================
  */

  const askAi = () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isThinking) {
      return;
    }

    /*
      Add user's question.
    */
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: trimmedQuestion,
      },
    ]);

    setQuestion("");
    setIsThinking(true);

    /*
      Small delay makes the assistant feel natural.
    */
    setTimeout(() => {
      const destination = understandQuestion(trimmedQuestion);

      if (destination) {
        const response = getPageResponse(destination);

        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            text: response,
          },
        ]);

        setIsThinking(false);

        /*
          Navigate after response appears.
        */
        setTimeout(() => {
          goToPage(destination);
        }, 500);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            text: "I can help you navigate Yuktic. Try asking about our company, services, articles, jobs, contact details, or feedback. 😊",
          },
        ]);

        setIsThinking(false);
      }
    }, 450);
  };

  /*
  =========================================================
  ENTER KEY
  =========================================================
  */

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      askAi();
    }
  };

  /*
  =========================================================
  QUICK OPTIONS
  =========================================================
  */

  const handleQuickOption = (questionText) => {
    setQuestion(questionText);

    setTimeout(() => {
      const destination = understandQuestion(questionText);

      if (!destination) {
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          type: "user",
          text: questionText,
        },
        {
          type: "ai",
          text: getPageResponse(destination),
        },
      ]);

      setTimeout(() => {
        goToPage(destination);
      }, 450);
    }, 50);
  };

  /*
  =========================================================
  DO NOT SHOW WHEN FOOTER IS VISIBLE
  =========================================================
  */

  if (footerVisible) {
    return null;
  }

  return (
    <div className="ai-bot-wrapper">

      {/* =================================================
          CHAT PANEL
      ================================================= */}

      <div
        className={`ai-bot-chat ${
          isOpen ? "ai-bot-chat-open" : ""
        }`}
      >

        {/* HEADER */}

        <div className="ai-bot-chat-header">

          <div className="ai-bot-mini-avatar">
            ✦
          </div>

          <div>
            <strong>Yuktic AI</strong>
            <span>Navigation assistant</span>
          </div>

          <button
            className="ai-bot-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close AI assistant"
          >
            ×
          </button>

        </div>


        {/* BODY */}

        <div className="ai-bot-chat-body">

          <div className="ai-bot-messages">

            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.type === "user"
                    ? "ai-user-message"
                    : "ai-message"
                }
              >

                {message.type === "ai" && (
                  <div className="ai-message-avatar">
                    ✦
                  </div>
                )}

                <div
                  className={
                    message.type === "user"
                      ? "ai-user-message-bubble"
                      : "ai-message-bubble"
                  }
                >
                  {message.text}
                </div>

              </div>
            ))}

            {isThinking && (
              <div className="ai-message">

                <div className="ai-message-avatar">
                  ✦
                </div>

                <div className="ai-message-bubble ai-thinking">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

              </div>
            )}

          </div>


          {/* QUICK OPTIONS */}

          <div className="ai-bot-options">

            <button
              onClick={() =>
                handleQuickOption("Tell me about Yuktic")
              }
            >
              ✦ About Yuktic
            </button>

            <button
              onClick={() =>
                handleQuickOption("What services do you provide?")
              }
            >
              ◈ Our Services
            </button>

            <button
              onClick={() =>
                handleQuickOption("Show me available jobs")
              }
            >
              ◉ Careers
            </button>

            <button
              onClick={() =>
                handleQuickOption("I want to contact Yuktic")
              }
            >
              ↗ Contact Us
            </button>

          </div>


          {/* INPUT */}

          <div className="ai-bot-input-wrapper">

            <input
              type="text"
              value={question}
              onChange={(event) =>
                setQuestion(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              aria-label="Ask Yuktic AI"
            />

            <button
              className="ai-bot-send"
              onClick={askAi}
              disabled={!question.trim() || isThinking}
              aria-label="Send question"
            >
              ↑
            </button>

          </div>

        </div>

      </div>


      {/* =================================================
          FLOATING BOT
      ================================================= */}

      <button
        className={`ai-bot-float ${
          isOpen ? "ai-bot-float-active" : ""
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open Yuktic AI assistant"
      >

        <span className="ai-bot-glow"></span>

        <span className="ai-bot-orbit"></span>

        <span className="ai-bot-face">

          <span className="ai-bot-antenna">
            <span></span>
          </span>

          <span className="ai-bot-eyes">
            <span></span>
            <span></span>
          </span>

          <span className="ai-bot-smile"></span>

        </span>

        <span className="ai-bot-notification">
          1
        </span>

      </button>


      {/* =================================================
          LABEL
      ================================================= */}

      {!isOpen && (
        <div className="ai-bot-label">

          <span>Need help?</span>

          <strong>Ask Yuktic AI</strong>

        </div>
      )}

    </div>
  );
};

export default AiBot;