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
      setIsOpen(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside className="relative w-full border-b border-slate-200 bg-slate-50/90 backdrop-blur-sm md:w-[300px] md:border-b-0 md:border-r md:shadow-sm lg:w-[330px] xl:w-[360px]">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white/80 p-4 md:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? "✕" : "☰"}
          </button>
          <h1 className="text-lg font-bold text-blue-700">Code Manager</h1>
        </div>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="primary-btn px-3 py-2 text-xs"
        >
          New
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-200 md:block ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-slate-50 md:min-h-screen md:max-h-screen">
          <header className="border-b border-slate-200 bg-white/80 p-4">
            <div className="hidden items-center justify-between gap-3 md:flex">
              <h1 className="text-xl font-bold text-blue-700">Code Manager</h1>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="primary-btn px-3 py-2 text-xs"
              >
                New
              </button>
            </div>

            <div className="mt-4 md:mt-3">
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search experiments"
                  className="form-input pr-10"
                  aria-label="Search experiments"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-700">Saved Codes</h2>
                <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                  {filteredExperiments.length}
                </span>
              </div>
            </div>
          </header>

          <ul className="flex-1 space-y-3 overflow-y-auto p-3 md:max-h-[calc(100vh-8.5rem)]">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <li key={index} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-2/3 rounded bg-slate-200" />
                      <div className="h-2.5 w-1/2 rounded bg-slate-200" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 w-8 rounded-lg bg-slate-200" />
                      <div className="h-8 w-8 rounded-lg bg-slate-200" />
                    </div>
                  </div>
                </li>
              ))
            ) : filteredExperiments.length === 0 ? (
              <li className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center text-sm text-slate-500 shadow-sm">
                No matching experiments found.
              </li>
            ) : (
              filteredExperiments.map((exp) => <ExperimentCard key={exp._id} {...exp} />)
            )}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default LeftMenu;
