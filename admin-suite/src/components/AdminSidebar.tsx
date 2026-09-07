import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  ListTodo,
  Users,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  MessageSquareText,
  Quote,
  Image,
  Plus,
  ClipboardList,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

import Logo from "../assets/Yukticlogo.png";
import "../style/AdminSidebar.css";

type ChildItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
};

type MenuItem = {
  name: string;
  path?: string;
  icon: React.ReactNode;
  isClickable: boolean;
  children?: ChildItem[];
};

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const location = useLocation();
  const currentPath = location.pathname;
  const role = localStorage.getItem("role") || "admin";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 80);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    window.location.href = "/login";
  };

  const menu: MenuItem[] = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} strokeWidth={2.1} />,
      isClickable: true,
    },

    {
      name: "Article",
      icon: <BriefcaseBusiness size={18} strokeWidth={2.1} />,
      isClickable: false,
      children: [
        {
          name: "Image Library",
          path: "/image-library",
          icon: <Image size={15} strokeWidth={2.1} />,
        },
        {
          name: "Create Article",
          path: "/create-case-study",
          icon: <Plus size={15} strokeWidth={2.4} />,
        },
        {
          name: "List & Edit",
          path: "/list-edit-case-study",
          icon: <ClipboardList size={15} strokeWidth={2.1} />,
        },
      ],
    },

   

    {
      name: "Jobs",
      icon: <BriefcaseBusiness size={18} strokeWidth={2.1} />,
      isClickable: false,
      children: [
        {
          name: "Create Job",
          path: "/create-job",
          icon: <Plus size={15} strokeWidth={2.4} />,
        },
        {
          name: "List & Edit",
          path: "/list-edit-job",
          icon: <ClipboardList size={15} strokeWidth={2.1} />,
        },
      ],
    },

    // {
    //   name: "Feedback",
    //   icon: <MessageSquareText size={18} strokeWidth={2.1} />,
    //   isClickable: false,
    //   children: [
    //     {
    //       name: "Responses",
    //       path: "/feedback-responses",
    //       icon: <ListTodo size={15} strokeWidth={2.1} />,
    //     },
    //     {
    //       name: "Request Tracker",
    //       path: "/feedback-request-tracker",
    //       icon: <Bell size={15} strokeWidth={2.1} />,
    //     },
    //   ],
    // },

    {
      name: "Testimonials",
      path: "/testimonials",
      icon: <Quote size={18} strokeWidth={2.1} />,
      isClickable: true,
    },

    {
      name: "Contacts",
      path: "/contact",
      icon: <Users size={18} strokeWidth={2.1} />,
      isClickable: true,
    },

    {
      name: "Security",
      path: "/change-password",
      icon: <KeyRound size={18} strokeWidth={2.1} />,
      isClickable: true,
    },

    ...(role === "developer"
      ? [
          {
            name: "Reset Key",
            path: "/reset-admin-password",
            icon: <ShieldCheck size={18} strokeWidth={2.1} />,
            isClickable: true,
          },
        ]
      : []),

    {
      name: "Sign Out",
      path: "#",
      icon: <LogOut size={18} strokeWidth={2.1} />,
      isClickable: false,
    },
  ];

  useEffect(() => {
    setIsOpen(false);

    const activeParent = menu.find(
      (item) =>
        item.children &&
        item.children.some(
          (child) => child.path === currentPath
        )
    );

    if (activeParent) {
      setOpenMenu(activeParent.name);
    }
  }, [currentPath]);

  const toggleMenu = (menuName: string) => {
    setOpenMenu((prev) =>
      prev === menuName ? "" : menuName
    );
  };

  const NavContent = () => (
    <nav className="admin-nav">
      <div className="admin-menu">
        {menu.map((item, index) => {
          const hasChildren =
            !!item.children &&
            item.children.length > 0;

          const isMenuOpen =
            openMenu === item.name;

          const isChildActive = hasChildren
            ? item.children?.some(
                (child) =>
                  child.path === currentPath
              )
            : false;

          const isLogout =
            item.name === "Sign Out";

          return (
            <div
              key={`${item.name}-${index}`}
              className={`admin-menu-group ${
                isLogout
                  ? "admin-logout-group"
                  : ""
              }`}
              style={
                {
                  "--item-index": index,
                } as React.CSSProperties
              }
            >
              {item.isClickable ? (
                <NavLink
                  to={item.path || "/"}
                  className={({ isActive }) =>
                    `admin-nav-button ${
                      isActive
                        ? "admin-nav-active"
                        : ""
                    }`
                  }
                >
                  <span className="admin-icon-box">
                    {item.icon}
                  </span>

                  <span className="admin-nav-text">
                    {item.name}
                  </span>

                  <span className="admin-nav-arrow">
                    →
                  </span>
                </NavLink>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (isLogout) {
                      handleLogout();
                      return;
                    }

                    if (hasChildren) {
                      toggleMenu(item.name);
                    }
                  }}
                  className={`admin-nav-button ${
                    isChildActive
                      ? "admin-parent-active"
                      : ""
                  } ${
                    isLogout
                      ? "admin-logout-button"
                      : ""
                  }`}
                >
                  <span className="admin-icon-box">
                    {item.icon}
                  </span>

                  <span className="admin-nav-text">
                    {item.name}
                  </span>

                  {hasChildren && (
                    <ChevronDown
                      size={16}
                      className={`admin-chevron ${
                        isMenuOpen
                          ? "admin-chevron-open"
                          : ""
                      }`}
                    />
                  )}

                  {isLogout && (
                    <span className="admin-nav-arrow">
                      →
                    </span>
                  )}
                </button>
              )}

              {hasChildren && (
                <div
                  className={`admin-submenu ${
                    isMenuOpen
                      ? "admin-submenu-open"
                      : ""
                  }`}
                >
                  <div className="admin-submenu-inner">
                    {item.children?.map(
                      (child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            `admin-sub-link ${
                              isActive
                                ? "admin-sub-link-active"
                                : ""
                            }`
                          }
                        >
                          <span className="admin-sub-line" />

                          <span className="admin-sub-icon">
                            {child.icon}
                          </span>

                          <span>
                            {child.name}
                          </span>
                        </NavLink>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}

      <aside
        className={`admin-sidebar ${
          isLoaded
            ? "admin-sidebar-loaded"
            : ""
        }`}
      >
        {/* Background texture */}

        <div className="sidebar-grid" />
        <div className="sidebar-noise" />

        <div className="sidebar-circle circle-one" />
        <div className="sidebar-circle circle-two" />
        <div className="sidebar-circle circle-three" />

        {/* Top accent */}

        <div className="sidebar-top-line" />

        {/* ================= LOGO ================= */}

        <div className="admin-brand">
          <div className="admin-logo-orbit">
            <span className="orbit-dot orbit-dot-one" />
            <span className="orbit-dot orbit-dot-two" />

            <div className="admin-logo-circle">
              <img
                src={Logo}
                alt="Yuktic"
                className="admin-logo"
              />
            </div>
          </div>

          <div className="admin-brand-name">
            <span className="brand-main">
              YUKTIC
            </span>

            <span className="brand-small">
              ADMIN CONSOLE
            </span>
          </div>
        </div>

        {/* ================= NAVIGATION ================= */}

        <NavContent />
      </aside>

      {/* ================= MOBILE HEADER ================= */}

      <header className="admin-mobile-header">
        <div className="mobile-brand">
          <div className="mobile-logo-circle">
            <img
              src={Logo}
              alt="Yuktic"
            />
          </div>

          <div>
            <strong>YUKTIC</strong>
            <span>ADMIN</span>
          </div>
        </div>

        <button
          className="mobile-menu-button"
          onClick={() =>
            setIsOpen((prev) => !prev)
          }
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X size={21} />
          ) : (
            <Menu size={21} />
          )}
        </button>
      </header>

      {/* ================= MOBILE DRAWER ================= */}

      {isOpen && (
        <div className="admin-mobile-layer">
          <div
            className="mobile-backdrop"
            onClick={() =>
              setIsOpen(false)
            }
          />

          <aside className="admin-mobile-drawer">
            <div className="drawer-header">
              <div className="drawer-brand">
                <div className="drawer-logo">
                  <img
                    src={Logo}
                    alt="Yuktic"
                  />
                </div>

                <div>
                  <strong>YUKTIC</strong>
                  <span>
                    ADMIN CONSOLE
                  </span>
                </div>
              </div>

              <button
                className="drawer-close"
                onClick={() =>
                  setIsOpen(false)
                }
              >
                <X size={19} />
              </button>
            </div>

            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;