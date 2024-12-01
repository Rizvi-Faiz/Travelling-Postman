import bcrypt from "bcryptjs";
import db from "../../../lib/db";

export async function POST(req) {
  try {
    const { role, name, email, phone, username, password } = await req.json();

    if (!role || !name || !email || !phone || !username || !password) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    const existingUser = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    if (existingUser.rows.length > 0) {
      return new Response(
        JSON.stringify({ error: "Username already exists" }),
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (role, name, email, phone, username, password) VALUES ($1, $2, $3, $4, $5, $6)",
      [role, name, email, phone, username, hashedPassword]
    );

    return new Response(
      JSON.stringify({ message: "User created successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to sign up" }),
      { status: 500 }
    );
  }
}
