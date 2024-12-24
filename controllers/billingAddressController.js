const { Pool } = require('pg');
const config = require('../config/config');

const pool = new Pool(config.database);


const addBillingAddress = async (req, res) => {
  const { city, district, neighborhood, address } = req.body;

  if (!city || !district || !neighborhood || !address) {
    return res.status(400).send('Tüm alanlar gereklidir.');
  }

  try {

    const userId = req.user.id;

    const result = await pool.query(
      'INSERT INTO billing_addresses (user_id, city, district, neighborhood, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, city, district, neighborhood, address]
    );

    res.status(201).send({ message: 'Fatura adresi başarıyla eklendi.', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Fatura adresi eklenirken bir hata oluştu.');
  }
};


const getUserBillingAddresses = async (req, res) => {
  try {

    const userId = req.user.id;

    const result = await pool.query(
      'SELECT * FROM billing_addresses WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.status(200).send(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Fatura adresleri alınırken bir hata oluştu.');
  }
};

module.exports = {
  addBillingAddress,
  getUserBillingAddresses,
};
