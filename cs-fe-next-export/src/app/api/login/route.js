import axios from 'axios';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const { id, pw, lang } = body;

  try {
    const { data } = await axios.get('https://api.piboogo.com/v1/cs-user', {
      headers: {
        lang: lang,
      },
      params: {
        id,
        pw,
      },
    });

    const token = data.token;

    cookies().set('authToken', token, {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '인증 실패' },
      { status: 401 },
    );
  }
}
