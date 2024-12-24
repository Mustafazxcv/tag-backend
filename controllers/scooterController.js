const { Pool } = require('pg');
const config = require('../config/config');

const pool = new Pool(config.database);

const addScooter = async (req, res) => {
    const { serial_number, model, year, battery_level, price_per_hour, latitude, longitude, status } = req.body;
  
    if (!serial_number || !model || !year || !battery_level || !price_per_hour || !latitude || !longitude) {
      return res.status(400).send('Tüm alanlar gereklidir.');
    }
  
    try {
      const result = await pool.query(
        `INSERT INTO scooters (serial_number, model, year, battery_level, price_per_hour, latitude, longitude, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [serial_number, model, year, battery_level, price_per_hour, latitude, longitude, status || 'available']
      );
  
      res.status(201).send({
        message: 'Scooter başarıyla eklendi.',
        scooter: result.rows[0],
      });
    } catch (err) {
      if (err.code === '23505') {
        return res.status(400).send('Bu seri numarasına sahip bir scooter zaten var.');
      }
      console.error(err);
      res.status(500).send('Scooter eklenirken bir hata oluştu.');
    }
  };
  

const updateScooter = async (req, res) => {
    const { id } = req.params;
    const { serial_number, model, year, battery_level, price_per_hour, latitude, longitude, status } = req.body;
  
    if (!id) {
      return res.status(400).send('Scooter ID gereklidir.');
    }
  
    try {

      if (serial_number) {
        const checkSerial = await pool.query(
          'SELECT id FROM scooters WHERE serial_number = $1 AND id != $2',
          [serial_number, id]
        );
  
        if (checkSerial.rows.length > 0) {
          return res.status(400).send('Bu seri numarası başka bir scooter için kullanılıyor.');
        }
      }
  
      const result = await pool.query(
        `UPDATE scooters 
         SET serial_number = COALESCE($1, serial_number),
             model = COALESCE($2, model),
             year = COALESCE($3, year),
             battery_level = COALESCE($4, battery_level),
             price_per_hour = COALESCE($5, price_per_hour),
             latitude = COALESCE($6, latitude),
             longitude = COALESCE($7, longitude),
             status = COALESCE($8, status),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $9 RETURNING *`,
        [serial_number, model, year, battery_level, price_per_hour, latitude, longitude, status, id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).send('Scooter bulunamadı.');
      }
  
      res.status(200).send({
        message: 'Scooter başarıyla güncellendi.',
        scooter: result.rows[0],
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Scooter güncellenirken bir hata oluştu.');
    }
  };
  
  

  const getAllScooters = async (req, res) => {
    try {
      const query = 'SELECT * FROM scooters ORDER BY created_at DESC';
  
      const result = await pool.query(query);
  
      if (result.rows.length === 0) {
        return res.status(404).send('Hiçbir scooter bulunamadı.');
      }
  
      res.status(200).send(result.rows);
    } catch (err) {
      console.error('Scooterlar alınırken bir hata oluştu:', err);
      res.status(500).send('Scooterlar alınırken bir hata oluştu.');
    }
  };
  
  

  module.exports = {
    updateScooter,
    addScooter,
    getAllScooters,
  }