const crypto = require('crypto');

// Define a fixed key, storing it de manera segura (e.g., en variables de entorno)
const key = Buffer.from(process.env.CRYPTO_KEY || '12345678901234567890123456789012'); // 32 bytes

const algorithm = 'aes-256-cbc';

exports.encrypt = (req, res) => {
  const { text } = req.body;

  // Generar un IV aleatorio (16 bytes para AES)
  const iv = crypto.randomBytes(16);

  // Cifrar
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  res.json({ encrypted, iv: iv.toString('hex') });
};

exports.decrypt = (req, res) => {
  const { encrypted, ivHex } = req.body;

  // Decodificar el IV desde el cliente
  const iv = Buffer.from(ivHex, 'hex');

  // Descifrar
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  res.json({ decrypted });
};
