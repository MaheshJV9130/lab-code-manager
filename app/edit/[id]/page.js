'use client';

import { Editor } from "@monaco-editor/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";

const LANG_OPTIONS = [
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
];

const Input = ({ label, id, children, error }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {children}
    {error && <p className="text-xs text-red-600 mt-1">{error.message || "This field is required."}</p>}
  </div>
);

const EditExperimentPage = () => {
  const params = useParams();
  const router = useRouter();

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

  useEffect(() => {
    const fetchExperiment = async () => {
      const req = await fetch(`/api/experiment/${params.id}`);
      const res = await req.json();

      if (res.experiment) {
        reset({
          subject: res.experiment.subject,
          experimentNumber: res.experiment.experimentNumber,
          title: res.experiment.title,
          language: res.experiment.language || "javascript",
          code: res.experiment.code,
          output: res.experiment.output || "",
        });
      }
    };

    if (params?.id) {
      fetchExperiment();
    }
  }, [params?.id, reset]);

  const onSubmit = async (data) => {
    const request = fetch(`/api/experiment/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    toast.promise(request, {
      pending: "Updating experiment...",
      success: "Experiment updated successfully!",
      error: "Failed to update experiment",
    });

    const response = await request;

    if (response.ok) {
      router.push(`/view/${params.id}`);
    }
  };

  return (
    <main className="min-h-screen overflow-auto p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            Edit record
          </p>
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Edit Experiment</h1>
          <p className="mt-2 text-sm text-slate-600">
            Update the experiment details, source code, and captured output.
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
              placeholder="Enter title"
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
                  <select {...field} className="form-select sm:w-auto">
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

          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push(`/view/${params.id}`)}
              className="secondary-btn w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-btn w-full disabled:cursor-not-allowed disabled:bg-blue-300 sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Experiment"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditExperimentPage;
