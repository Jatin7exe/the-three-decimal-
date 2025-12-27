const socket = io();

const prices = [];
const labels = [];

const ctx = document.getElementById("chart").getContext("2d");

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      label: "BTC Trade Value",
      data: prices,
      borderWidth: 2
    }]
  }
});


socket.on("trade", (data) => {
  prices.push(data.value);
  labels.push(new Date().toLocaleTimeString());

  if (prices.length > 35) {
    prices.shift();
    labels.shift();
  }

  chart.update();
});

socket.on("whale", (value) => {
  const alert = document.getElementById("alert");
  const amount = document.getElementById("amount");

  amount.innerText = ` $${value.toFixed(2)}`;
  alert.style.display = "block";

  setTimeout(() => {
    alert.style.display = "none";
  }, 4000);
});
fetch("https://api.coingecko.com/api/v3/coins/bitcoin")
  .then(res => res.json())
  .then(data => {
    document.getElementById("btc-logo").src = data.image.small;
  });
  window.addEventListener("load", async () => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/bitcoin"
    );

    const data = await response.json();

    const logoUrl = data.image.small;

    const img = document.createElement("img");
    img.src = logoUrl;
    img.alt = "Bitcoin Logo";
    img.style.width = "32px";
    img.style.verticalAlign = "middle";
    img.style.marginRight = "8px";

    document.getElementById("btc-logo").appendChild(img);
  } catch (error) {
    console.log("Failed to load Bitcoin logo");
  }
});

