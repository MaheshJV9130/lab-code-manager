import Experiment from "@/models/experiment";
import connectDatabase from "@/utils/database";
import { NextResponse } from "next/server";

const normalizeText = (value) => String(value ?? "").trim();

export async function GET() {
  await connectDatabase();
  const experiments = await Experiment.find({});
  return NextResponse.json(experiments, { status: 200 });
}

export async function POST(request) {
  try {
    await connectDatabase();
    const body = await request.json();

    const subject = normalizeText(body.subject);
    const experimentNumber = Number(body.experimentNumber);
    const title = normalizeText(body.title);
    const code = String(body.code ?? "").trim();
    const output = String(body.output ?? "").trim();

    if (!subject || !Number.isFinite(experimentNumber)) {
      return NextResponse.json(
        {
          data: {
            ok: false,
            message: "Subject and experiment number are required.",
            reason: "missing_subject_or_experiment_number",
          },
        },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        {
          data: {
            ok: false,
            message: "Title is required.",
            reason: "missing_title",
          },
        },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        {
          data: {
            ok: false,
            message: "Code is required.",
            reason: "missing_code",
          },
        },
        { status: 400 }
      );
    }

    if (!output) {
      return NextResponse.json(
        {
          data: {
            ok: false,
            message: "Output is required.",
            reason: "missing_output",
          },
        },
        { status: 400 }
      );
    }

    const existingExperiment = await Experiment.findOne({
      subject: { $regex: new RegExp(`^${subject.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
      experimentNumber,
    });

    if (existingExperiment) {
      return NextResponse.json(
        {
          data: {
            ok: false,
            message: `An experiment for ${subject} and Experiment ${experimentNumber} already exists.`,
            reason: "duplicate_experiment",
          },
        },
        { status: 409 }
      );
    }

    const entry = await Experiment.create({
      ...body,
      subject,
      experimentNumber,
      title,
      code,
      output,
    });

    return NextResponse.json(
      {
        data: {
          _id: entry._id,
          ok: true,
          message: "Code successfully uploaded...",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          data: {
            ok: false,
            message: "Invalid request payload.",
            reason: "invalid_json",
          },
        },
        { status: 400 }
      );
    }

    if (error?.code === 11000) {
      return NextResponse.json(
        {
          data: {
            ok: false,
            message: "This experiment already exists.",
            reason: "duplicate_experiment",
          },
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        data: {
          ok: false,
          message: error?.message || "Failed to upload experiment.",
          reason: error?.message ? "upload_error" : "unknown_error",
        },
      },
      { status: 500 }
    );
  }
}
