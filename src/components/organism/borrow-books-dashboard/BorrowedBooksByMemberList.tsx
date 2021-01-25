export function BorrowedBooksByMemberList({borrowedBooksByMember}: { borrowedBooksByMember: string[] }) {
    const books = borrowedBooksByMember.map(b => <span>Borrowed book {b}</span>)
    return (<div>{books}</div>)
}