const db = require("./")
const format = require("pg-format")





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
        slug_id VARCHAR(100) PRIMARY KEY UNIQUE,
        description TEXT
      );`)
    })
    .then(() => {
      return db.query(`CREATE TABLE users(
        username_id SERIAL PRIMARY KEY,
        avatar_url TEXT,
        name VARCHAR(50) NOT NULL
      );`)
    })
    .then(() => {
      return db.query(`CREATE TABLE reviews(
        review_id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        review_body TEXT NOT NULL,
        designer VARCHAR(100),
        review_image_url TEXT DEFAULT https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg NOT NULL,
        votes INT DEFAULT 0,
        category TEXT REFERENCES categories(slug_id),
        owner INT REFERENCES users(username_id),
        created_at DATE DEFAULT CURRENT_TIMESTAMP
      );`)
    })
    .then(() => {
      return db.query(`CREATE TABLE comments(
        comment_id SERIAL PRIMARY KEY,
        author_id INT REFERENCES user(username_id),
        review_id INT REFERENCES reviews(review_id),
        votes INT DEFAULT 0,
        created_at DATE DEFAULT CURRENT_TIMESTAMP,
        body TEXT NOT NULL
      );`)
    })
    
  // 1. create tables

  // 2. insert data
};


module.exports = seed;
