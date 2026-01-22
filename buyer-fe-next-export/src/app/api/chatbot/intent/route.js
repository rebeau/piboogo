// app/api/chatbot/intent/route.ts

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);

  const lang = searchParams.get('lang') || 'ko';
  searchParams.delete('lang');

  const targetUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/chat-bot/intent/sse?${searchParams.toString()}`;
  console.log('targetUrl', targetUrl);
  console.log('header', {
    headers: {
      lang,
    },
  });

  const response = await fetch(targetUrl, {
    headers: {
      lang,
    },
  });

  // SSE 헤더 세팅
  const headers = new Headers();
  headers.set('Content-Type', 'text/event-stream');
  headers.set('Cache-Control', 'no-cache');
  headers.set('Connection', 'keep-alive');

  return new Response(response.body, { headers });
}
