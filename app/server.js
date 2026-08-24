const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.type("html").send(`<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>FortiCNAPP Demo</title></head>
<body>
  <main>
    <h1>FortiCNAPP CI/CD Demo</h1>
    <p>This application is packaged as a Docker image and scanned before publication to GHCR.</p>
  </main>
</body>
</html>`);
});

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.listen(port, "0.0.0.0", () => {
  console.log(`Listening on ${port}`);
});
