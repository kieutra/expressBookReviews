const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return (users.find(user => user.username === username));
}
const authenticatedUser = (username, password) => { //returns boolean
  let validUser = users.find(user => {
    user.username === username && user.password === password
  });
  return validUser;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    res.status(404).json({ message: "Error logging in" });
    return;
  }
  if (authenticatedUser) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };
    return res.status(200).send("Login successfully!");
  } else return res.status(208).json({ message: "Invalid login. Please check username and password" });


});


regd_users.delete("/auth/review/:title", (req, res) => {
  //Write your code here
  const title = req.params.title;
  const username = req.session.authorization.username;
  const existingBook = Object.values(books).find(b => b.title === title);
  if (!existingBook)
    return res.status(404).send("No book found");

  const existingReview = Object.values(books).find(book => username in book.reviews);
  if (existingReview) {
    delete existingReview.reviews[username];
    return res.status(200).send(`The review of ${username} is deleted.`);
  } else {
    return res.status(208).json(`No review is found with the ${username}.`)
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
