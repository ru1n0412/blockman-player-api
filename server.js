export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return Response.json({
        status: "ok",
        message: "Blockman Player API"
      });
    }

    const match = url.pathname.match(/^\/api\/player\/(\d+)$/);

    if (!match) {
      return Response.json(
        { success: false, error: "Invalid player ID" },
        { status: 400 }
      );
    }

    return Response.json({
      success: false,
      id: match[1],
      error: "Player lookup API is not connected yet"
    });
  }
};
