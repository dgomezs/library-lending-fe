import * as React from "react";
import {useState} from "react";
import {BorrowedBooksByMemberContext} from "src/hooks/borrowed-books-by-member/BorrowedBooksByMemberContext";

export const BorrowBooksByMember = ({
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
