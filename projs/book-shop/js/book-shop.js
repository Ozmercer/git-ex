'use strict';

console.log('Books Shop');

var gBooks = [];
var gId = 0;
var gDeletedItems = 0;

function getBook(name, price, desc) {

    var newBook = {
        id: ++gId,
        name: name,
        price: (+price).toFixed(2),
        description: desc,
        rating: 0,
        voters: 0
    };
    gBooks.push(newBook);
}

getBook('Harry Potter', 99.90, HarryPotterDesc);
getBook('Lord of the Rings - Part I', 89.90, LOTR1Desc);
getBook('Sapiens', 115.50, sapiensDesc);
getBook('Alice in Wonderland', 100);

function renderBooks() {
    var strHtml = `
    <thead>
    <td onclick="sortById()">id ▼</td>
    <td onclick="sortByTitle()">title ▼</td>
    <td onclick="sortByPrice()">price ▼</td>
    <td colspan="3">actions</td>
    </thead>
    <tbody>`;

    gBooks.forEach((book) => {
        strHtml += `
        <tr id="book${book.id}">
        <td>${book.id}</td><td>${book.name}</td><td class="price${book.id}">${book.price}₪</td>
        <td><button type="button" class="btn btn-transp" data-toggle="modal" data-target="#exampleModal"
        onclick="readBook(${book.id})">Read</button></td>
        <td><button type="button" class="btn btn-transp" onclick="updateBook(${book.id})">Update</button></td>
        <td><button type="button" class="btn btn-transp" onclick="deleteBook(this,${book.id})">Delete</button></td>
        </tr>
        `
    })
    strHtml += '</tbody>'
    $('.book-tbl').html(strHtml);
}

function renderModal(idx) {
    var currBook = gBooks.find((book) => {
        return book.id === idx;
    })
    $('.modal-title').text(currBook.name);
    $('.modal-body').text(currBook.description);
    $('.book-img').attr('src', `img/${currBook.id}.jpg`);
    $('.book-score').text(currBook.rating)
    var strHtml = `
    <span onclick="rateBook(5,${currBook.id})">☆</span><span onclick="rateBook(4,${currBook.id})">☆</span>
    <span onclick="rateBook(3,${currBook.id})">☆</span><span onclick="rateBook(2,${currBook.id})">☆</span>
    <span onclick="rateBook(1,${currBook.id})">☆</span>
    `;
    $('.rating').html(strHtml)
}

function deleteBook(el,idx) {
    $(el).closest('tr').remove();
    gBooks.sort(compareId);
    gBooks.splice(idx - 1 - gDeletedItems,1)
    gDeletedItems++;
}

function updateBook(idx) {
    var newPrice = prompt('Enter new price:')
    $('.price' + idx).text('₪' + (+newPrice).toFixed(2));
}

function readBook(idx) {
    renderModal(idx);
}

function readAndAddNewBook() {
    var bookName = prompt('Enter name of new book:');
    if (!bookName) return;
    var bookPrice = +prompt('Enter price of new book:');
    if (!bookPrice) bookPrice = 0;

    getBook(bookName, bookPrice, 'No available description');
    renderBooks();
}

function rateBook(score, bookId) {
    gBooks[bookId - 1 - gDeletedItems].rating = score;
    $('.book-score').text(score)
    // console.log(gBooks[bookId - 1 - gDeletedItems].rating);
    // console.log(gBooks[bookId - 1 - gDeletedItems].voters);
    
    // $('.save-btn').click(() => {
    //     gBooks[bookId - 1].rating += rating;
    //     gBooks[bookId - 1].voters++;
        
    // })
}

function sortById() {
    gBooks.sort(compareId);
    renderBooks()
}
function compareId(a,b) {
    return a.id-b.id;
}
function sortByTitle() {
    gBooks.sort(compareTitle);
    renderBooks()
}
function compareTitle(a,b) {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    else return 0;
}
function sortByPrice() {
    gBooks.sort(comparePrice);
    renderBooks()
}
function comparePrice(a,b) {
    return a.price-b.price;
}