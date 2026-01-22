// app/api/authorize/token/route.js

export async function POST(request) {
  const body = await request.json();

  console.log('body', body);

  try {
    return Response.json({ token });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: 'Failed to generate token' },
      { status: 500 },
    );
  }
}
