const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const config = require('../config/config');

const pool = new Pool(config.database);

const registerUser = async (req, res) => {
  const { first_name, last_name, birth_date, email, phone_number } = req.body;

  if (!phone_number) {
    return res.status(400).send({
      error: true,
      message: "Telefon numarası gereklidir. Lütfen geçerli bir telefon numarası sağlayın.",
    });
  }

  if (!first_name || !last_name || !birth_date || !email) {
    return res.status(400).send({
      error: true,
      message:
        "Tüm alanlar gereklidir. Eksik alanlar: " +
        [
          !first_name ? "Ad" : null,
          !last_name ? "Soyad" : null,
          !birth_date ? "Doğum Tarihi" : null,
          !email ? "E-posta" : null,
        ]
          .filter(Boolean)
          .join(", "),
    });
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).send({
      error: true,
      message: "Geçerli bir e-posta adresi giriniz.",
    });
  }

  if (isNaN(Date.parse(birth_date))) {
    return res.status(400).send({
      error: true,
      message: "Geçerli bir doğum tarihi giriniz (örn: 1990-01-01).",
    });
  }

  try {

    const result = await pool.query(
      `
      INSERT INTO users (first_name, last_name, birth_date, email, phone_number)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (phone_number)
      DO UPDATE SET 
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        birth_date = EXCLUDED.birth_date,
        email = EXCLUDED.email
      RETURNING id
      `,
      [first_name, last_name, birth_date, email, phone_number]
    );

    if (result.rows.length === 0) {
      return res.status(409).send({
        error: true,
        message: "Kullanıcı bilgileri güncellenemedi. Telefon numarası zaten kayıtlı olabilir.",
      });
    }

    const userId = result.rows[0].id;

    const permissionResult = await pool.query(
      'SELECT 1 FROM communication_permissions WHERE user_id = $1',
      [userId]
    );

    if (permissionResult.rows.length === 0) {
      await pool.query(
        'INSERT INTO communication_permissions (user_id, email_permission, phone_permission, sms_permission) VALUES ($1, $2, $3, $4)',
        [userId, false, false, false]
      );
    }

    res.status(201).send({
      success: true,
      id: userId,
      message: `Kullanıcı başarıyla kaydedildi veya güncellendi.`,
    });
  } catch (err) {
    console.error(err);

    if (err.code === "ECONNREFUSED") {
      return res.status(500).send({
        error: true,
        message: "Veritabanı bağlantı hatası. Lütfen daha sonra tekrar deneyin.",
      });
    }

    if (err.code === "23505") {
      return res.status(409).send({
        error: true,
        message: "Bu telefon numarası veya E-Posta zaten kayıtlı.",
      });
    }

    res.status(500).send({
      error: true,
      message: "Kullanıcı kaydı sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
    });
  }
};




const loginUser = async (req, res) => {
  const { phone_number } = req.body;

  if (!phone_number) {
    return res.status(400).send('Telefon numarası gereklidir.');
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE phone_number = $1',
      [phone_number]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Kullanıcı bulunamadı.');
    }

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, phone_number: user.phone_number }, config.secret);

    res.status(200).send({ auth: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Giriş sırasında bir hata oluştu.');
  }
};

const updateUserInfo = async (req, res) => {
  const { id } = req.user; 
  const { first_name, last_name, birth_date, email } = req.body;

  try {
    const updates = [];
    const values = [];
    let counter = 1;


    if (first_name) {
      updates.push(`first_name = $${counter}`);
      values.push(first_name);
      counter++;
    }
    if (last_name) {
      updates.push(`last_name = $${counter}`);
      values.push(last_name);
      counter++;
    }
    if (birth_date) {
      updates.push(`birth_date = $${counter}`);
      values.push(birth_date);
      counter++;
    }
    if (email) {
      updates.push(`email = $${counter}`);
      values.push(email);
      counter++;
    }

    if (updates.length === 0) {
      return res.status(400).send({ error: 'Güncellenecek bir bilgi yok.' });
    }

    values.push(id);

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${counter} RETURNING id`;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).send({ error: 'Kullanıcı bulunamadı veya güncelleme yapılmadı.' });
    }
    res.status(200).send({ message: 'Başarıyla güncellendi', user_id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Kullanıcı bilgileri güncellenirken bir hata oluştu.' });
  }
};


const getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT id, first_name, last_name, email, birth_date, phone_number, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Kullanıcı bulunamadı.');
    }

    res.status(200).send(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Kullanıcı bilgileri alınırken bir hata oluştu.');
  }
};

const checkPhoneNumber = async (req, res) => {
  const { phone_number } = req.body;

  if (!phone_number) {
    return res.status(400).send('Telefon numarası gereklidir.');
  }

  try {

    const result = await pool.query(
      'SELECT id FROM users WHERE phone_number = $1',
      [phone_number]
    );

    if (result.rows.length === 0) {
      return res.status(404).send({ message: 'Telefon numarası bulunamadı.' });
    }

    res.status(200).send({ message: 'Telefon numarası bulundu.', user_id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Telefon numarası sorgulanırken bir hata oluştu.');
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUserInfo,
  getUserInfo,
  checkPhoneNumber,
};
