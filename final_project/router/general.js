const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ username: username, password: password });
            return res.status(200).json({
                message: "User successfully registred. You can now login.",
            });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

//helper function to simulate asyn
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
    await delay(500);
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        await delay(500);
        res.send(JSON.stringify(book, null, 4));
    } else {
        await delay(1000);
        res.status(404).send({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
    const author = req.params.author;
    let filteredBooks = Object.values(books).filter(
        (book) => book.author === author
    );

    if (filteredBooks.length > 0) {
        await delay(500);
        res.send(JSON.stringify(filteredBooks, null, 4));
    } else {
        await delay(1000);
        res.status(404).send({ message: "Book not found" });
    }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
    const title = req.params.title;
    let filteredBooks = Object.values(books).filter(
        (book) => book.title === title
    );

    if (filteredBooks.length > 0) {
        await delay(500);
        res.send(JSON.stringify(filteredBooks, null, 4));
    } else {
        await delay(1000);
        res.status(404).send({ message: "Book not found" });
    }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        res.send(book.reviews);
    } else {
        res.status(404).send({ message: "Book not found" });
    }
});

module.exports.general = public_users;
