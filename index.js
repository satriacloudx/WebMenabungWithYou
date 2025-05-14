const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Folder data yang bisa ditulis (Render mendukung penulisan di ./tmp)
const DATA_DIR = path.join(__dirname, "tmp");
const DATA_FILE = path.join(DATA_DIR, "data.json");

// Pastikan folder ./tmp ada
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Jika file belum ada, buat dengan data awal
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ entries: [] }, null, 2));
}

// Static files (HTML, CSS, JS) dari folder public
app.use(express.static("public"));
app.use(express.json());

// Endpoint GET /api/data
app.get("/api/data", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    const total = data.entries.reduce((sum, e) => sum + e.amount, 0);
    res.json({ total, entries: data.entries });
  } catch (err) {
    res.status(500).json({ error: "Gagal membaca data" });
  }
});

// Endpoint POST /api/add
app.post("/api/add", (req, res) => {
  const { name, amount, note } = req.body;
  if (!name || !amount) return res.status(400).send("Input tidak valid");

  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    data.entries.push({ name, amount, note, date: new Date() });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.status(200).send("Data berhasil disimpan");
  } catch (err) {
    res.status(500).json({ error: "Gagal menyimpan data" });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
