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
    formState: { errors },
  } = useForm({
    defaultValues: {
      subject: "",
      experimentNumber: 1,
      title: "",
      language: "javascript",
      code: "",
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
    <main className="flex-1 h-screen overflow-auto p-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Edit Experiment</h1>
          <p className="text-sm text-gray-600 mt-1">Update the experiment details and source code.</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Subject" id="subject" error={errors.subject}>
              <input
                id="subject"
                {...register("subject", {
                  required: { value: true, message: "Subject is required" },
                })}
                placeholder="Enter Subject"
                className="w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-200 p-2"
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
                className="w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-200 p-2"
              />
            </Input>
          </div>

          <Input label="Title" id="title" error={errors.title}>
            <input
              id="title"
              {...register("title", {
                required: { value: true, message: "Title is required" },
              })}
              placeholder="Enter Title"
              className="w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-200 p-2"
            />
          </Input>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Code</label>
              <Controller
                name="language"
                control={control}
                render={({ field }) => (
                  <select {...field} className="text-sm rounded-md border-gray-200 p-1">
                    {LANG_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            <div className="rounded-md overflow-hidden border">
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
            {errors.code && <p className="text-xs text-red-600 mt-2">{errors.code.message}</p>}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push(`/view/${params.id}`)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Update
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditExperimentPage;
