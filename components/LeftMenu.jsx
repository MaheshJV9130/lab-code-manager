"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ExperimentCard from "./ExperimentCard";

const LeftMenu = () => {
  const router = useRouter();
  const [experiments, setExperiments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="w-72 md:w-80 lg:w-96 shrink-0 border-r border-black/25 min-h-screen bg-gray-50 flex flex-col">
      <header className="p-4 sticky top-0 bg-gray-50 z-10 border-b border-black/25">
        <div className="flex items-center justify-between">
          <h1 className="text-blue-800 font-bold text-xl">&lt;Code Manager/&gt;</h1>
          <button
            onClick={() => router.push("/")}
            className="text-sm px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            New
          </button>
        </div>
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search experiments"
              className="input-box w-full"
              aria-label="Search experiments"
            />
          </div>
          <h2 className="text-sm font-medium mt-3 text-gray-700">
            Saved Codes ({filteredExperiments.length})
          </h2>
        </div>
      </header>

      <ul className="p-2 space-y-3 overflow-y-auto" style={{ maxHeight: "calc(100vh - 6.5rem)" }}>
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
  );
};

export default LeftMenu;
