export function GET() {
  return new Response("google-site-verification: google94caba9244064123.html", {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
