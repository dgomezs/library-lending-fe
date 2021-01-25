import * as React from 'react'
import {useState} from 'react'


const BorrowedBooksByMemberContext = React.createContext<BorrowedBooksByMemberContext>({
    borrowedBooksByMember: [],
    setBorrowedBooksByMember: null
})
BorrowedBooksByMemberContext.displayName = 'BorrowBooksByMember'

interface BorrowedBooksByMemberContext {
    borrowedBooksByMember: string[],
    setBorrowedBooksByMember: any
}


const BorrowBooksByMember = ({
                                 children,
                                 initialBorrowedBooks = []
                             }: { children: React.ReactNode, initialBorrowedBooks?: string[] }) => {

    const [borrowedBooksByMember, setBorrowedBooksByMember] = useState(initialBorrowedBooks)

    return (
        <BorrowedBooksByMemberContext.Provider value={{borrowedBooksByMember, setBorrowedBooksByMember}}>
            {children}
        </BorrowedBooksByMemberContext.Provider>
    )
}


export {BorrowedBooksByMemberContext, BorrowBooksByMember}