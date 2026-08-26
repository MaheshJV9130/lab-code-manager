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
        className={`w-full flex items-center justify-between p-3 space-x-3 rounded-lg transition-colors border ${
          active ? "bg-blue-50 border-blue-200" : "bg-white hover:bg-gray-50 border-transparent"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`w-1.5 h-8 rounded ${active ? "bg-blue-500" : "bg-transparent"}`} />
          <div className="flex-1 min-w-0 text-left">
            <h3 className="text-sm font-semibold text-gray-800 truncate">{subject} | Exp : {experimentNumber}</h3>
            <p className="text-xs text-gray-500 truncate">{title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <button
            aria-label="Edit"
            className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/edit/${_id}`);
            }}
          >
            <FaPencilAlt />
          </button>
          <button aria-label="Delete" className="p-2 rounded-md hover:bg-gray-100 text-red-600" onClick={handleDelete}>
            <RiDeleteBin6Line />
          </button>
        </div>
      </div>
    </li>
  );
};

export default ExperimentCard;
