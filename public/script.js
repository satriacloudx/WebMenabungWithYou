const form = document.getElementById("form");
const totalEl = document.getElementById("total");
const historyEl = document.getElementById("history");
const progressBar = document.getElementById("progress-bar");
const target = 100000000; // Target tabungan
const amountInput = document.getElementById("amount");
const totalByNameEl = document.getElementById("total-by-name");

// Format input jumlah dengan pemisah ribuan
amountInput.addEventListener("input", function () {
  let value = this.value.replace(/[^\d]/g, ""); // Hapus selain angka
  if (value) {
    this.value = parseInt(value).toLocaleString("id-ID");
  } else {
    this.value = "";
  }
});

// Ambil data dari server
async function loadData() {
  const res = await fetch("/api/data");
  const data = await res.json();
  updateUI(data);
}

// Tampilkan data ke UI
function updateUI(data) {
  totalEl.textContent = data.total.toLocaleString("id-ID");

  const percent = (data.total / target) * 100;
  progressBar.style.width = `${percent}%`;

  // Riwayat setoran
  historyEl.innerHTML = "";
  data.entries.reverse().forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.name} menabung Rp${entry.amount.toLocaleString("id-ID")} - ${entry.note || ""} (${new Date(entry.date).toLocaleDateString("id-ID")})`;
    historyEl.appendChild(li);
  });

  // Tampilkan total per nama
  displayTotalByName(data.entries);
}

// Hitung & tampilkan total per nama
function displayTotalByName(entries) {
  const totalsByName = {};

  entries.forEach((entry) => {
    if (totalsByName[entry.name]) {
      totalsByName[entry.name] += entry.amount;
    } else {
      totalsByName[entry.name] = entry.amount;
    }
  });

  totalByNameEl.innerHTML = "";
  for (const name in totalsByName) {
    const total = totalsByName[name];
    const div = document.createElement("div");
    div.textContent = `${name}: Rp${total.toLocaleString("id-ID")}`;
    totalByNameEl.appendChild(div);
  }
}

// Kirim data baru
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const rawAmount = amountInput.value.replace(/\./g, "").replace(/,/g, "");
  const amount = parseInt(rawAmount);
  const note = document.getElementById("note").value;

  if (!name || !amount) return;

  await fetch("/api/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, amount, note }),
  });

  form.reset();
  loadData();
});

// Jalankan saat pertama kali
loadData();
