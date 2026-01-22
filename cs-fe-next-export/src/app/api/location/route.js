import utils from '@/utils';

export async function GET(req) {
  const ip = req.headers.get('x-forwarded-for') || req.ip;
  let cleanIp = ip.startsWith('::ffff:') ? ip.substring(7) : ip;

  if (cleanIp === '127.0.0.1' || cleanIp === '::1') {
    cleanIp = '58.78.162.1';
  }

  const response = await fetch(`http://ip-api.com/json/${cleanIp}`);

  const data = await response.json();

  let resData = { ip: cleanIp, ...data };

  return new Response(JSON.stringify(resData), {
    headers: { 'Content-Type': 'application/json' },
  });
}
