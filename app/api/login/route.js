import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';  
import db from '../../../lib/db';
import { NextResponse } from 'next/server';  

export async function POST(req) {
  try {
    const body = await req.json(); 
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = result.rows[0];
    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const cookieHeader = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',  
      sameSite: 'strict',
      maxAge: 3600,  
      path: '/',
    });

    return NextResponse.json(
      {
        message: 'Authentication successful',
        username: user.username, // Include username in the response
        role: user.role,         // Include role if needed
        token,                   // Include token for optional client-side use
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': cookieHeader,
        },
      }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to authenticate' }, { status: 500 });
  }
}
