const express = require("express");
const fs = require("fs-extra");
const app = express();
const PORT = 3000;
const DB_FILE = "./data.json";

app.use(express.static("."));
app.use(express.json());

app.get("/api/data", async (req, res) => {
  const data = await fs.readJson(DB_FILE);
  res.json(data);
});

app.post("/api/add", async (req, res) => {
  const { name, amount, note } = req.body;
  if (!name || !amount) return res.status(400).send("Invalid data");

  const entry = {
    name,
    amount,
    note,
    date: new Date().toISOString(),
  };

  const data = await fs.readJson(DB_FILE);
  data.entries.push(entry);
  data.total += parseInt(amount);
  await fs.writeJson(DB_FILE, data);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
