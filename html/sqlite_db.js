const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydatabase.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,username TEXT UNIQUE NOT NULL,password TEXT NOT NULL,email TEXT NOT NULL);`);
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, bookTitle TEXT, author TEXT, description TEXT, comments TEXT, price TEXT, filename TEXT, type TEXT)`);
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS sales (bookid INTEGER NOT NULL,userid INTEGER NOT NULL,number INTEGER NOT NULL DEFAULT 0,PRIMARY KEY (bookid, userid))`);
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS orderCenter(id INTEGER PRIMARY KEY AUTOINCREMENT,userid INTEGER NOT NULL,bookid INTEGER NOT NULL,title TEXT NOT NULL,number INTEGER NOT NULL,totalPrice REAL NOT NULL)`);
});

// 查询用户数据
function selectUser(username, password, callback) {
  const sqlStr = 'SELECT * FROM users WHERE username = ? AND password = ?';
  const sqlParams = [username, password];
  db.all(sqlStr, sqlParams, function (err, rows) {
    if (err) {
      console.log("数据查询失败..." + err.message);
      callback(err, null);
    } else {
      if (rows.length !== 0) {
        console.log("数据查询成功");
        callback(null, rows);
      } else {
        const notFoundErr = new Error("No data found");
        notFoundErr.status = 404;
        callback(notFoundErr, null);
      }
    }
  });
}

// 通过用户id获取用户信息
function selectUserID(userId, callback) {
  const sqlStr = 'SELECT * FROM users WHERE id = ?';
  const sqlParams = [userId];
  db.all(sqlStr, sqlParams, function (err, rows) {
    if (err) {
      console.log("数据查询失败..." + err.message);
      callback(err, null);
    } else {
      if (rows.length !== 0) {
        callback(null, rows);
      } else {
        const notFoundErr = new Error("No data found");
        notFoundErr.status = 404;
        callback(notFoundErr, null);
      }
    }
  });
}

// 添加用户
function addUser(username, password, email, callback) {
  const sqlStr = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
  const sqlParams = [username, password, email];
  db.run(sqlStr, sqlParams, function (err) {
    if (err) {
      console.log("数据添加失败..." + err.message);
      callback(err, null);
    } else {
      console.log("用户添加成功");
      callback(null, this.lastID);
    }
  });
}

// 修改用户数据
function changeUser(id, password, callback) {
  const sqlStr = 'UPDATE users SET password=? WHERE id = ?';
  const sqlParams = [password, id];
  db.run(sqlStr, sqlParams, function (err) {
    if (err) {
      console.log("数据更新失败..." + err.message);
      callback(err, null);
    } else {
      callback(null);
    }
  });
}

// 删除用户
function delUser(id, callback) {
  const sqlStr = 'DELETE FROM users WHERE id = ?';
  const sqlParams = [id];
  db.run(sqlStr, sqlParams, function (err) {
    if (err) {
      console.log("数据删除失败..." + err.message);
      callback(err, null);
    } else {
      callback(null);
    }
  });
}

// 修改评论数据
function changeComment(comments, id, callback) {
  const sqlStr = 'UPDATE books SET comments=? WHERE id = ?';
  const sqlParams = [comments, id];
  db.run(sqlStr, sqlParams, function (err) {
    if (err) {
      console.log("数据更新失败..." + err.message);
      callback(err, null);
    } else {
      callback(null);
    }
  });
}

// 添加书籍
function addBooks(bookTitle, author, description, comments, price, filename, type, callback) {
  const sqlStr = 'INSERT INTO books (bookTitle, author, description, comments, price, filename,type) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const sqlParams = [bookTitle, author, description, comments, price, filename, type];
  db.run(sqlStr, sqlParams, function (err) {
    if (err) {
      console.log("数据添加失败..." + err.message);
      callback(err, null);
    } else {
      console.log("书籍添加成功");
      callback(null, this.lastID);
    }
  });
}

// 获取书籍信息
function selBooks(callback) {
  const sql = 'SELECT * FROM books';
  db.all(sql, [], (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      const carouselData = rows.map(row => ({
        id: row.id,
        title: row.bookTitle,
        author: row.author,
        description: row.description,
        comments: row.comments,
        price: row.price,
        image: `/uploads/${row.filename}`,
        type: row.type,
      }));
      callback(null, carouselData);
    }
  });
}

// 通过用户id和书籍id查询销售表
function checkSaleRecord(userid, bookid, callback) {
  const query = 'SELECT * FROM sales WHERE userid = ? AND bookid = ?';
  db.get(query, [userid, bookid], (err, row) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, row);
    }
  });
}

// 获取当前用户购物车状况
function selSale(userid, callback) {
  const query = 'SELECT * FROM sales WHERE userid = ?';
  db.all(query, [userid], (err, row) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, row);
    }
  });
}

// 添加指定用户购物车
function insertSaleRecord(userid, bookid, number, callback) {
  const insertQuery = 'INSERT INTO sales (userid, bookid, number) VALUES (?, ?, ?)';
  db.run(insertQuery, [userid, bookid, number], (err) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, '插入成功');
    }
  });
}

// 删除购物车信息
function delSales(userid, callback) {
  const sqlStr = 'DELETE FROM sales WHERE userid = ?';
  const sqlParams = [userid];
  db.run(sqlStr, sqlParams, function (err) {
    if (err) {
      console.log("数据删除失败..." + err.message);
      callback(err, null);
    } else {
      callback(null);
    }
  });
}

// 修改购物车数量
function updateSaleRecord(userid, bookid, number, callback) {
  const updateQuery = 'UPDATE sales SET number = ? WHERE userid = ? AND bookid = ?';
  db.run(updateQuery, [number, userid, bookid], (err) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, '更新成功');
    }
  });
}

// 添加历史订单
function insertOrder(order, callback) {
  const sqlStr = 'INSERT INTO orderCenter (userid, bookid, title, number, totalPrice) VALUES (?, ?, ?, ?, ?)';
  const sqlParams = [order.userId, order.bookId, order.title, order.number, order.total];
  db.run(sqlStr, sqlParams, (err) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, '数据插入成功');
    }
  });
}

// 查询历史订单
function selOrder(userid, callback) {
  const query = 'SELECT * FROM orderCenter WHERE userid = ?';
  db.all(query, [userid], (err, row) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, row);
    }
  });
}

module.exports = {
  selectUser, addUser, delUser, addBooks, selBooks, selectUserID, changeUser, changeComment, checkSaleRecord, insertSaleRecord, updateSaleRecord, selSale, insertOrder, selOrder, delSales
};