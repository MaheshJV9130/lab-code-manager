"use client";

import Input from "@/components/Input";
import { Editor } from "@monaco-editor/react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const LANG_OPTIONS = [
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
];

const HomePageClient = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      subject: "",
      experimentNumber: 1,
      title: "",
      language: "javascript",
      code: "",
      output: "",
    },
  });

  const language = watch("language", "javascript");

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/experiment/", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!response.ok) {
        const message = result?.data?.message || result?.message || "Failed to upload code";
        toast.error(message);
        return;
      }

      toast.success(result?.data?.message || "Code successfully uploaded!");
      reset();
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (error) {
      toast.error(error?.message || "Failed to upload experiment.");
    }
  };

  return (
    <main className="min-h-screen overflow-auto p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            New experiment
          </p>
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Add New Entry</h1>
          <p className="mt-2 text-sm text-slate-600">
            Create a new experiment record by writing the source code and configuration.
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="panel-surface space-y-6 p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            <Input label="Subject" id="subject" error={errors.subject}>
              <input
                id="subject"
                {...register("subject", {
                  required: { value: true, message: "Subject is required" },
                })}
                placeholder="Enter subject"
                className="form-input"
              />
            </Input>

            <Input label="Experiment No" id="experimentNumber" error={errors.experimentNumber}>
              <input
                id="experimentNumber"
                type="number"
                {...register("experimentNumber", {
                  required: { value: true, message: "Experiment number is required" },
                  min: { value: 1, message: "Must be >= 1" },
                })}
                placeholder="1"
                className="form-input"
              />
            </Input>
          </div>

          <Input label="Title" id="title" error={errors.title}>
            <input
              id="title"
              {...register("title", {
                required: { value: true, message: "Title is required" },
              })}
              placeholder="Enter experiment title"
              className="form-input"
            />
          </Input>

          <div>
            <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <label className="text-sm font-semibold text-slate-700">Code</label>
              <Controller
                name="language"
                control={control}
                render={({ field }) => (
                  <select {...field} className="form-select max-w-full sm:w-auto">
                    {LANG_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-inner sm:rounded-2xl">
              <Controller
                name="code"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Editor
                    height="360px"
                    theme="vs-dark"
                    defaultValue="// Paste your code here"
                    language={language}
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
            </div>
            {errors.code && <p className="mt-2 text-xs text-red-600">{errors.code.message}</p>}
          </div>

          <Input label="Output" id="output" error={errors.output}>
            <textarea
              id="output"
              rows={5}
              {...register("output", {
                required: { value: true, message: "Output is required" },
              })}
              placeholder="Paste your output here..."
              className="form-textarea min-h-[110px] sm:min-h-[140px]"
            />
          </Input>

          <div className="flex justify-end">
            <button
              type="submit"
              className="primary-btn w-full disabled:cursor-not-allowed disabled:bg-blue-300 sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Experiment"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default HomePageClient;
