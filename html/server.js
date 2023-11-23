const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { selectUser, addUser, delUser, addBooks, selBooks, selectUserID, changeUser, changeComment, checkSaleRecord, insertSaleRecord, updateSaleRecord, selSale, insertOrder, selOrder, delSales } = require('./sqlite_db');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// 登录
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    selectUser(username, password, (err, rows) => {
        if (err) {
            if (err.status === 404) {
                res.status(404).send('No data found');
            } else {
                res.status(500).send('Internal Server Error');
            }
        } else {
            res.status(200).json(rows);
        }
    });
});

// 注册
app.post('/register', (req, res) => {
    const { username, password, email } = req.body
    addUser(username, password, email, (err, result) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send('User registered successfully');
        }
    });
});

// 修改密码
app.post('/change/password', (req, res) => {
    const { id, password } = req.body;
    changeUser(id, password, (err) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send('ok');
        }
    });
});

// 注销
app.post('/breakuser', (req, res) => {
    const { id } = req.body;
    delUser(id, (err) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send('ok');
        }
    });
});

// 获取用户信息
app.get('/userInfo', (req, res) => {
    const { userId } = req.query;
    selectUserID(userId, (err, rows) => {
        if (err) {
            if (err.status === 404) {
                res.status(404).send('No data found');
            } else {
                res.status(500).send('Internal Server Error');
            }
        } else {
            res.status(200).json(rows);
        }
    });
});

// 添加书籍
app.post('/upload/book', upload.single('bookFile'), (req, res) => {
    const { bookTitle, author, description, comments, price, type } = req.body;
    const filename = req.file.originalname;
    addBooks(bookTitle, author, description, comments, price, filename, type, (err, lastID) => {
        if (err) {
            res.status(500).json({ error: '数据添加失败' });
        } else {
            res.status(200).json({ filename, bookTitle, author, lastID });
        }
    });
});

// 获取书籍信息
app.get('/api/carousel-data', (req, res) => {
    selBooks((err, data) => {
        if (err) {
            res.status(500).json({ error: '数据库查询错误' });
        } else {
            res.json(data);
        }
    });
});

// 修改book表中的评论信息
app.post('/add/comment', (req, res) => {
    const { comments, id } = req.body
    changeComment(comments, id, (err, result) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).send('User registered successfully');
        }
    });
});

// 获取当前用户下该书籍购物车数量，如果数据库没有则创建该信息否则进行修改
app.post('/book/sale', (req, res) => {
    const { userid, bookid, number } = req.body;
    checkSaleRecord(userid, bookid, (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: '查询数据库失败' });
        } else {
            if (row) {
                updateSaleRecord(userid, bookid, number, (err, message) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({ error: '更新数据库失败' });
                    } else {
                        res.status(200).json({ message });
                    }
                });
            } else {
                insertSaleRecord(userid, bookid, number, (err, message) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({ error: '插入数据库失败' });
                    } else {
                        res.status(200).json({ message });
                    }
                });
            }
        }
    });
});

// 获取当前用户下该书籍购物车数量
app.post('/book/salenum', (req, res) => {
    const { userid, bookid } = req.body;
    checkSaleRecord(userid, bookid, (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: '查询数据库失败' });
        } else {
            res.status(200).json({ row });
        }
    });
});

// 获取当前用户购物车状况
app.post('/sales', (req, res) => {
    const { userId } = req.body;
    selSale(userId, (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: '查询数据库失败' });
        } else {
            res.status(200).json({ row });
        }
    });
});

// 清空购物车
app.post('/clear/order', (req, res) => {
    const { userId } = req.body;
    delSales(userId, (err, row) => {
        if (err) {
            res.status(500).json({ error: '查询数据库失败' });
        } else {
            res.status(200).json({ row });
        }
    })
});

// 像历史订单中插入数据
app.post('/order/center', (req, res) => {
    const order = req.body;
    insertOrder(order, (err, result) => {
        if (err) {
            res.status(500).json({ error: '数据插入失败' });
        } else {
            res.status(200).json({ message: '数据插入成功' });
        }
    })
});

// 像历史订单中查询数据
app.post('/get/order', (req, res) => {
    const { userId } = req.body;
    selOrder(userId, (err, row) => {
        if (err) {
            res.status(500).json({ error: '查询数据库失败' });
        } else {
            res.status(200).json({ row });
        }
    })
});

app.listen(3000);
console.log('服务器已启动,正在监听3000端口...')