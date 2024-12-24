const { Pool } = require('pg');
const config = require('../config/config');

const pool = new Pool(config.database);

const saveGmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send('E-posta adresi gereklidir.');
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  if (!emailRegex.test(email)) {
    return res.status(400).send('Yalnızca @gmail.com uzantılı adreslere izin verilir.');
  }

  try {
    const result = await pool.query(
      'INSERT INTO gmail_addresses (email) VALUES ($1) RETURNING *',
      [email] 
    );

    res.status(201).send({
      message: 'Gmail adresi başarıyla kaydedildi.',
      record: result.rows[0],
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).send('Bu Gmail adresi zaten kayıtlı.');
    }
    console.error(err);
    res.status(500).send('Gmail adresi kaydedilirken bir hata oluştu.');
  }
};

const saveContactMessage = async (req, res) => {
    const { first_name, last_name, phone_number, email, subject, message } = req.body;
  

    if (!first_name || !last_name || !phone_number || !email || !subject || !message) {
      return res.status(400).send('Tüm alanlar gereklidir.');
    }
  

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  
    if (!emailRegex.test(email)) {
      return res.status(400).send('Yalnızca @gmail.com uzantılı adreslere izin verilir.');
    }
  
    try {

      const result = await pool.query(
        `INSERT INTO contact_messages (first_name, last_name, phone_number, email, subject, message) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [first_name, last_name, phone_number, email, subject, message]
      );
  
      res.status(201).send({
        message: 'İletişim mesajı başarıyla kaydedildi.',
        record: result.rows[0],
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('İletişim mesajı kaydedilirken bir hata oluştu.');
    }
  };

  const getContactMessages = async (req, res) => {
    try {

      const result = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
  
      if (result.rows.length === 0) {
        return res.status(404).send('Henüz kayıtlı bir iletişim mesajı bulunmamaktadır.');
      }
  
      res.status(200).send({
        message: 'İletişim mesajları başarıyla alındı.',
        records: result.rows,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('İletişim mesajları alınırken bir hata oluştu.');
    }
  };
  
module.exports = {
  saveGmail,
  saveContactMessage,
  getContactMessages,
};
