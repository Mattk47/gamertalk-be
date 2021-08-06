const db = require("../connection.js");
const format = require("pg-format");
const { formatCategoryData, formatUserData, formatReviewData, createReviewRef, formatCommentData } = require('../utils/data-manipulation');

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;

  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS reviews`)
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`)
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS categories`)
    })
    .then(() => {
      return db.query(`CREATE TABLE categories(
        slug VARCHAR(200) PRIMARY KEY UNIQUE,
        description VARCHAR(2000)
      );`)
    })
    .then(() => {
      return db.query(`CREATE TABLE users(
        username VARCHAR(200) PRIMARY KEY,
        avatar_url VARCHAR(2000),
        name VARCHAR(100) NOT NULL
      );`)
    })
    .then(() => {
      return db.query(`CREATE TABLE reviews(
      review_id SERIAL PRIMARY KEY,
      title VARCHAR(250) NOT NULL,
      review_body VARCHAR(10000) NOT NULL,
      designer VARCHAR(200),
      review_img_url VARCHAR(2000) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      votes INT DEFAULT 0,
      category VARCHAR(200) REFERENCES categories(slug),
      owner VARCHAR(200) REFERENCES users(username),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`)
    })
    .then(() => {
      return db.query(`CREATE TABLE comments(
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR(200) REFERENCES users(username),
      review_id INT REFERENCES reviews(review_id),
      votes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      body VARCHAR(10000)
    );`)
    })
    .then(() => {
      const formattedData = formatCategoryData(categoryData);
      const categoryInsertStr = format(
        `INSERT INTO categories
    (slug, description)
    VALUES %L RETURNING*
    `, formattedData
      )
      return db.query(categoryInsertStr);
    })
    .then(() => {
      const formattedData = formatUserData(userData);
      const userInsertStr = format(
        `INSERT INTO users
        (username, name, avatar_url)
        VALUES %L RETURNING*
        `, formattedData
      )
      return db.query(userInsertStr);
    })
    .then(() => {
      const formattedData = formatReviewData(reviewData);
      const reviewInsertStr = format(
        `INSERT INTO reviews
        (title, review_body, designer, review_img_url, votes, category, owner, created_at)
        VALUES %L RETURNING*
        `, formattedData
      )
      return db.query(reviewInsertStr);
    })
    .then((reviewInsertResults) => {
      const reviewRows = reviewInsertResults.rows;
      const reviewRef = createReviewRef(reviewRows);
      const formattedData = formatCommentData(commentData, reviewRef);
      const reviewInsertStr = format(
        `INSERT INTO comments
      (author, review_id, votes, created_at, body)
      VALUES %L RETURNING*
      `, formattedData
      )
      return db.query(reviewInsertStr);
    })
};


module.exports = seed;
