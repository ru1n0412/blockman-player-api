const express = require("express");
const https = require("https");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/player/:id", (req, res) => {
  const id = String(req.params.id);

  if (!/^\d{2,32}$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: "ユーザーIDが正しくありません"
    });
  }

  const url =
    "https://pay.blockmango.com/api/store/userInfo?userId=" +
    encodeURIComponent(id);

  https.get(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0",
      "Referer": "https://pay.blockmango.com/"
    }
  }, (response) => {
    let body = "";

    response.on("data", chunk => body += chunk);

    response.on("end", () => {
      try {
        const data = JSON.parse(body);

        if (response.statusCode !== 200 ||
            data.success === false ||
            data.error) {
          return res.status(502).json({
            success: false,
            message: "プレイヤー情報を取得できませんでした"
          });
        }

        const player = data.data || data;

        if (!player.name) {
          return res.status(404).json({
            success: false,
            message: "プレイヤーが見つかりません"
          });
        }

        res.json({
          success: true,
          id: String(player.userId || id),
          name: player.name,
          avatar: player.picUrl || null
        });
      } catch (error) {
        res.status(502).json({
          success: false,
          message: "APIの応答を読み取れませんでした"
        });
      }
    });
  }).on("error", () => {
    res.status(502).json({
      success: false,
      message: "APIへの接続に失敗しました"
    });
  });
});

app.get("/", (req, res) => {
  res.json({ status: "Blockman player API is running" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server started on port " + PORT);
});
