
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7faf8]">

      {/* Mesh Background */}
      <div className="absolute inset-0 pointer-events-none">

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #2A6049 1px, transparent 1px),
              linear-gradient(to bottom, #2A6049 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Top Blob */}
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-emerald-200/40 blur-3xl" />

        {/* Right Blob */}
        <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-green-300/30 blur-3xl" />

        {/* Bottom Blob */}
        <div className="absolute -bottom-48 left-1/3 w-[700px] h-[700px] rounded-full bg-teal-200/30 blur-3xl" />

        {/* Dot Texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(#2A6049 0.8px, transparent 0.8px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <AdminSidebar />

      <main className="relative lg:ml-72 min-h-screen p-4 pt-24 lg:p-8 lg:pt-8">

        <div
          className="
            relative
            min-h-[calc(100vh-64px)]
            rounded-[32px]
            border
            border-white/70
            bg-white/75
            backdrop-blur-2xl
            shadow-[0_20px_80px_rgba(15,35,24,0.12)]
            overflow-hidden
          "
        >


          {/* Internal Pattern */}
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #2A6049 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative p-6 lg:p-10">
            <Outlet />
          </div>

        </div>

      </main>
    </div>
  );
};

export default AdminLayout;