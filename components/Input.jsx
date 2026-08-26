import React from "react";

const Input = ({ label, id, children, error }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-600">{error.message || "This field is required."}</p>
      )}
    </div>
  );
};

export default Input;