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

exports.replyToPost = (req, res) => {
    //postId, user_id, user_name,content,pp
    const postId = req.params.postId;
    const name = req.body.name;
    const content = req.body.content;
    const user_id = req.body.user_id;
    const id = crypto.randomUUID();
    const dateTime = new Date().toISOString();

    sql = `INSERT INTO replies(id, postId, name, content, user_id, dateTime) VALUES (?,?,?,?,?,?)`;
    postsDB.run(sql, [id, postId, name, content, user_id, dateTime], (err) => {
        if (err){
            return res.status(500).json({
                error: err.message
            })
        }
        res.status(200).json({
            message: "Replied to a comment",
            reply_id: id
        })
    });



}

exports.getAllRepliesOfaPost = (req, res) => {

    const postId = req.params.postId;
    let offset = req.query.offset || 0;
    const limit = 5;

    let secondQuery = `SELECT content FROM posts WHERE id = '${postId}'`;
    let post ;
    postsDB.all(secondQuery,[], (err, row) => {
        if (err){
            return res.status(500).json({
                error: err.message
            })
        }
        post = row[0].content;
    })
    //ORDERBY replies.postId OFFSET '${offset}' ROWS FETCH NEXT 10 ROWS ONLY
    // sql = `SELECT posts.content as post, replies.name, replies.content, replies.dateTime from replies inner join posts on replies.postId = posts.id where replies.postId = '${postId}' LIMIT '${limit}' OFFSET '${offset}'`;
    sql = `SELECT replies.name, replies.content, replies.dateTime from replies inner join posts on replies.postId = posts.id where replies.postId = '${postId}' LIMIT '${limit}' OFFSET '${offset}'`;
    offset = +offset + limit;
    postsDB.all(sql, [], (err, rows) => {
        if (err){
            return res.status(500).json({
                error: err.message
            })
        }
        res.status(200).json({
            post: post,
            // post: rows[0].post,
            postId: postId,
            offset: parseInt(offset),
            comments: rows
        });

    });
}