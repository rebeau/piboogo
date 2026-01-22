// app/api/google/place/route.ts
import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const placeId = searchParams.get('place_id');
  const urlParam = searchParams.get('url');

  try {
    let googleApiUrl = '';

    // 1. 자동완성 요청
    if (urlParam) {
      googleApiUrl = decodeURIComponent(urlParam);
    }

    // 2. place_id로 상세 정보 요청
    else if (placeId) {
      googleApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`;
    }

    // 에러 처리
    if (!googleApiUrl) {
      return NextResponse.json(
        { error: 'url 또는 place_id가 필요합니다.' },
        { status: 400 },
      );
    }

    const response = await fetch(googleApiUrl);
    const result = await response.json();

    if (result.status !== 'OK') {
      return NextResponse.json({ error: result.status }, { status: 200 });
    }

    return NextResponse.json({
      ...result,
      errorCode: 0,
    });
  } catch (error) {
    console.error('Google API 호출 오류:', error);
    return NextResponse.json(
      { error: 'Google API 요청 실패' },
      { status: 500 },
    );
  }
}
