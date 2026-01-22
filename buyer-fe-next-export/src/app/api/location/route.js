// app/api/location/route.js
export async function GET(req) {
  const ip = req.headers.get('x-forwarded-for') || req.ip;
  // IPv6 형식에서 IPv4 주소 추출
  let cleanIp = ip.startsWith('::ffff:') ? ip.substring(7) : ip;

  // test
  if (cleanIp === '127.0.0.1') {
    cleanIp = '119.207.157.132';
  }

  // https://ip-api.com/docs/api:json
  const response = await fetch(`http://ip-api.com/json/${cleanIp}`);
  // { status: 'fail', message: 'reserved range', query: '127.0.0.1' }
  const data = await response.json();
  console.log('/api/location', data);

  let resData = { ip: cleanIp };
  if (data.status === 'success') {
    resData.location = data.countryCode;
  } else {
    resData.location = 'en';
  }

  return new Response(JSON.stringify(resData), {
    headers: { 'Content-Type': 'application/json' },
  });
}
