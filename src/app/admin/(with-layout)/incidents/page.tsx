// app/incidents/page.tsx
"use client";

import IncidentPreviewDrawer from "@/components/admin/review/IncidentPreviewDrawer";
import LoaderOverlay from "@/components/Loader";
import { IIncidentList } from "@/lib/types/CustomTypes";

import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Pencil,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const communityColors: Record<string, string> = {
  Muslim: "text-orange-500",
  Dalit: "text-amber-500",
  Sikh: "text-green-500",
  Adivasi: "text-violet-500",
  Christian: "text-red-500",
};

const statusColors: Record<string, string> = {
  Verified: "text-green-500",
  Corroborated: "text-yellow-500",
};

export default function IncidentsPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [incidents, setIncidents] = useState<IIncidentList[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedIncident, setSelectedIncident] = useState<IIncidentList | null>(
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


  const onEditClick = (id: any) => {
    router.push(`/admin/review/edit/${id}`);
  }

  useEffect(() => {
    handleSearch()
  }, [search])

  const handleSearch = () => {

    if (search == '' || search == null || search == undefined) {
      fetchAllPublishedNews()
      return
    }

    let x = incidents.filter((item) => {
      return item.cleanTitle.toLowerCase().includes(search.toLowerCase()) ||
        item.matchedKeyword.toLowerCase().includes(search.toLowerCase()) ||
        item.verificationStatus.toLowerCase().includes(search.toLowerCase()) ||
        item.id == +search
    })
    setIncidents(x)
  }

  useEffect(() => {
    fetchAllPublishedNews()
  }, [currentPage,itemsPerPage])

  const fetchAllPublishedNews = async () => {
    setLoading(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/published?page=${currentPage}&size=${itemsPerPage}`, {
      cache: "no-store",
    });

    const json = await res.json();
    // setItemsPerPage(ite)
    setIncidents(json.data.dataList)
    setTotalPages(json.data.totalPages)
    setTotalCount(json.data.totalCount)
    setLoading(false)
  }

    const handlePreview = (id:number) => {
      let incident = incidents.find((x) => x.id == id)
      if(incident){
        setSelectedIncident(incident);
        setShowPreview(true);
      }
  };

  if (loading) {
    return <LoaderOverlay />
  }


  return (
    <div className=" bg-[#f5f5f5] p-6">

<IncidentPreviewDrawer
        incident={selectedIncident}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onApprove={() => {}}
        isView={true}
      />

      <div className="mx-0 w-full">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight text-zinc-800 font-playfair ">
          All incidents
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

              {/* <button className="flex h-12 items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-zinc-600 transition hover:bg-zinc-100">
                <Filter className="h-4 w-4" />
                Filter
              </button> */}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-sm text-zinc-500">
                  <th className="px-4 py-2 font-medium">Incident ID</th>
                  <th className="px-4 py-2 font-medium">Title</th>
                  <th className="px-4 py-2 font-medium">Date</th>
                  <th className="px-4 py-2 font-medium">Community</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium"></th>
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

                    <td className="max-w-[420px] truncate px-4 py-3 text-sm">
                      {incident.cleanTitle}
                    </td>

                    <td className="px-4 py-3 text-sm">{incident.date}</td>

                    <td
                      className={`px-4 py-3 text-sm font-medium ${communityColors[incident.matchedKeyword]
                        }`}
                    >
                      {incident.matchedKeyword}
                    </td>

                    <td
                      className={`px-4 py-3 text-sm font-medium ${statusColors[incident.verificationStatus]
                        }`}
                    >
                      {incident.verificationStatus}
                    </td>

                    <td className="rounded-r-2xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => onEditClick(incident.id)} className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100">
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>

                        <button onClick={() => handlePreview(incident.id)}
                         className="rounded-lg border border-zinc-300 bg-white px-5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100">
                          View
                        </button>
                      </div>
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