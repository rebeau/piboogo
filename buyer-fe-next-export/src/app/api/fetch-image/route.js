// app/api/fetch-image/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  // console.log('Received POST request at /api/fetch-image');
  const { url } = await req.json();
  // console.log('Requested URL:', url);
  if (!url) {
    // console.log('No URL provided');
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }
  try {
    // 이미지 URL로 요청
    const response = await fetch(url);
    if (!response.ok) {
      // console.error('Failed to fetch image');
      throw new Error('Failed to fetch image');
    }
    // arrayBuffer()로 이미지 데이터를 읽음
    const imageBuffer = await response.arrayBuffer();
    // console.log('Image fetched successfully');
    // 클라이언트에 이미지 데이터 전송
    return new NextResponse(Buffer.from(imageBuffer), {
      headers: { 'Content-Type': 'image/png' }, // 이미지 MIME 타입 설정 (PNG로 가정)
    });
  } catch (error) {
    // console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 },
    );
  }
}
