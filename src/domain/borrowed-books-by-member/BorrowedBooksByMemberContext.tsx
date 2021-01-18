import * as React from 'react'
import {useReducer} from 'react'
import {BorrowedBooksByMemberState, UseBorrowedBooksByMember} from './UseBorrowedBooksByMember';


const BorrowedBooksByMemberContext = React.createContext<UseBorrowedBooksByMember>({
    addBook: () => {
    },
    setBooks: () => {
    },
    state: {borrowedBooksByMember: []}
})
BorrowedBooksByMemberContext.displayName = 'BorrowBooksByMember'


const ADD_BOOK = "ADD_BOOK";
const SET_BOOKS = "SET_BOOKS";


interface AddBorrowBookToMember {
    type: typeof ADD_BOOK,
    bookId: string
}

interface SetBorrowBooksToMember {
    type: typeof SET_BOOKS,
    books: string[]
}

type BorrowBooksByMemberActions = AddBorrowBookToMember | SetBorrowBooksToMember


function borrowBooksByMemberReducer(currentState: BorrowedBooksByMemberState, action: BorrowBooksByMemberActions): BorrowedBooksByMemberState {
    switch (action.type) {
        case ADD_BOOK:
            const {borrowedBooksByMember} = currentState
            const newList = [...borrowedBooksByMember, action.bookId]
            return {borrowedBooksByMember: newList};
        case SET_BOOKS:
            return {borrowedBooksByMember: action.books};
        default:
            throw new Error();
    }
}


const BorrowBooksByMember = ({children, initialBorrowedBooks = []}: { children: React.ReactNode, initialBorrowedBooks?: string[] }) => {

    const [state, dispatch] = useReducer(borrowBooksByMemberReducer, {borrowedBooksByMember: initialBorrowedBooks})
    const addBook = (bookId: string) => dispatch({type: ADD_BOOK, bookId});
    const setBooks = (books: string[]) => dispatch({type: SET_BOOKS, books});


    return (
        <BorrowedBooksByMemberContext.Provider value={{state, addBook, setBooks}}>
            {children}
        </BorrowedBooksByMemberContext.Provider>
    )
}


export {BorrowedBooksByMemberContext, BorrowBooksByMember}