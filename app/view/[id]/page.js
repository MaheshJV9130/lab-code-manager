"use client";

import Input from "@/components/Input";
import { Editor } from "@monaco-editor/react";
import JSZip from "jszip";
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

  const handleDownload = async () => {
    if (!experiment?.code) return;

    const escapeXml = (value = "") =>
      String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&apos;");

    const zip = new JSZip();
    zip.file(
      "[Content_Types].xml",
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`
    );

    zip.file(
      "_rels/.rels",
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
    );

    zip.file(
      "word/document.xml",
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:t>Experiment No: ${escapeXml(experiment.experimentNumber ?? "")}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Experiment Name: ${escapeXml(experiment.title || "")}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Code:</w:t></w:r></w:p>
    <w:p><w:r><w:t>${escapeXml(experiment.code || "")}</w:t></w:r></w:p>
    <w:p><w:r><w:t>Output:</w:t></w:r></w:p>
    <w:p><w:r><w:t>${escapeXml(experiment.output || "")}</w:t></w:r></w:p>
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`
    );

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(experiment.title || "experiment").replace(/\s+/g, "-").toLowerCase()}.docx`;
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
    <main className="min-h-screen overflow-auto p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            Experiment preview
          </p>
          <h1 className="text-2xl font-bold leading-tight text-slate-800 sm:text-3xl">
            {experiment.subject || ""} • Exp {experiment.experimentNumber || ""} • {experiment.title || "Untitled"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            View-only access mode for registered laboratory experiments.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 gap-4 border-b border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600 md:grid-cols-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Subject</div>
              <div className="mt-1 font-semibold text-slate-800">{experiment.subject || "—"}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Experiment Number</div>
              <div className="mt-1 font-semibold text-slate-800">{experiment.experimentNumber || "—"}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Experiment Title</div>
              <div className="mt-1 font-semibold text-slate-800">{experiment.title || "—"}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white p-4">
            <button type="button" onClick={handleCopy} className="primary-btn">
              {copyState}
            </button>
            <button type="button" onClick={handleDownload} className="secondary-btn">
              Download
            </button>
            <button type="button" onClick={handleEdit} className="secondary-btn">
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
            >
              Delete
            </button>
          </div>

          <div className="overflow-hidden border-b border-slate-200">
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

          <div className="p-4 sm:p-5">
            <Input label="Output" id="output" readOnly>
              <textarea
                id="output"
                value={experiment.output || ""}
                placeholder="Paste your output here..."
                className="form-textarea min-h-[160px]"
                readOnly
              />
            </Input>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ViewExperimentPage;
