const express = require("express");
const axios = require("axios");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));


const BINANCE_API =
  "https://api.binance.com/api/v3/trades?symbol=BTCUSDT&limit=50";

let lastTradeId = 0;

setInterval(async () => {
  try {
    const res = await axios.get(BINANCE_API);
    const trades = res.data;

    for (let trade of trades) {
      if (trade.id <= lastTradeId) continue;

      const price = parseFloat(trade.price);
      const quantity = parseFloat(trade.qty);
      const value = price * quantity;

      io.emit("trade", { price, value });

      if (value > 1000) {
        console.log("🐋 WHALE DETECTED:", value.toFixed(2));
        io.emit("whale", value);
      }

      lastTradeId = trade.id;
    }
  } catch (err) {
    console.log("Error fetching data");
  }
}, 3000);

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
