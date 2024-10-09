const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const allBooks = (req, res) => {
   let sql = 'SELECT * FROM books';
   conn.query (sql,
    (err, results) => {
    if(err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
        return res.status(StatusCodes.OK).json(results);
    })
};

const bookDetail = (req, res) => {
    let {user_id} = req.body;
    let book_id = req.params.id;

    let sql =`SELECT *,
                    (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes,
                    (SELECT EXISTS (SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked,
                    FROM books
                    LEFT JOIN category
                    ON books.category_id = category.category_id
                    WHERE books.id=?`; 
    conn.query (sql, id,
    (err, results) => {
        if(err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        if (results[0]) {
            res.status(StatusCodes.OK).json(results);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    })
};

const booksByCategory = (req, res) => {
    let sql = 'SELECT * FROM books WHERE category_id=?'
    conn.query (sql, id,
        (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            if (results[0]) {
                res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
        })
    };

module.exports = {
    allBooks,
    bookDetail,
    booksByCategory
};