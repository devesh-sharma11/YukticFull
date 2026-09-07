// import { useEffect, useState } from "react";
// import API from "../services/api";

// type Request = {
//   _id: string;
//   requestId: string;
//   feedbackId?: string;

//   email: string;
//   subject: string;
//   message: string;

//   status: string;

//   opened: boolean;
//   submitted: boolean;

//   openCount: number;

//   openedAt: string | null;
//   submittedAt: string | null;

//   sentAt: string;
// };

// export default function FeedbackRequestTracker() {
//   const [requests, setRequests] = useState<Request[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchRequests = async () => {
//     try {
//       const res = await API.get("/feedback-requests");
//       setRequests(res.data);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to load tracker.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const deleteOne = async (id: string) => {
//     if (!window.confirm("Delete this record?")) return;

//     try {
//       await API.delete(`/feedback-requests/${id}`);
//       fetchRequests();
//     } catch (err) {
//       console.error(err);
//       alert("Delete failed.");
//     }
//   };

//   const deleteAll = async () => {
//     if (!window.confirm("Delete ALL records?")) return;

//     try {
//       await API.delete("/feedback-requests");
//       fetchRequests();
//     } catch (err) {
//       console.error(err);
//       alert("Delete failed.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-10 text-center text-lg">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-8">

//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">
//           Feedback Request Tracker
//         </h1>

//         <button
//           onClick={deleteAll}
//           className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
//         >
//           Delete All
//         </button>
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">

//   <table className="w-full border-collapse">

//     <thead className="bg-gray-100">

//       <tr>

//         <th className="border p-3">Request ID</th>

//         <th className="border p-3">Email</th>

//         <th className="border p-3">Status</th>

//         <th className="border p-3">Opened</th>

//         <th className="border p-3">Submitted</th>

//         <th className="border p-3">Open Count</th>

//         <th className="border p-3">Sent</th>

//         <th className="border p-3">Action</th>

//       </tr>

//     </thead>

//     <tbody>

//       {requests.length === 0 ? (

//         <tr>

//           <td
//             colSpan={8}
//             className="text-center p-10"
//           >
//             No Feedback Requests Found
//           </td>

//         </tr>

//       ) : (

//         requests.map((item) => (

//           <tr key={item._id}>

//             <td className="border p-3 text-xs">
//               {item.requestId}
//             </td>

//             <td className="border p-3">
//               {item.email}
//             </td>

//             <td className="border p-3">

//               <span
//                 className={`px-2 py-1 rounded text-white text-sm ${
//                   item.status === "Submitted"
//                     ? "bg-green-600"
//                     : item.status === "Opened"
//                     ? "bg-blue-600"
//                     : "bg-orange-500"
//                 }`}
//               >
//                 {item.status}
//               </span>

//             </td>

//             <td className="border p-3 text-center">

//               {item.opened ? "✅" : "❌"}

//             </td>

//             <td className="border p-3 text-center">

//               {item.submitted ? "✅" : "❌"}

//             </td>

//             <td className="border p-3 text-center">

//               {item.openCount}

//             </td>

//             <td className="border p-3">

//               {new Date(item.sentAt).toLocaleString()}

//             </td>

//             <td className="border p-3 text-center">

             

// <div className="flex flex-col gap-2">

// <button
//     disabled={item.submitted}
//     onClick={async () => {

//         try {

//             await API.put(
//                 `/feedback-request/submit/${item.requestId}`
//             );

//             fetchRequests();

//         } catch (err) {

//             console.error(err);

//         }

//     }}
//     className={`px-3 py-1 rounded text-white ${
//         item.submitted
//             ? "bg-gray-400 cursor-not-allowed"
//             : "bg-green-600 hover:bg-green-700"
//     }`}
// >
//     {item.submitted ? "Submitted ✓" : "Mark Submitted"}
// </button>

// {item.feedbackId && (
//     <button
//         onClick={() => {
//             window.location.href =
//                 `/feedback-responses/${item.feedbackId}`;
//         }}
//         className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
//     >
//         View Feedback
//     </button>
// )}

// <button
//     onClick={() => deleteOne(item._id)}
//     className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
// >
//     Delete
// </button>

// </div>



//             </td>

//           </tr>

//         ))

//       )}

//     </tbody>

//   </table>

// </div>
// </div>
//   );
// }

















import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  RefreshCw,
  Trash2,
  Eye,
  CheckCircle2,
  Clock3,
  Mail,
  
  ExternalLink,
  Filter,
  Inbox,
} from "lucide-react";

import API from "../services/api";

type Request = {
  _id: string;
  requestId: string;
  feedbackId?: string;

  email: string;
  subject: string;
  message: string;

  status: "Pending" | "Opened" | "Submitted";

  opened: boolean;
  submitted: boolean;

  openCount: number;

  openedAt: string | null;
  submittedAt: string | null;
  sentAt: string;
};

export default function FeedbackRequestTracker() {

  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "All" | "Pending" | "Opened" | "Submitted"
  >("All");

  const fetchRequests = async (
    showLoader = true
  ) => {

    try {

      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const res = await API.get(
        "/feedback-requests"
      );

      setRequests(res.data);

    } catch (err) {

      console.error(err);

      alert(
        "Unable to load feedback requests."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }

  };

  useEffect(() => {

    fetchRequests();

  }, []);

  const deleteOne = async (
    id: string
  ) => {

    if (
      !window.confirm(
        "Delete this feedback request?"
      )
    )
      return;

    try {

      await API.delete(
        `/feedback-requests/${id}`
      );

      fetchRequests(false);

    } catch (err) {

      console.error(err);

      alert(
        "Unable to delete request."
      );

    }

  };

  const deleteAll = async () => {

    if (
      !window.confirm(
        "Delete ALL feedback requests?"
      )
    )
      return;

    try {

      await API.delete(
        "/feedback-requests"
      );

      fetchRequests(false);

    } catch (err) {

      console.error(err);

      alert(
        "Unable to delete records."
      );

    }

  };

  const filteredRequests = useMemo(() => {

    return requests.filter((item) => {

      const matchesSearch =
        item.email
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        item.requestId
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        item.subject
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All"
          ? true
          : item.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );

    });

  }, [
    requests,
    search,
    statusFilter,
  ]);

  const stats = useMemo(() => {

    return {

      total: requests.length,

      pending: requests.filter(
        (x) => x.status === "Pending"
      ).length,

      opened: requests.filter(
        (x) => x.status === "Opened"
      ).length,

      submitted: requests.filter(
        (x) => x.status === "Submitted"
      ).length,

    };

  }, [requests]);

  if (loading) {

    return (

      <div className="max-w-7xl mx-auto p-8">

        <div className="animate-pulse space-y-6">

          <div className="h-10 w-80 rounded bg-gray-200" />

          <div className="grid grid-cols-4 gap-5">

            {[1,2,3,4].map((i)=>(
              <div
                key={i}
                className="h-32 rounded-2xl bg-gray-200"
              />
            ))}

          </div>

          <div className="h-[500px] rounded-2xl bg-gray-200" />

        </div>

      </div>

    );

  }

  return (

    <div className="max-w-[1900px] mx-auto px-3 py-0">

      {/* ====================================================== */}
      {/* PAGE HEADER */}
      {/* ====================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-5 mb-8">

        <div>

          <h1 className="text-4xl font-middle text-[#163A2A]">

            Feedback Request Tracker

          </h1>

          <p className="text-gray-500 mt-2">

            Monitor every feedback request,
            email activity and submission
            status in one place.

          </p>

        </div>

        <div className="flex gap-3">

          <button
            onClick={() => fetchRequests(false)}
            className="flex items-center gap-2 rounded-xl border border-[#D9E8DF] bg-white px-5 py-3 font-medium hover:bg-gray-50"
          >
            <RefreshCw
              size={18}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            onClick={deleteAll}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
          >
            <Trash2 size={18} />

            Delete All
          </button>

        </div>

      </div>

      {/* ====================================================== */}
      {/* DASHBOARD CARDS */}
      {/* ====================================================== */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">

        <StatCard
          title="Total Requests"
          value={stats.total}
          color="emerald"
          icon={<Inbox size={22} />}
        />

        <StatCard
          title="Pending"
          value={stats.pending}
          color="orange"
          icon={<Clock3 size={22} />}
        />

        <StatCard
          title="Opened"
          value={stats.opened}
          color="blue"
          icon={<Eye size={22} />}
        />

        <StatCard
          title="Submitted"
          value={stats.submitted}
          color="green"
          icon={<CheckCircle2 size={22} />}
        />

      </div>

      {/* Part 2 continues from here */}
            {/* ====================================================== */}
      {/* FILTER TOOLBAR */}
      {/* ====================================================== */}

      <div className="bg-white rounded-2xl border border-[#DCE8E1] shadow-sm p-5 mb-6">

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

          {/* Search */}

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by email, subject or request ID..."
              className="
              w-full
              pl-12
              pr-4
              py-3
              rounded-xl
              border
              border-[#D8E6DF]
              outline-none
              focus:ring-2
              focus:ring-[#2A6049]
              focus:border-[#2A6049]
              "
            />

          </div>

          {/* Status Filter */}

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 text-[#2A6049] font-semibold">

              <Filter size={18} />

              Status

            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as any
                )
              }
              className="
              px-4
              py-3
              rounded-xl
              border
              border-[#D8E6DF]
              outline-none
              focus:ring-2
              focus:ring-[#2A6049]
              "
            >

              <option value="All">
                All Requests
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Opened">
                Opened
              </option>

              <option value="Submitted">
                Submitted
              </option>

            </select>

          </div>

        </div>

      </div>

      {/* ====================================================== */}
      {/* TABLE */}
      {/* ====================================================== */}

      <div className="
      bg-white
      rounded-2xl
      border
      border-[#DCE8E1]
      shadow-sm
      overflow-hidden
      ">

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead
              className="
              sticky
              top-0
              bg-[#F5F8F6]
              z-20
              "
            >

              <tr className="text-left">

                

                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500">

                  Client

                </th>

                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 text-center">
                Status
                </th>

                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 text-center">

                  Opened

                </th>

                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 text-center">

                  Submitted

                </th>

                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 text-center">

                  Opens

                </th>

                <th className="px-9 py-4 text-xs uppercase tracking-wider text-gray-500">

                  Sent

                </th>

                <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 text-center">

                  Actions

                </th>

              </tr>

            </thead>

            <tbody>

              {filteredRequests.length === 0 ? (

                <tr>

                  <td
                    colSpan={8}
                    className="
                    py-24
                    text-center
                    "
                  >

                    <Inbox
                      size={60}
                      className="
                      mx-auto
                      text-gray-300
                      mb-4
                      "
                    />

                    <h3 className="text-xl font-semibold text-gray-600">

                      No Feedback Requests Found

                    </h3>

                    <p className="text-gray-400 mt-2">

                      Try changing your search or filter.

                    </p>

                  </td>

                </tr>

              ) : (

                filteredRequests.map((item) => (

                  <tr
                    key={item._id}
                    className="
                    border-t
                    border-[#EDF2EF]
                    hover:bg-[#FAFCFB]
                    transition
                    "
                  >

                    

                    <td className="px-6 py-5">

                      <div className="font-medium text-[#183A2C]">

                        {item.email}

                      </div>

                      <div className="text-sm text-gray-400 mt-1">

                        <Mail
                          size={13}
                          className="inline mr-1"
                        />

                        Email Recipient

                      </div>

                    </td>

                    <td className="px-6 py-5 text-center">

  {item.status === "Submitted" && (
    <div
      className="
      inline-flex
      items-center
      justify-center
      w-10
      h-10
      rounded-full
      bg-green-100
      text-green-700
      "
    >
      <CheckCircle2 size={20} />
    </div>
  )}

  {item.status === "Opened" && (
    <div
      className="
      inline-flex
      items-center
      justify-center
      w-10
      h-10
      rounded-full
      bg-blue-100
      text-blue-700
      "
    >
      <Eye size={20} />
    </div>
  )}

  {item.status === "Pending" && (
    <div
      className="
      inline-flex
      items-center
      justify-center
      w-10
      h-10
      rounded-full
      bg-orange-100
      text-orange-700
      "
    >
      <Clock3 size={20} />
    </div>
  )}

</td>
                   <td className="px-6 py-5 text-center">

                      {item.opened ? (

                        <div
                          className="
                          inline-flex
                          items-center
                          justify-center
                          w-9
                          h-9
                          rounded-full
                          bg-blue-100
                          text-blue-700
                          "
                        >
                          <Eye size={18} />
                        </div>

                      ) : (

                        <div
                          className="
                          inline-flex
                          items-center
                          justify-center
                          w-9
                          h-9
                          rounded-full
                          bg-gray-100
                          text-gray-400
                          "
                        >
                          —
                        </div>

                      )}

                    </td>

                    <td className="px-6 py-5 text-center">

                      {item.submitted ? (

<div
  className="
  inline-flex
  items-center
  gap-2
  px-4
  py-2
  rounded-full
  bg-green-100
  text-green-700
  font-semibold
  "
>
  <CheckCircle2 size={18}/>
  Submitted
</div>

) : (

<div
  className="
  inline-flex
  items-center
  gap-2
  px-4
  py-2
  rounded-full
  bg-red-100
  text-red-700
  font-semibold
  "
>
  <Clock3 size={18}/>
  Pending
</div>

)}

                    </td>

                    <td className="px-6 py-5 text-center">

                      <span
                        className="
                        inline-flex
                        items-center
                        justify-center
                        min-w-[42px]
                        h-9
                        px-3
                        rounded-full
                        bg-[#EEF5F1]
                        text-[#2A6049]
                        font-bold
                        "
                      >
                        {item.openCount}
                      </span>

                    </td>

                    <td className="px-6 py-5">

                      <div className="font-medium text-[#183A2C]">

                        {new Date(
                          item.sentAt
                        ).toLocaleDateString()}

                      </div>

                     

                    </td>

                    <td className="px-6 py-5">

                      <div className="flex flex-col gap-2">

                        <button
                          disabled={item.submitted}
                          onClick={async () => {

                            try {

                              await API.put(
                                `/feedback-request/submit/${item.requestId}`
                              );

                              fetchRequests(false);

                            } catch (err) {

                              console.error(err);

                              alert(
                                "Unable to update request."
                              );

                            }

                          }}
                          className={`
                          flex
                          items-center
                          justify-center
                          gap-2
                          px-4
                          py-2.5
                          rounded-xl
                          text-sm
                          font-semibold
                          transition
                          ${
                            item.submitted
                              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }
                          `}
                        >

                          <CheckCircle2 size={16} />

                          {item.submitted
                            ? "Submitted"
                            : "Mark Submit"}

                        </button>

                        {item.feedbackId && (

                          <button
                            onClick={() => {

                              window.location.href =
                                `/feedback-responses/${item.feedbackId}`;

                            }}
                            className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            px-4
                            py-2.5
                            rounded-xl
                            bg-[#2A6049]
                            hover:bg-[#214B39]
                            text-white
                            text-sm
                            font-semibold
                            transition
                            "
                          >

                            <ExternalLink
                              size={16}
                            />

                            View

                          </button>

                        )}

                        <button
                          onClick={() =>
                            deleteOne(item._id)
                          }
                          className="
                          flex
                          items-center
                          justify-center
                          gap-2
                          px-4
                          py-2.5
                          rounded-xl
                          bg-red-600
                          hover:bg-red-700
                          text-white
                          text-sm
                          font-semibold
                          transition
                          "
                        >

                          <Trash2 size={16} />

                          Delete

                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>
    </div>

  );
}

/* ===========================================================
   DASHBOARD STAT CARD
=========================================================== */

type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "emerald" | "orange" | "blue" | "green";
};

function StatCard({
  title,
  value,
  icon,
  color,
}: StatCardProps) {

  const styles = {

    emerald: {
      bg: "from-[#2A6049] to-[#1E4B39]",
      icon: "bg-white/15 text-white",
      text: "text-white",
      sub: "text-emerald-100",
    },

    orange: {
      bg: "from-[#E64013] to-[#C9350B]",
      icon: "bg-white/15 text-white",
      text: "text-white",
      sub: "text-orange-100",
    },

    blue: {
      bg: "from-[#2563EB] to-[#1D4ED8]",
      icon: "bg-white/15 text-white",
      text: "text-white",
      sub: "text-blue-100",
    },

    green: {
      bg: "from-[#16A34A] to-[#15803D]",
      icon: "bg-white/15 text-white",
      text: "text-white",
      sub: "text-green-100",
    },

  }[color];

  return (

    <div
      className={`
      relative
      overflow-hidden
      rounded-2xl
      bg-gradient-to-br
      ${styles.bg}
      p-6
      shadow-lg
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-2xl
      `}
    >

      {/* Decorative Circle */}

      <div
        className="
        absolute
        -right-10
        -top-10
        w-40
        h-40
        rounded-full
        bg-white/5
        "
      />

      <div
        className="
        absolute
        -right-4
        -bottom-8
        w-24
        h-24
        rounded-full
        bg-white/5
        "
      />

      <div className="relative flex justify-between items-start">

        <div>

          <p
            className={`
            text-sm
            font-medium
            ${styles.sub}
            `}
          >
            {title}
          </p>

          <h2
            className={`
            mt-3
            text-4xl
            font-bold
            ${styles.text}
            `}
          >
            {value}
          </h2>

        </div>

        <div
          className={`
          w-14
          h-14
          rounded-2xl
          flex
          items-center
          justify-center
          ${styles.icon}
          backdrop-blur-sm
          `}
        >
          {icon}
        </div>

      </div>

    </div>

  );

}
