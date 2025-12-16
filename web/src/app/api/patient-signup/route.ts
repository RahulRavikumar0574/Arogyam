import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";
import { randomUUID } from "crypto";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const schema = z.object({
      name: z.string().min(1, "Name is required").trim(),
      gender: z.enum(["MALE", "FEMALE", "OTHER"], { message: "Gender is required" }),
      age: z.coerce.number().int().min(1, "Age is required"),
      height: z.coerce.number().int().min(1, "Height is required"),
      weight: z.coerce.number().int().min(1, "Weight is required"),
      specialCondition: z.string().optional(),
      address: z.string().min(1, "Address is required").trim(),
      email: z.string().email("Valid email required").transform((e) => e.toLowerCase().trim()),
      phone: z.string().min(1, "Phone number is required").trim(),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
    }).refine((d) => d.password === d.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json({ error: first.message }, { status: 400 });
    }
    const { name, gender, age, height, weight, specialCondition, address, email, phone, password } = parsed.data;

    const existing = await prisma.user.findFirst({
      where: { email },
    });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const created = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: Role.PATIENT,
        gender,
        age,
        height,
        weight,
        specialCondition,
        address,
        phone,
        rollNo: randomUUID(), // Using a random UUID for rollNo as it's not provided in the form
      },
      select: { id: true },
    });

    // Best-effort: assign this patient to a random doctor
    try {
      const doctors = await prisma.user.findMany({ where: { role: Role.DOCTOR }, select: { id: true } });
      if (doctors.length > 0) {
        const random = doctors[Math.floor(Math.random() * doctors.length)];
        const id = randomUUID();
        await prisma.assignment.create({
          data: {
            id,
            patientId: created.id,
            doctorId: random.id,
          },
        });
      }
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("/api/patient-signup error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
