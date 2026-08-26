import Experiment from "@/models/experiment";
import connectDatabase from "@/utils/database";
import { NextResponse } from "next/server";

const normalizeText = (value) => String(value ?? "").trim();

export async function GET(_request, { params }) {
  await connectDatabase();
  const { id } = await params;
  const experiment = await Experiment.findById(id);

  if (!experiment) {
    return NextResponse.json({ message: "Experiment not found" }, { status: 404 });
  }

  return NextResponse.json({ experiment }, { status: 200 });
}

export async function PUT(request, { params }) {
  await connectDatabase();
  const { id } = await params;
  const body = await request.json();

  const subject = normalizeText(body.subject);
  const experimentNumber = Number(body.experimentNumber);

  if (!subject || !Number.isFinite(experimentNumber) || !body.code?.trim() || !body.output?.trim()) {
    return NextResponse.json(
      { message: "Subject, experiment number, code, and output are required." },
      { status: 400 }
    );
  }

  const duplicateExperiment = await Experiment.findOne({
    _id: { $ne: id },
    subject: { $regex: new RegExp(`^${subject.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
    experimentNumber,
  });

  if (duplicateExperiment) {
    return NextResponse.json(
      { message: `An experiment for ${subject} and Experiment ${experimentNumber} already exists.` },
      { status: 409 }
    );
  }

  const experiment = await Experiment.findByIdAndUpdate(
    id,
    {
      subject,
      experimentNumber,
      title: normalizeText(body.title),
      code: body.code,
      output: body.output,
      language: body.language || "javascript",
    },
    { new: true }
  );

  if (!experiment) {
    return NextResponse.json({ message: "Experiment not found" }, { status: 404 });
  }

  return NextResponse.json({ experiment }, { status: 200 });
}

export async function DELETE(_request, { params }) {
  await connectDatabase();
  const { id } = await params;
  const experiment = await Experiment.findByIdAndDelete(id);

  if (!experiment) {
    return NextResponse.json({ message: "Experiment not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Experiment deleted successfully" }, { status: 200 });
}

