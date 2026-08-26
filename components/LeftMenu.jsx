"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ExperimentCard from "./ExperimentCard";

const LeftMenu = () => {
  const router = useRouter();
  const [experiments, setExperiments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const fetchExperiments = async () => {
    try {
      const req = await fetch("/api/experiment");
      const res = await req.json();
      setExperiments(Array.isArray(res) ? res : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiments();
  }, []);

  const filteredExperiments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return experiments;

    return experiments.filter((exp) => {
      const subject = String(exp.subject || "").toLowerCase();
      const title = String(exp.title || "").toLowerCase();
      const experimentNumber = String(exp.experimentNumber || "");

      return (
        subject.includes(query) ||
        title.includes(query) ||
        experimentNumber.includes(query)
      );
    });
  }, [experiments, searchQuery]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative w-full md:w-72 md:shrink-0 lg:w-80 xl:w-96">
      <div className="flex items-center justify-between border-b border-black/25 bg-gray-50 p-4 md:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-xl text-gray-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? "✕" : "☰"}
          </button>
          <h1 className="text-blue-800 font-bold text-lg">&lt;Code Manager/&gt;</h1>
        </div>
        <button
          onClick={() => router.push("/")}
          className="text-sm px-2.5 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm"
        >
          New
        </button>
      </div>

      <div
        className={`
          absolute left-0 right-0 top-full z-20 border-b border-black/25 bg-gray-50 shadow-lg transition-all duration-200 md:static md:block md:shadow-none md:border-b-0 md:border-r
          ${isOpen ? "block" : "hidden"}
        `}
      >
        <div className="flex min-h-[calc(100vh-3.5rem)] flex-col bg-gray-50 md:min-h-screen md:max-h-screen">
          <header className="p-4 border-b border-black/25">
            <div className="hidden items-center justify-between gap-3 md:flex">
              <h1 className="text-blue-800 font-bold text-xl">&lt;Code Manager/&gt;</h1>
              <button
                onClick={() => router.push("/")}
                className="text-sm px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                New
              </button>
            </div>

            <div className="mt-3 md:mt-0">
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search experiments"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 pr-10 text-sm text-gray-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-3 focus:ring-blue-100"
                  aria-label="Search experiments"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
              <h2 className="text-sm font-medium mt-3 text-gray-700">
                Saved Codes ({filteredExperiments.length})
              </h2>
            </div>
          </header>

          <ul className="flex-1 space-y-3 overflow-y-auto p-2 md:max-h-[calc(100vh-6.5rem)]">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <li key={index} className="animate-pulse rounded-lg border border-gray-200 bg-white p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 rounded bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-2/3 rounded bg-gray-200" />
                      <div className="h-2.5 w-1/2 rounded bg-gray-200" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 w-8 rounded bg-gray-200" />
                      <div className="h-8 w-8 rounded bg-gray-200" />
                    </div>
                  </div>
                </li>
              ))
            ) : filteredExperiments.length === 0 ? (
              <li className="rounded-lg border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500 text-center">
                No matching experiments found.
              </li>
            ) : (
              filteredExperiments.map((exp) => <ExperimentCard key={exp._id} {...exp} />)
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeftMenu;
