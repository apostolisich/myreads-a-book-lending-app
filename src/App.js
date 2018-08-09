import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import { Link } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Book from './Book.js'

class BooksApp extends React.Component {
    state = {
        query: '',
        books: [],
        queriedBooks: []
    }

    searchBooks = (query) => {
        this.setState({ query })
        let qBooks = []
        if(query) {
            BooksAPI.search(query).then((queriedBooks) => {
                if(queriedBooks.length > 0) {
                    for(let index = 0; index < this.state.books.length; index++) {
                        let queriedBookIndex = queriedBooks.findIndex(book => book.id === this.state.books[index].id)
                        if(queriedBookIndex !== -1)
                            queriedBooks[queriedBookIndex].shelf = this.state.books[index].shelf
                    }
                    qBooks = queriedBooks
                }
                this.setState({ queriedBooks: qBooks })
            })
        } else {
            this.setState({ queriedBooks: qBooks })
            console.log("Books: " + qBooks)
        }
    }

    componentDidMount() {
        BooksAPI.getAll().then((books) => (
            this.setState({ books })
        ))
    }

    updateShelf(book, status) {
        book.shelf = status
        this.setState(state => ({
            books: state.books.filter(currBook => currBook.id  !== book.id).concat([ book ]),
        }))
    }
  
    render() {
        return (
            <div className="app">
                <Route path="/search" render={() => (
                    <div className="search-books">
                        <div className="search-books-bar">
                            <Link className="close-search" to="/">Close</Link>
                            <div className="search-books-input-wrapper">
                                <input type="text" placeholder="Search by title or author" value={this.state.query} onChange={(event) => this.searchBooks(event.target.value)}/>
                            </div>
                        </div>
                        <div className="search-books-results">
                            <ol className="books-grid"><Book onUpdateShelf={(book, status) => this.updateShelf(book, status)} books={this.state.queriedBooks}/></ol>
                        </div>
                    </div>
                )}/>
                <Route exact path="/" refresh render={() => (
                    <div className="list-books">
                        <div className="list-books-title">
                            <h1>MyReads</h1>
                        </div>
                        <div className="list-books-content">
                            <div>
                                <div className="bookshelf">
                                    <h2 className="bookshelf-title">Currently Reading</h2>
                                    <div className="bookshelf-books">
                                        <Book onUpdateShelf={(book, status) => this.updateShelf(book, status)} books={this.state.books.filter(book => book.shelf === "currentlyReading")} />
                                    </div>
                                </div>
                                <div className="bookshelf">
                                    <h2 className="bookshelf-title">Want to Read</h2>
                                    <div className="bookshelf-books">
                                        <ol className="books-grid">
                                            <Book onUpdateShelf={(book, status) => this.updateShelf(book, status)} books={this.state.books.filter(book => book.shelf === "wantToRead")} />
                                        </ol>
                                    </div>
                                </div>
                                <div className="bookshelf">
                                    <h2 className="bookshelf-title">Read</h2>
                                    <div className="bookshelf-books">
                                        <ol className="books-grid">
                                            <Book onUpdateShelf={(book, status) => this.updateShelf(book, status)} books={this.state.books.filter(book => book.shelf === "read")} />
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="open-search">
                            <Link to="/search">Add a book</Link>
                        </div>
                    </div>
                )}/>
            </div>
        )
    }
}

export default BooksApp