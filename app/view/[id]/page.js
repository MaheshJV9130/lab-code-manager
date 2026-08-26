"use client";

import { Editor } from "@monaco-editor/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const ViewExperimentPage = () => {
  const params = useParams();
  const router = useRouter();
  const editorRef = useRef(null);
  const [experiment, setExperiment] = useState({});
  const [copyState, setCopyState] = useState("Copy Code");
  const [loading, setLoading] = useState(true);

  const fetchExperiment = async (id) => {
    try {
      const req = await fetch(`/api/experiment/${id}`);
      const res = await req.json();
      setExperiment(res.experiment || {});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.id) {
      setLoading(true);
      fetchExperiment(params.id);
    }
  }, [params?.id]);

  const handleCopy = async () => {
    if (!experiment?.code) return;

    await navigator.clipboard.writeText(experiment.code);
    setCopyState("Copied!");
    setTimeout(() => setCopyState("Copy Code"), 1200);
  };

  const handleSelectAll = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.selectAll")?.run();
    }
  };

  const handleDownload = () => {
    if (!experiment?.code) return;

    const blob = new Blob([experiment.code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(experiment.title || "experiment").replace(/\s+/g, "-").toLowerCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this experiment?");
    if (!confirmed) return;

    const req = await fetch(`/api/experiment/${params.id}`, {
      method: "DELETE",
    });

    if (req.ok) {
      router.push("/");
    }
  };

  const handleEdit = () => {
    router.push(`/edit/${params.id}`);
  };

  if (loading) {
    return (
      <main className="flex-1 min-h-screen bg-gray-100 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="mb-7 space-y-3">
            <div className="h-8 w-2/3 rounded bg-gray-200" />
            <div className="h-4 w-1/2 rounded bg-gray-200" />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
              <div className="space-y-2">
                <div className="h-3 w-20 rounded bg-gray-200" />
                <div className="h-4 w-2/3 rounded bg-gray-200" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-28 rounded bg-gray-200" />
                <div className="h-4 w-1/2 rounded bg-gray-200" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-24 rounded bg-gray-200" />
                <div className="h-4 w-3/4 rounded bg-gray-200" />
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <div className="h-10 w-24 rounded bg-gray-200" />
              <div className="h-10 w-24 rounded bg-gray-200" />
              <div className="h-10 w-24 rounded bg-gray-200" />
              <div className="h-10 w-24 rounded bg-gray-200" />
            </div>

            <div className="h-[420px] w-full rounded-lg bg-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 min-h-screen bg-gray-100 p-4 sm:p-6 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-7">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
            Preview — {experiment.subject || ""} Exp {experiment.experimentNumber || ""} — {experiment.title || "Untitled"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">View-only access mode for registered laboratory experiments.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 gap-4 px-4 py-3 bg-gray-100 border-b border-gray-200 text-sm text-gray-600 md:grid-cols-3">
            <div>
              <div className="uppercase tracking-wide text-[10px] font-semibold text-gray-500">Subject</div>
              <div className="mt-1 font-semibold text-gray-800">{experiment.subject || "—"}</div>
            </div>
            <div>
              <div className="uppercase tracking-wide text-[10px] font-semibold text-gray-500">Experiment Number</div>
              <div className="mt-1 font-semibold text-gray-800">{experiment.experimentNumber || "—"}</div>
            </div>
            <div>
              <div className="uppercase tracking-wide text-[10px] font-semibold text-gray-500">Experiment Title</div>
              <div className="mt-1 font-semibold text-gray-800">{experiment.title || "—"}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-200 bg-white">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              {copyState}
            </button>
            
            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-2 border border-gray-300 bg-white text-gray-700 text-sm rounded-md hover:bg-gray-50"
            >
              Download
            </button>
            <button
              type="button"
              onClick={handleEdit}
              className="px-3 py-2 border border-gray-300 bg-white text-gray-700 text-sm rounded-md hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-3 py-2 border border-red-300 bg-red-50 text-red-600 text-sm rounded-md hover:bg-red-100"
            >
              Delete
            </button>
          </div>

          <div className="rounded-b-xl overflow-hidden border-t border-gray-200">
            <Editor
              height="420px"
              theme="vs-dark"
              language={experiment.language || "javascript"}
              value={experiment.code || ""}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                wordWrap: "on",
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ViewExperimentPage;
