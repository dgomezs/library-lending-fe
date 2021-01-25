import * as React from 'react'


interface BorrowedBooksByMemberContext {
    borrowedBooksByMember: string[],
    setBorrowedBooksByMember: any
}

const BorrowedBooksByMemberContext = React.createContext<BorrowedBooksByMemberContext>({
    borrowedBooksByMember: [],
    setBorrowedBooksByMember: null
})

BorrowedBooksByMemberContext.displayName = 'BorrowBooksByMember'


export {BorrowedBooksByMemberContext}