const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const config = require('../config/config');

const pool = new Pool(config.database);

const registerUser = async (req, res) => {
  const { phone_number } = req.body;

  if (!phone_number) {
    return res.status(400).send('Telefon numarası gereklidir.');
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (phone_number) VALUES ($1) ON CONFLICT (phone_number) DO NOTHING RETURNING id',
      [phone_number]
    );

    if (result.rows.length === 0) {
      return res.status(409).send('Telefon numarası zaten kayıtlı.');
    }

    res.status(201).send({ id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Kullanıcı kaydı sırasında bir hata oluştu.');
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
    const token = jwt.sign({ id: user.id, phone_number: user.phone_number }, config.secret, { expiresIn: '1h' });

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
      return res.status(400).send('Güncellenecek bir bilgi yok.');
    }

    values.push(id);

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${counter}`;
    await pool.query(query, values);

    res.status(200).send('Kullanıcı bilgileri güncellendi.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Kullanıcı bilgileri güncellenirken bir hata oluştu.');
  }
};

const getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT id, first_name, last_name, email, phone_number, created_at FROM users WHERE id = $1',
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
