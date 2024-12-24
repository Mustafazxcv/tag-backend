const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const config = require('../config/config');

const pool = new Pool(config.database);

const registerAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Kullanıcı adı ve şifre gereklidir.');
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 8);

    const result = await pool.query(
      'INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING id',
      [username, hashedPassword]
    );

    res.status(201).send({ id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Admin kaydı sırasında bir hata oluştu.');
  }
};


const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Kullanıcı adı ve şifre gereklidir.');
  }

  try {
    const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(404).send('Kullanıcı bulunamadı.');
    }

    const admin = result.rows[0];
    const passwordIsValid = bcrypt.compareSync(password, admin.password);

    if (!passwordIsValid) {
      return res.status(401).send('Şifre yanlış.');
    }

    const token = jwt.sign({ id: admin.id }, config.secret, { expiresIn: '1h' });

    const ipAddress = req.ip || 'Bilinmeyen IP';
    await pool.query(
      'INSERT INTO login_history (admin_id, ip_address) VALUES ($1, $2)',
      [admin.id, ipAddress]
    );

    res.status(200).send({ auth: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Giriş sırasında bir hata oluştu.');
  }
};


const getLoginHistory = async (req, res) => {
  const adminId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM login_history WHERE admin_id = $1 ORDER BY login_time DESC',
      [adminId]
    );

    res.status(200).send(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Giriş geçmişi alınırken bir hata oluştu.');
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getLoginHistory,
};
