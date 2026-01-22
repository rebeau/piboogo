import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { MGNT } from './constants/pageURL';
import utils from './utils';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const PUBLIC_FILE = /\.(png|jpg|jpeg|gif|svg|css|js)$/i;
  if (PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }
}
