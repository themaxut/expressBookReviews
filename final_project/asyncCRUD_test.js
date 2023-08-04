const axios = require("axios");

// Retrieve all books
async function getAllBooks() {
    try {
        const response = await axios.get("http://localhost:5000/");
        console.log("################################");
        console.log("# Retrieved all books #");
        console.log(response.data);
        console.log("################################");
        console.log("################################");
        console.log("################################");
    } catch (error) {
        console.error(error);
    }
}

getAllBooks();

// Search for a book by ISBN
function getBookByISBN(isbn) {
    axios
        .get(`http://localhost:5000/isbn/${isbn}`)
        .then((response) => {
            console.log("# Retrieved Book 1 #");
            console.log(response.data);
            console.log("################################");
            console.log("################################");
            console.log("################################");
        })
        .catch((error) => {
            console.error(error);
        });
}

getBookByISBN("1");

//Search for a book by author
function getBooksByAuthor(author) {
    axios
        .get(`http://localhost:5000/author/${author}`)
        .then((response) => {
            console.log("# Retrieve books with 'Unknown author' #");
            console.log(response.data);
            console.log("################################");
            console.log("################################");
            console.log("################################");
        })
        .catch((error) => {
            console.error(error);
        });
}

getBooksByAuthor("Unknown");

// Search for a book by title
function getBooksByTitle(title) {
    axios
        .get(`http://localhost:5000/title/${encodeURIComponent(title)}`)
        .then((response) => {
            console.log("# Retrieved Things Fall Apart #");
            console.log(response.data);
            console.log("################################");
        })
        .catch((error) => {
            console.error(error);
        });
}

getBooksByTitle("Things Fall Apart");
