const mariadb = require('mysql/promise');
const {StatusCodes} = require('http-status-codes');
const { deleteCartItem } = require('./cartController');

const order = async (req, res) => {
        const conn = await mariadb.createConnection({
            host : 'localhost',
            user : 'root',
            password : 'root',
            database : 'Bookshop',
            dateStrings : true
        });

    const {items, delivery, totalQuantity, totalPrice, userId, firstBookTitle} = req.body;

    let sql = 'INSERT INTO delivery (adress, receiver, contact) VALUES (?, ?, ?)';
    let values = [delivery.address, delivery.receiver, delivery.contact];
    let [results] = await conn.execute(sql, values);
    delivery_id = results.insertId;

    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
            VALUES (?, ?, ?, ?, ?)`;
    values = [firstBookTitle, totalQuantity, totalPrice, userId, deliver_id];
    [results] = await conn.execute(sql, values)
    let order_id = results.insertId;

    sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;

    values = [];
    items.forEach((item => {
        values.push(order_id, item.book_id, item.quantity)
    }))

    [results] = await conn.query(sql, [values]);

    let result = await deleteCartItems(conn);

    return res.status(StatusCodes.OK).json(results);
};

const deleteCartItems = async (conn) => {
    let sql = `DELETE FROM cartItems WHERE id IN (?)`
    let values = [1, 2, 3];

    let result = await conn.query(sql, [values]);
    return result;
};

const getOrders = async (req, res) => {
    const conn = await mariadb.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'root',
        database : 'Bookshop',
        dateStrings : true
    });

    let sql = `SELECT orders.id, created_at, address, receiver, conatct
                book_title, total_quantity, total_price,           
                FROM orders LEFT JOIN delivery
                ON orders.delivery_id = delivery.id;`
    let [rows, fields] = await conn.query(sql);
    return res.status(StatusCodes.OK).json(rows);
};

const getOrderDetail = async (req, res) => {
    const {id} = req.params;

    const conn = await mariadb.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'root',
        database : 'Bookshop',
        dateStrings : true
    });

    let sql = `SELECT book_id, title, author, price
                FROM orderedBook LEFT JOIN books
                ON orderedBook.book_id = books.id
                WHERE order=id?`;
    let [rows, fields] = await conn.query(sql, [id]);
    return res.status(StatusCodes.OK).json(rows);
};

module.exports = {
    order,
    getOrders,
    getOrderDetail
};