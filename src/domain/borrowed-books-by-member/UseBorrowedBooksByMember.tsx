
import { useContext } from 'react'
import{BorrowedBooksByMemberContext} from './BorrowedBooksByMemberContext'


interface AddBook {
    (bookId: string): void
}

interface SetBooks {
    (books: string[]): void
}

export interface UseBorrowedBooksByMember {
    addBook: AddBook,
    setBooks: SetBooks,
    state: BorrowedBooksByMemberState
}

export interface BorrowedBooksByMemberState {
    borrowedBooksByMember: string[]
}

export function useBorrowedBooksByMember() : UseBorrowedBooksByMember {
    const context : UseBorrowedBooksByMember = useContext<UseBorrowedBooksByMember>(BorrowedBooksByMemberContext)
    if (context === undefined) {
      throw new Error('useBorrowedBooksByMember must be used within a <BorrowBooksByMember />')
    }
    return context
  }