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

function retrieveBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
    try {
        const newBooks = await retrieveBooks();
        res.send(JSON.stringify(newBooks, null, 4));
    } catch (error) {
        res.status(500).send({ message: "Error retrieving books" });
    }
    // res.send(JSON.stringify(await retrieveBooks(), null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
    const isbn = req.params.isbn;
    const newBooks = await retrieveBooks();
    const book = newBooks[isbn];

    if (book) {
        res.send(JSON.stringify(book, null, 4));
    } else {
        res.status(404).send({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
    const author = req.params.author;
    const newBooks = await retrieveBooks();
    let filteredBooks = Object.values(newBooks).filter(
        (book) => book.author === author
    );

    if (filteredBooks.length > 0) {
        res.send(JSON.stringify({ booksbyauthor: filteredBooks }, null, 4));
    } else {
        res.status(404).send({ message: "Book not found" });
    }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
    const title = req.params.title;
    const newBooks = await retrieveBooks();
    let filteredBooks = Object.values(books).filter(
        (book) => book.title === title
    );

    if (filteredBooks.length > 0) {
        res.send(JSON.stringify({ booksbytitle: filteredBooks }, null, 4));
    } else {
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
