// src/app/api/geocode/route.ts (Next.js 14 기준)
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: '주소를 입력해주세요.' },
      { status: 400 },
    );
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;
    const encodedAddress = encodeURIComponent(address);
    const countries = ['KR', 'US'];

    // 국가별로 병렬 요청
    const responses = await Promise.all(
      countries.map((country) =>
        axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}&components=country:${country}`,
        ),
      ),
    );

    // 각 응답에서 result 추출
    const results = responses.map((res) => res.data);

    // 유효한 결과 찾기 (results 배열이 있고, 비어있지 않은 것)
    const firstValid = results.find(
      (result) => result.status === 'OK' && result.results.length > 0,
    );

    if (!firstValid) {
      return NextResponse.json(
        { error: '검색된 주소가 없습니다.' },
        { status: 200 },
      );
    }

    return NextResponse.json({
      datas: firstValid.results,
      errorCode: 0,
    });
  } catch (error: any) {
    console.error('Geocoding error:', error.message);
    return NextResponse.json({ error: '서버 에러' }, { status: 500 });
  }
}
