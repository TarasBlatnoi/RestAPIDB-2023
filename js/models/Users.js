const db = require('../database')

class User {
  static async getAll() {
    const sql = `
        SELECT * 
        FROM users;
        `
    let connection
    try {
      connection = await db.promisePool.getConnection()
      const users = await connection.execute(sql)
      return users[0]
    } catch (err) {
      console.error(err)
    } finally {
      if (connection) {
        await connection.release()
      }
    }
  }

  static async getById(id) {
    const sql = `SELECT * FROM users WHERE id = ${id};`
    let connection
    try {
      connection = await db.promisePool.getConnection()
      const [res] = await connection.query(sql)
      return res
    } catch (err) {
      console.error(err)
    } finally {
      if (connection) {
        await connection.release()
      }
    }
  }

  static async updateById(id, { login, picture, password, email, role }) {
    const sql = `
        UPDATE project_db.users 
        SET 
          Login = ?,
          Picture = ?,
          Password = ?,
          Email = ?,
          Role = ?
        WHERE id = ?;
    `

    let connection
    try {
      connection = await db.promisePool.getConnection()
      await connection.beginTransaction()
      await connection.execute(sql, [login, picture, password, email, role, id])
      await connection.commit()
      return User.getById(id)
    } catch (err) {
      await connection.rollback()
      console.log(err)
    } finally {
      if (connection) {
        await connection.release()
      }
    }
  }

  static async create({ login, picture, password, email, role }) {
    const sql = `
        INSERT INTO project_db.users (login, picture, password, email, role)
        VALUES (?, ?, ?, ?, ?);
        `
    let connection
    try {
      connection = await db.promisePool.getConnection()
      const [res] = await connection.execute(sql, [
        login,
        picture,
        password,
        email,
        role,
      ])
      const createdUserId = res.insertId
      return User.getById(createdUserId)
    } catch (err) {
      console.error(err)
    } finally {
      if (connection) {
        await connection.release()
      }
    }
  }

  static async deleteById(id) {
    const user = await User.getById(id)
    const deleteProjectsMembersSql = `DELETE FROM project_db.projects_members WHERE MemberId = ${id}`
    const deleteMembersSql = `DELETE FROM project_db.members WHERE UserId = ${id}`
    const deleteUsersSql = `DELETE FROM project_db.users WHERE id = ${id}`

    let connection

    try {
      connection = await db.promisePool.getConnection()
      await connection.beginTransaction()
      await connection.execute(deleteProjectsMembersSql)
      await connection.execute(deleteMembersSql)
      await connection.execute(deleteUsersSql)
      await connection.commit()
      return user
    } catch (err) {
      console.log(err)
      await connection.rollback()
      throw err
    } finally {
      if (connection) {
        await connection.release()
      }
    }
  }
}

module.exports = { User }
