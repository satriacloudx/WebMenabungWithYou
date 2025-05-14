let entries = [];

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, amount, note } = req.body;
    entries.push({ name, amount: parseInt(amount), note, date: new Date() });
    return res.status(200).json({ success: true });
  }
  res.status(405).end(); // Method Not Allowed
}
