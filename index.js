const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Gunakan path absolut agar kompatibel di Render
const DATA_FILE = path.join(__dirname, "data.json");

// Cek dan buat file jika belum ada
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ entries: [] }, null, 2));
}

app.use(express.static("public"));
app.use(express.json());

// Ambil data
app.get("/api/data", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const total = data.entries.reduce((sum, e) => sum + e.amount, 0);
  res.json({ total, entries: data.entries });
});

// Tambah data
app.post("/api/add", (req, res) => {
  const { name, amount, note } = req.body;
  if (!name || !amount) return res.status(400).send("Invalid input");

  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  data.entries.push({ name, amount, note, date: new Date() });

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.status(200).send("OK");
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
