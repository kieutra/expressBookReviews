const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username) {
    res.status(400).send("Please give the username");
    return;
  }

  if (!password) {
    res.status(400).send("Please give password");
    return;
  }

  if (users.find(user => user.username === username)) {
    res.send("Username already exists");
    return;
  }
  users.push({ "username": username, "password": password });
  return res.status(200).send("Account registered successfully")

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.send(JSON.stringify({ books }, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const existingBook = Object.values(books).find(b => b.isbn === isbn);
  if (existingBook)
    return res.send(JSON.stringify({ existingBook }, null, 4));
  else
    return res.status(404).send("No book found");
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  const existingBooks = Object.values(books).filter(b => b.author.toLowerCase().includes(author));
  if (existingBooks.length > 0)
    return res.send(JSON.stringify({ existingBooks }, null, 4));
  else
    return res.status(404).send("No book found");
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const existingBooks = Object.values(books).filter(b => b.title === title);
  if (existingBooks.length > 0)
    return res.send(existingBooks);
  else
    return res.status(404).send("No book found");
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const existingBook = Object.values(books).find(b => b.isbn === isbn);
  if (existingBook)
    return res.send(JSON.stringify({ existingBook }, null, 4));
  else
    return res.status(404).send("No ISBN in books");
});

//  Post book review
public_users.post('/review/:title', function (req, res) {
  const title = req.params.title;
  const username = req.body.username;
  const review = req.body.review;

  const existingBook = Object.values(books).find(b => b.title === title);
  if (!existingBook)
    return res.status(404).send("No book found");
  if (isValid(username)) {
    const existingReview = Object.values(books).find(book => username in book.reviews);
    if (existingReview) {
      //Object.entries(books.reviews)[username] = review;
      existingReview.reviews[username] = review;
      return res.status(200).send({ existingReview });
    }
    else {
      existingBook.reviews = { ...existingBook.reviews, [username]: review };
      return res.status(200).send(`Review from ${username} is added`);
    }
  }
  else
    return res.status(404).send("please register username first");
});
public_users.delete('/review/del/:title', function (req, res) {
  const title = req.params.title;
  const username = session.username;

})
module.exports.general = public_users;
