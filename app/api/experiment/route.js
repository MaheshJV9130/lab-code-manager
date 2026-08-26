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
  await connectDatabase();
  const body = await request.json();

  const subject = normalizeText(body.subject);
  const experimentNumber = Number(body.experimentNumber);

  if (!subject || !Number.isFinite(experimentNumber)) {
    return NextResponse.json(
      { data: { ok: false, message: "Subject and experiment number are required." } },
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
        },
      },
      { status: 409 }
    );
  }

  try {
    const entry = await Experiment.create({
      ...body,
      subject,
      experimentNumber,
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
    if (error?.code === 11000) {
      return NextResponse.json(
        {
          data: {
            ok: false,
            message: `An experiment for ${subject} and Experiment ${experimentNumber} already exists.`,
          },
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        data: {
          ok: false,
          message: "Failed to upload...",
        },
      },
      { status: 500 }
    );
  }
}
