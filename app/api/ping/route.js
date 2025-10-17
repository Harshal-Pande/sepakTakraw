export async function GET() {
  return Response.json({
    success: true,
    message: "API is alive and running",
    timestamp: new Date().toISOString(),
    status: "healthy"
  })
}
