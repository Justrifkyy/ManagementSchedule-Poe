// api-gateway/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ## PERBAIKAN DI SINI ##
// Rute untuk Auth Service TIDAK PERLU proxyReqPathResolver.
// Ini agar '/auth/login' diubah menjadi '/login' saat diteruskan.
app.use("/auth", proxy("http://localhost:3001"));

// Rute untuk service lain TETAP MEMERLUKAN proxyReqPathResolver
// karena path di gateway dan di service-nya sama persis.
app.use(
  "/schedules",
  proxy("http://localhost:3002", {
    proxyReqPathResolver: function (req) {
      return req.originalUrl;
    },
  })
);

app.use(
  "/attendances",
  proxy("http://localhost:3003", {
    proxyReqPathResolver: function (req) {
      return req.originalUrl;
    },
  })
);

app.listen(PORT, () => {
  console.log(`API Gateway is running on http://localhost:${PORT}`);
});
