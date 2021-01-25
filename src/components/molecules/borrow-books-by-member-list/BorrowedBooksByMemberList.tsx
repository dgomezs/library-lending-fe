export function BorrowedBooksByMemberList({borrowedBooksByMember}: { borrowedBooksByMember: string[] }) {
    const books = borrowedBooksByMember.map(b => <li key={b}>Borrowed book {b}</li>)
    if (books && books.length > 0) {
        return (<div><span>Your borrow books</span>
            <ul>{books}</ul>
        </div>)
    }
    return null
}