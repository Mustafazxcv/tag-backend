const { Pool } = require('pg');
const config = require('../config/config');

const pool = new Pool(config.database);

const sendNotification = async (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    return res.status(400).send('Başlık ve metin gereklidir.');
  }

  try {
    const adminId = req.user.id; 

    const result = await pool.query(
      'INSERT INTO notifications (admin_id, title, text) VALUES ($1, $2, $3) RETURNING *',
      [adminId, title, text]
    );

    res.status(201).send({ message: 'Bildirim başarıyla gönderildi.', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Bildirim gönderilirken bir hata oluştu.');
  }
};


const getNotifications = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT n.id, n.title, n.text, n.created_at, a.username AS admin_username FROM notifications n INNER JOIN admins a ON n.admin_id = a.id ORDER BY n.created_at DESC'
    );

    res.status(200).send(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Bildirimler alınırken bir hata oluştu.');
  }
};

module.exports = {
  sendNotification,
  getNotifications,
};
