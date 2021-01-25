import {BorrowedBooksByMemberList} from "src/components/molecules/borrow-books-by-member-list/BorrowedBooksByMemberList";
import {useBorrowedBooksByMember} from "src/hooks/borrowed-books-by-member/UseBorrowedBooksByMember";
import {useEffect, useState} from "react";
import {useBorrowBook} from "src/hooks/borrow-book/UseBorrowBook";

export function BorrowBookDashboard({memberId}: { memberId: string }) {

    const {borrowedBooksByMember, getBorrowedBooksByMember, isPending: isPendingBooks} = useBorrowedBooksByMember();
    const [bookId, setBookId] = useState("");
    const {borrowBook, isPending, borrowedBookCopyId} = useBorrowBook();

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        borrowBook(memberId, bookId);
    };
    useEffect(() => {
        if (memberId && borrowedBookCopyId) {
            getBorrowedBooksByMember(memberId)
        }
    }, [borrowedBookCopyId, memberId])

    return (<div>
        {(isPending || isPendingBooks) && <div data-testid="loading">Loading</div>}
        <BorrowedBooksByMemberList borrowedBooksByMember={borrowedBooksByMember}/>
        <label>
            Book to borrow
            <input
                type="text"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
            />
        </label>
        <button onClick={handleSubmit}>Borrow book</button>
    </div>)
}