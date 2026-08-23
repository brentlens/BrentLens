// app/incidents/page.tsx
"use client";

import IncidentPreviewDrawer from "@/components/admin/review/IncidentPreviewDrawer";
import LoaderOverlay from "@/components/Loader";
import { IAuditLogsModel, IIncidentList } from "@/lib/types/CustomTypes";

import {
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const actionColors: Record<string, string> = {
  Edited: "text-purple-500",
  Approved: "text-green-500",
  Rejected: "text-red-500",
};

export default function AuditPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [incidents, setIncidents] = useState<IAuditLogsModel[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedIncident, setSelectedIncident] = useState<IAuditLogsModel | null>(
    null
  );
  const [showPreview, setShowPreview] = useState(false);

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;


  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };



  useEffect(() => {
    handleSearch()
  }, [search])

  const handleSearch = () => {

    if (search == '' || search == null || search == undefined) {
      fetchAllPublishedNews()
      return
    }

    let x = incidents.filter((item) => {
      return item.newsTitle.toLowerCase().includes(search.toLowerCase()) ||
        item.actionName.toLowerCase().includes(search.toLowerCase()) ||
        item.id == +search
    })
    setIncidents(x)
  }

  useEffect(() => {
    fetchAllPublishedNews()
  }, [currentPage,itemsPerPage])

  const fetchAllPublishedNews = async () => {
    setLoading(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/audit?page=${currentPage}&size=${itemsPerPage}`, {
      cache: "no-store",
    });

    const json = await res.json();

    setIncidents(json.data)
    setTotalPages(json.totalPages)
    setTotalCount(json.totalCount)
    setLoading(false)
  }

  function formatLocalDateTimeString(dateString: string) {
    const date = new Date(dateString);

    return `${date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })} at ${date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  }


  if (loading) {
    return <LoaderOverlay />
  }


  return (
    <div className=" bg-[#f5f5f5] p-6">

      <IncidentPreviewDrawer
        incident={selectedIncident}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onApprove={() => { }}
        isView={true}
      />

      <div className="mx-0 w-full">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight text-zinc-800 font-playfair ">
          Audit Log
        </h1>

        <div className="rounded-3xl bg-white w-full p-6 shadow-sm">
          {/* Top Controls */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Left */}
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span>Show</span>

              <select value={itemsPerPage} onChange={(e) => setItemsPerPage(+e.target.value)} className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-600 outline-none">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>

              <span>entries</span>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-[290px] items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4">
                <Search className="h-5 w-5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search table field"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-transparent text-zinc-600 text-sm outline-none placeholder:text-zinc-400"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-sm text-zinc-500">
                  <th className="px-4 py-2 font-medium">Incident ID</th>
                  <th className="px-4 py-2 font-medium">Action</th>
                  <th className="px-4 py-2 font-medium">Title</th>
                  <th className="px-4 py-2 font-medium">Update Time</th>
                </tr>
              </thead>

              <tbody>
                {incidents.map((incident) => (
                  <tr
                    key={incident.id}
                    className="rounded-2xl bg-[#f8f8f8] text-zinc-600"
                  >
                    <td className="rounded-l-2xl px-4 py-3 text-sm">
                      {incident.id}
                    </td>

                    <td className={`px-4 py-3 text-sm font-medium ${actionColors[incident.actionName]
                        }`}>
                      {incident.actionName}
                    </td>

                    <td className="px-4 py-3 text-sm">{incident.newsTitle}</td>

                    <td
                      className={`px-4 py-3 text-sm font-medium `}
                    >
                      {formatLocalDateTimeString(incident.created_at)}

                      {/* {incident.created_at.split('T')[0] + " " + incident.created_at.split('T')[1].split('.')[0]} */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer _pagination */}
          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-base text-zinc-500">
              Showing page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-3">
              {/* Prev */}
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Pages */}
              <div className="flex items-center gap-3 rounded-full bg-[#f4f4f4] px-4 py-2">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex h-10 w-10 items-center justify-center rounded-full transition ${currentPage === page
                        ? "bg-violet-600 text-white"
                        : "text-zinc-500 hover:bg-white"
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* Next */}
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}