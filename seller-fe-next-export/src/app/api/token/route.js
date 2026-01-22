export async function GET(request) {
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== 'Bearer your-secret-token') {
    return new Response(
      JSON.stringify({ errorCode: 0, data: { accessToken: 'abcd' } }),
      {
        status: 200,
      },
    );
  }

  return new Response(JSON.stringify({ message: 'Hello, you have access!' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function PATCH(request) {
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== 'Bearer your-secret-token') {
    return new Response(
      JSON.stringify({ errorCode: 0, data: { accessToken: 'abcd' } }),
      {
        status: 200,
      },
    );
  }

  return new Response(JSON.stringify({ message: 'Hello, you have access!' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
