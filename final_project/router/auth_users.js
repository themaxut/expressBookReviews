const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
};

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return user.username === username && user.password === password;
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(
            {
                data: password,
            },
            "access",
            { expiresIn: 60 }
        );

        req.session.authorization = {
            accessToken,
            username,
        };
        return res.status(200).send("User successfully logged in");
    } else {
        return res
            .status(208)
            .json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;

    // Check if the book exists
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user is logged in
    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }

    // Add or update the review
    book.reviews[username] = review;

    return res
        .status(200)
        .json({ message: "Review successfully added/updated" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    // Check if the book exists
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user is logged in
    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }

    // Check if the user has a review for the book
    if (!book.reviews[username]) {
        return res.status(404).json({ message: "Review not found" });
    }

    // Delete the review
    delete book.reviews[username];

    return res.status(200).json({ message: "Review successfully deleted" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
