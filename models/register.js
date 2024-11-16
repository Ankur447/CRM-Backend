const pool = require("../config/db");

const createUser = async (user) => {
  const { name, email, password } = user;
  const query = `
    INSERT INTO users (name, email, password) 
    VALUES ($1, $2, $3) 
    RETURNING *;
  `;
  const values = [name, email, password];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];
  const { rows } = await pool.query(query, values);
  return rows[0]; // Returns the user if found, otherwise undefined
};

const addDoctor = async (email) => {
  const query = `
    INSERT INTO doctors (user_id, role)
    SELECT user_id, 'doctor'
    FROM users
    WHERE email = $1
    RETURNING *;
  `;
  const values = [email];

  try {
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      throw new Error('User not found or already a doctor');
    }
    return rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

module.exports = { createUser, getUserByEmail,addDoctor };
