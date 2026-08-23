"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";

const data = [
  { name: "Hindustan Times", time: "5 min ago", score: "+4" },
  { name: "The Hindu", time: "10 min ago", score: "+4" },
  { name: "NDTV", time: "15 min ago", score: "+4" },
  { name: "Times of India", time: "20 min ago", score: "+4" },
  { name: "The Statesman", time: "25 min ago", score: "+4" },
  { name: "Deccan Chronicle", time: "30 min ago", score: "+4" },
  { name: "Indian Express", time: "35 min ago", score: "+4" },
  { name: "The Pioneer", time: "40 min ago", score: "+4" },
  { name: "Daily Excelsior", time: "45 min ago", score: "+4" },
  { name: "The Tribune", time: "50 min ago", score: "+4" },
  { name: "BBC", time: "55 min ago", score: "+4" },
  { name: "CNN", time: "1 hr ago", score: "+4" },
];

export default function SourceHealthPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const [itemsPerPage,setItemsPerPage] = useState(5)

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedData = filteredData.slice(startIndex, endIndex);

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

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <h1 className="mb-6 text-4xl font-bold font-playfair text-zinc-900">
          Source health
        </h1>

        {/* Card */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          {/* Top Controls */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Entries */}
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span>Show</span>

              <select onChange={(e) => setItemsPerPage(+e.target.value)} className="rounded-lg border border-zinc-200 bg-white px-2 py-1 outline-none">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>

              <span>entries</span>
            </div>

            {/* Search + Filter */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2">
                <Search className="h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search table field"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-sm outline-none text-zinc-600 placeholder:text-zinc-400"
                />
              </div>

              {/* <button className="flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-100">
                <SlidersHorizontal className="h-4 w-4" />
                Filter
              </button> */}
            </div>
          </div>

          {/* Table */}
          <div className="space-y-3">
            {paginatedData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl bg-[#f7f7f7] px-4 py-4"
              >
                <p className="text-sm font-medium text-zinc-700">
                  {item.name}
                </p>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-zinc-500">
                    {item.time}
                  </span>

                  <span className="text-sm font-medium text-orange-400">
                    {item.score}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Pagination */}
          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-zinc-500">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredData.length)} out of{" "}
              {filteredData.length} entries
            </p>

            <div className="flex items-center gap-3">
              {/* Prev */}
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-3 rounded-full bg-[#f5f5f5] px-4 py-2">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition ${
                        currentPage === page
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
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
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