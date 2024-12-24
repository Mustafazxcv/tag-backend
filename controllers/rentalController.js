const { Pool } = require('pg');
const config = require('../config/config');

const pool = new Pool(config.database);

const rentScooter = async (req, res) => {
  const { scooter_id, duration, total_price } = req.body;
  const userId = req.user.id; 

  if (!scooter_id || !duration || !total_price) {
    return res.status(400).send('Scooter ID, kiralama süresi ve toplam ücret gereklidir.');
  }

  try {
    const balanceResult = await pool.query(
      'SELECT balance FROM user_balances WHERE user_id = $1',
      [userId]
    );

    if (balanceResult.rows.length === 0) {
      return res.status(404).send('Kullanıcı bakiyesi bulunamadı.');
    }

    const userBalance = parseFloat(balanceResult.rows[0].balance);

    const scooterResult = await pool.query(
      'SELECT status FROM scooters WHERE id = $1',
      [scooter_id]
    );

    if (scooterResult.rows.length === 0) {
      return res.status(404).send('Scooter bulunamadı.');
    }

    const scooter = scooterResult.rows[0];

    if (scooter.status !== 'available') {
      return res.status(400).send('Scooter şu anda kiralanamaz.');
    }

    if (userBalance < total_price) {
      return res.status(400).send('Bakiyeniz bu scooterı kiralamak için yeterli değil.');
    }

    const rentalResult = await pool.query(
      'INSERT INTO rentals (user_id, scooter_id, duration, total_price) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, scooter_id, duration, total_price]
    );

    await pool.query(
      'UPDATE user_balances SET balance = balance - $1 WHERE user_id = $2',
      [total_price, userId]
    );

    await pool.query(
      'UPDATE scooters SET status = $1 WHERE id = $2',
      ['in-use', scooter_id]
    );

    res.status(200).send({
      message: 'Scooter başarıyla kiralandı.',
      rental_id: rentalResult.rows[0].id,
      rental_cost: total_price,
      remaining_balance: userBalance - total_price,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Scooter kiralama sırasında bir hata oluştu.');
  }
};

const getCurrentScooter = async (req, res) => {
    const userId = req.user.id; 
  
    try {
      const result = await pool.query(
        `SELECT 
           r.scooter_id,
           s.serial_number,
           s.model,
           s.year,
           s.battery_level,
           s.latitude,
           s.longitude,
           r.start_time,
           r.duration,
           r.total_price
         FROM rentals r
         JOIN scooters s ON r.scooter_id = s.id
         WHERE r.user_id = $1 AND r.status = 'active'`,
        [userId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).send('Şu anda aktif olarak bir scooter kullanmıyorsunuz.');
      }
  
      res.status(200).send({
        message: 'Şu anda kullandığınız scooter bilgileri:',
        scooter: result.rows[0],
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Aktif scooter bilgisi alınırken bir hata oluştu.');
    }
  };

  const endScooterRental = async (req, res) => {
    const userId = req.user.id; // Kullanıcı ID'si token'dan alınır
    const { scooter_id, latitude, longitude, battery_level } = req.body; // Scooter ID, konum bilgileri ve şarj seviyesi
  
    if (!scooter_id || !latitude || !longitude || battery_level == null) {
      return res.status(400).send('Scooter ID, latitude, longitude ve battery_level gereklidir.');
    }
  
    try {
      // Aktif kiralama kontrolü
      const rentalResult = await pool.query(
        'SELECT * FROM rentals WHERE user_id = $1 AND scooter_id = $2 AND status = $3',
        [userId, scooter_id, 'active']
      );
  
      if (rentalResult.rows.length === 0) {
        return res.status(404).send('Bu scooter için aktif bir kiralama bulunamadı.');
      }
  
      // Kiralama işlemini tamamla
      await pool.query(
        'UPDATE rentals SET status = $1, end_time = CURRENT_TIMESTAMP WHERE user_id = $2 AND scooter_id = $3 AND status = $4',
        ['completed', userId, scooter_id, 'active']
      );
  
      // Scooter'ın durumunu, konumunu ve şarj seviyesini güncelle
      await pool.query(
        'UPDATE scooters SET status = $1, latitude = $2, longitude = $3, battery_level = $4 WHERE id = $5',
        ['available', latitude, longitude, battery_level, scooter_id]
      );
  
      res.status(200).send({
        message: 'Scooter başarıyla bırakıldı.',
        scooter_id: scooter_id,
        location: { latitude, longitude },
        battery_level: battery_level,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Scooter bırakma sırasında bir hata oluştu.');
    }
  };
  
module.exports = {
  rentScooter,
  getCurrentScooter,
  endScooterRental,
};
