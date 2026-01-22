export async function GET(request) {
  const authHeader = request.headers.get('Authorization');
  console.log('authHeader', authHeader);
  if (authHeader !== 'Bearer abcd') {
    return new Response(JSON.stringify({ errorCode: 1003 }), {
      status: 200,
    });
  }

  return new Response(JSON.stringify({ message: 'Hello, you have access!' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
