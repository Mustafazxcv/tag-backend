const { Pool } = require('pg');
const config = require('../config/config');

const pool = new Pool(config.database);

const incrementTagByLocation = async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).send('Latitude ve longitude gereklidir.');
  }

  try {
    // Konumun var olup olmadığını kontrol et
    const result = await pool.query(
      'SELECT * FROM location_tags WHERE latitude = $1 AND longitude = $2',
      [latitude, longitude]
    );

    if (result.rows.length === 0) {
      // Kayıt yoksa yeni bir kayıt oluştur
      const insertResult = await pool.query(
        'INSERT INTO location_tags (latitude, longitude, tag_count) VALUES ($1, $2, $3) RETURNING *',
        [latitude, longitude, 1]
      );

      return res.status(201).send({
        message: 'Konum oluşturuldu ve tag sayacı 1 olarak ayarlandı.',
        record: insertResult.rows[0],
      });
    }

    // Kayıt varsa tag_count artır
    const updateResult = await pool.query(
      'UPDATE location_tags SET tag_count = tag_count + 1 WHERE latitude = $1 AND longitude = $2 RETURNING *',
      [latitude, longitude]
    );

    res.status(200).send({
      message: 'Tag sayacı artırıldı.',
      record: updateResult.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Tag artırma sırasında bir hata oluştu.');
  }
};

const getAllTags = async (req, res) => {
  try {
    // Tüm konum ve tag_count kayıtlarını al
    const result = await pool.query('SELECT * FROM location_tags');

    if (result.rows.length === 0) {
      return res.status(404).send({
        message: 'Herhangi bir konum kaydı bulunamadı.',
      });
    }

    res.status(200).send({
      message: 'Konumlar başarıyla getirildi.',
      records: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Konumları getirme sırasında bir hata oluştu.');
  }
};

module.exports = {
  incrementTagByLocation,
  getAllTags,
};
