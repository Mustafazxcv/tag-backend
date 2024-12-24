require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const config = require('./config/config');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const billingAddressRoutes = require('./routes/billingAddressRoutes');
const communicationRoutes = require('./routes/communicationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const balanceRoutes = require('./routes/balanceRoutes');
const scooterRoutes = require('./routes/scooterRoutes');
const rentalsScooter = require('./routes/rentalRoutes');
const incrementTag = require('./routes/incrementRoutes');
const functions = require('./routes/functionRoutes');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 250, 
  message: 'Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin.',
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  methods: 'GET,PUT,POST,DELETE',
  credentials: true,
}));

app.use(limiter); 
app.use(helmet()); 

const pool = new Pool(config.database);

app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes)
app.use('/api/billing-addresses', billingAddressRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/scooters', scooterRoutes);
app.use('/api/rentals', rentalsScooter);
app.use('/api/increment', incrementTag);
app.use('/api/function', functions);

const ipAddress = process.env.IP_ADDRESS; 
const port = process.env.PORT; 
app.listen(port, ipAddress, () => {
  console.log(`Sunucu şu adreste çalışıyor: http://${ipAddress}:${port}`);
});
