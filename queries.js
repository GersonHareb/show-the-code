const pg = require("pg");

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "storybook",
  password: "7703",
  port: 5432,
});

// create new user
async function newUser(user) {
  const values = Object.values(user);
  const query = {
    text: `INSERT INTO usuario (nombre, apellido, email, password, blog_name, pfp) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    values: values,
  };
  try {
    await pool.query("BEGIN");
    await pool.query(query);
    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error.message);
  }
}

async function login(email, password) {
  const values = [email, password];
  const query = {
    text: `SELECT * FROM usuario WHERE email = $1 AND password = $2`,
    values: values,
  };
  try {
    await pool.query("BEGIN");
    const res = await pool.query(query);
    await pool.query("COMMIT");
    return res.rows[0];
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error.message);
  }
}

const getUser = async (id) => {
  const query = {
    text: "SELECT * FROM usuario WHERE id = $1;",
    values: [id],
  };
  try {
    const response = await pool.query(query);
    return response.rows[0];
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = { newUser, login, getUser };
