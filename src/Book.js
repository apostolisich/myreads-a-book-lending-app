import React from 'react'
import * as BooksAPI from './BooksAPI.js'

class Book extends React.Component {
    updateShelf(book, status) {
        console.log(book.id, status)
        BooksAPI.update(book, status).then(res => {
            this.props.onUpdateShelf(book, status)
        })
    }

    showAuthors(authors) {
    if(authors !== undefined) {
        let authorsStr = ''
        for(let i = 0; i < authors.length - 1; i++) 
            authorsStr += authors[i] + ', '

        return authorsStr += authors[authors.length - 1]
    }
    }

    render() {
        return (
            <ol className="books-grid">
                {this.props.books.map((book) => (
                    <li key={book.id}>
                    <div className="book">
                        <div className="book-top">
                            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks ? book.imageLinks.thumbnail : ''})` }}></div>
                                <div className="book-shelf-changer">
                                    <select value={book.shelf !== undefined ? book.shelf : 'none'} onChange={(event) => this.updateShelf(book, event.target.value)}>
                                        <option value="move" disabled>Move to...</option>
                                        <option value="currentlyReading">Currently Reading</option>
                                        <option value="wantToRead">Want to Read</option>
                                        <option value="read">Read</option>
                                        <option value="none">None</option> 
                                    </select>
                                </div>
                            </div>
                            <div className="book-title">{book.title}</div>
                            <div className="book-authors">{ this.showAuthors(book.authors) }</div>
                    </div>
                    </li>
                ))}
            </ol>
        )
    }
}

export default Book