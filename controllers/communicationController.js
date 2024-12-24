const { Pool } = require('pg');
const config = require('../config/config');

const pool = new Pool(config.database);


const addCommunicationPermissions = async (req, res) => {
  const { email_permission, sms_permission, phone_permission } = req.body;

  try {
    const userId = req.user.id; // Token'dan userId al

    const result = await pool.query(
      'INSERT INTO communication_permissions (user_id, email_permission, sms_permission, phone_permission) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id) DO UPDATE SET email_permission = $2, sms_permission = $3, phone_permission = $4, updated_at = CURRENT_TIMESTAMP RETURNING *',
      [userId, email_permission || false, sms_permission || false, phone_permission || false]
    );

    res.status(201).send({ message: 'İletişim izinleri başarıyla eklendi/güncellendi.', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('İletişim izinleri eklenirken bir hata oluştu.');
  }
};


const getCommunicationPermissions = async (req, res) => {
  try {
    const userId = req.user.id; // Token'dan userId al

    const result = await pool.query(
      'SELECT * FROM communication_permissions WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('İletişim izinleri bulunamadı.');
    }

    res.status(200).send(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('İletişim izinleri alınırken bir hata oluştu.');
  }
};

module.exports = {
  addCommunicationPermissions,
  getCommunicationPermissions,
};
