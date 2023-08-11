const crypto = require('crypto');
const { postsDB } = require('../database');
const {validationResult } = require('express-validator');
let sql;

exports.validateReq = (req,res,next) =>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    }
    next();
}

exports.createPost = async (req, res) => {
    const name = req.body.name;
    const content = req.body.content;
    const user_id = req.body.user_id;
    const id = crypto.randomUUID();
    const dateTime = new Date().toISOString();

    sql = `INSERT INTO posts(id, name, content, user_id, dateTime) VALUES (?,?,?,?,?)`;
    postsDB.run(sql, [id, name, content, user_id, dateTime], (err) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            })
        }
        res.status(200).json({
            message: "Post successfully created.",
            post_id: id
        });
    });
}


exports.getAllPosts = (req, res) => {
    let offset = req.query.offset || 0;
    const limit = 5;
    sql = `SELECT * FROM posts LIMIT '${limit}' OFFSET '${offset}'`;
    offset = +offset + limit;
    postsDB.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            })
        }

        res.status(200).json({
            offset: parseInt(offset),
            posts: rows
        });
    });
}

exports.getPoststById = (req, res) => {
    const postId = req.params.postId;

    sql = `SELECT * FROM posts WHERE id = '${postId}'`;
    postsDB.all(sql, [], (err, row) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            })
        }

        res.status(200).json({
            data: row[0]
        });

    });
}