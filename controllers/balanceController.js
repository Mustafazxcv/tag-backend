const { Pool } = require('pg');
const config = require('../config/config');

const pool = new Pool(config.database);

const getUserBalance = async (req, res) => {
  try {
    const userId = req.user.id; 

    const result = await pool.query(
      'SELECT balance FROM user_balances WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Kullanıcı bakiyesi bulunamadı.');
    }

    res.status(200).send(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Kullanıcı bakiyesi alınırken bir hata oluştu.');
  }
};

const loadBalance = async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).send('Yüklemek istediğiniz tutar geçersiz.');
  }

  try {
    const userId = req.user.id; 

    const result = await pool.query(
        `INSERT INTO user_balances (user_id, balance) 
         VALUES ($1, $2) 
         ON CONFLICT (user_id) DO UPDATE 
         SET balance = user_balances.balance + $2, updated_at = CURRENT_TIMESTAMP 
         RETURNING balance`,
        [userId, amount]
      );
      
      
      


    await pool.query(
      'INSERT INTO balance_transactions (user_id, transaction_type, amount) VALUES ($1, $2, $3)',
      [userId, 'load', amount]
    );

    res.status(200).send({ message: 'Bakiye başarıyla yüklendi.', balance: result.rows[0].balance });
  } catch (err) {
    console.error(err);
    res.status(500).send('Bakiye yüklenirken bir hata oluştu.');
  }
};

const getUserBalanceWithTransactions = async (req, res) => {
  try {
    const userId = req.user.id; 

    const balanceResult = await pool.query(
      'SELECT balance FROM user_balances WHERE user_id = $1',
      [userId]
    );

    if (balanceResult.rows.length === 0) {
      return res.status(404).send('Kullanıcı bakiyesi bulunamadı.');
    }

    const transactionsResult = await pool.query(
      'SELECT transaction_type, amount, created_at FROM balance_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10',
      [userId]
    );

    res.status(200).send({
      balance: balanceResult.rows[0].balance,
      transactions: transactionsResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Kullanıcı bakiyesi ve işlemleri alınırken bir hata oluştu.');
  }
};

const transferBalanceByPhone = async (req, res) => {
  const { phone_number, amount } = req.body;

  if (!phone_number || !amount || amount <= 0) {
    return res.status(400).send('Geçerli bir telefon numarası ve tutar belirtmelisiniz.');
  }

  try {
    const senderId = req.user.id; 

    await pool.query('BEGIN'); 


    const senderBalanceResult = await pool.query(
      'SELECT balance FROM user_balances WHERE user_id = $1',
      [senderId]
    );

    if (senderBalanceResult.rows.length === 0 || senderBalanceResult.rows[0].balance < amount) {
      await pool.query('ROLLBACK');
      return res.status(400).send('Yetersiz bakiye.');
    }

    const receiverResult = await pool.query(
      'SELECT id FROM users WHERE phone_number = $1',
      [phone_number]
    );

    if (receiverResult.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).send('Alıcı bulunamadı.');
    }

    const receiverId = receiverResult.rows[0].id;

    if (senderId === receiverId) {
      await pool.query('ROLLBACK');
      return res.status(400).send('Kendi hesabınıza bakiye gönderemezsiniz.');
    }

    await pool.query(
      'UPDATE user_balances SET balance = balance - $1 WHERE user_id = $2',
      [amount, senderId]
    );

    await pool.query(
      `INSERT INTO user_balances (user_id, balance)
       VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE
       SET balance = user_balances.balance + $2`,
      [receiverId, amount]
    );

    await pool.query(
      'INSERT INTO balance_transfers (sender_id, receiver_id, amount, transaction_type) VALUES ($1, $2, $3, $4)',
      [senderId, receiverId, amount, 'transfer']
    );

    await pool.query('COMMIT'); 

    res.status(200).send({ message: 'Bakiye başarıyla transfer edildi.' });
  } catch (err) {
    console.error(err);
    await pool.query('ROLLBACK'); 
    res.status(500).send('Bakiye transfer edilirken bir hata oluştu.');
  }
};


module.exports = {
  getUserBalance,
  loadBalance,
  getUserBalanceWithTransactions,
  transferBalanceByPhone,
};
