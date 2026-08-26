'use client';

import { useRouter } from "next/navigation";
import React from "react";
import { FaPencilAlt } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const ExperimentCard = ({
  title,
  subject,
  experimentNumber,
  _id,
  active = false,
}) => {
  const router = useRouter();

  const handleDelete = async (e) => {
    e.stopPropagation();
    const confirmed = window.confirm("Delete this experiment?");
    if (!confirmed) return;

    const res = await fetch(`/api/experiment/${_id}`, { method: "DELETE" });
    if (res.ok) {
      window.location.reload();
    }
  };

  return (
    <li>
      <div
        onClick={() => router.push(`/view/${_id}`)}
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left transition-all duration-200 ${
          active
            ? "border-blue-200 bg-blue-50 shadow-sm"
            : "border-transparent bg-white shadow-sm hover:border-slate-200 hover:bg-slate-50"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`h-9 w-1.5 rounded-full ${active ? "bg-blue-500" : "bg-slate-200"}`}
          />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-slate-800">
              {subject} • Exp {experimentNumber}
            </h3>
            <p className="truncate text-xs text-slate-500">{title}</p>
          </div>
        </div>

        <div className="ml-2 flex items-center gap-1.5">
          <button
            aria-label="Edit"
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/edit/${_id}`);
            }}
          >
            <FaPencilAlt className="text-sm" />
          </button>
          <button
            aria-label="Delete"
            className="rounded-lg p-2 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
            onClick={handleDelete}
          >
            <RiDeleteBin6Line className="text-sm" />
          </button>
        </div>
      </div>
    </li>
  );
};

export default ExperimentCard;
