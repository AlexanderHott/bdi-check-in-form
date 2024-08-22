export function GET(request: Request) {
  console.log(request);
  // request.bo
  return Response.json({ ok: true });
}
