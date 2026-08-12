const { Client } = require('pg');

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
console.log('Testing connection to:', connectionString ? connectionString.replace(/:[^:@]+@/, ':****@') : 'undefined');

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    console.log('Successfully connected to database!');
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log('Current DB time:', res.rows[0]);
    return client.end();
  })
  .catch(err => {
    console.error('Connection error:', err.message, err.code);
    client.end();
  });
