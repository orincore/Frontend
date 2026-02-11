import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServiceSupabase } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, full_name, secret } = await req.json();

    // Simple protection: require a secret that matches AUTH_JWT_SECRET
    if (secret !== process.env.AUTH_JWT_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Check if user already exists
    const { data: existing } = await supabase
      .from("auth_users")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const password_hash = await bcrypt.hash(password, 12);

    const { data: user, error } = await supabase
      .from("auth_users")
      .insert({
        email: email.toLowerCase().trim(),
        password_hash,
        full_name: full_name || null,
        role: "admin",
        status: "active",
      })
      .select("id, email, full_name, role, status")
      .single();

    if (error) {
      console.error("Seed error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user, message: "Admin user created successfully" });
  } catch (err: any) {
    console.error("Seed error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
