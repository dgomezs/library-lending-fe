import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {setupServer} from "msw/node";
import {
    BOOK_WITH_AVAILABLE_COPIES,
    EXPECTED_BOOK_COPY_ID,
    REGISTERED_MEMBER_WITH_LESS_THAN_THRESHOLD_BORROWED_BOOKS,
    validBorrowBookApiResponse
} from 'src/hooks/borrow-book/api-mock-borrow-book-responses';
import {borrowedBooksByMemberApiResponse} from "src/hooks/borrowed-books-by-member/api-mock-borrowed-books-member-responses";
import {BorrowBookDashboard} from './BorrowBookDashboard'
import initializeStore from "src/store/store";
import {Provider} from "react-redux";

const server = setupServer();
beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());


test("should borrow a book", async () => {

    // arrange
    const initialBorrowedBooks: string[] = [];
    const expectedBorrowedBooks = [EXPECTED_BOOK_COPY_ID]
    const memberId = REGISTERED_MEMBER_WITH_LESS_THAN_THRESHOLD_BORROWED_BOOKS;
    const bookIsbn = BOOK_WITH_AVAILABLE_COPIES;
    renderDashboard(initialBorrowedBooks, memberId);

    server.use(validBorrowBookApiResponse(EXPECTED_BOOK_COPY_ID),
        borrowedBooksByMemberApiResponse(memberId, expectedBorrowedBooks));

    borrowBook(memberId, bookIsbn);

    // assert
    await VerifyBorrowedBooks(expectedBorrowedBooks)

});

function renderDashboard(initialBorrowedBooks: string[], memberId: string) {
    const store = initializeStore({borrowedBooksByMember: {borrowedBooksByMember: initialBorrowedBooks}});

    const wrapper = ({children}: { children: any }) =>
        <Provider store={store}>{children}</Provider>
    render(<BorrowBookDashboard memberId={memberId}/>, {wrapper});
}


function borrowBook(memberId: string, bookIsbn: string) {
    const submitButton = screen.getByText("Borrow book");
    const bookIdInput = screen.getByLabelText("Book to borrow");
    fireEvent.change(bookIdInput, {target: {value: bookIsbn}});
    fireEvent.click(submitButton);
}

async function VerifyBorrowedBooks(expectedBorrowedBooks: string[]) {

    await waitFor(() => screen.findByText("Your borrow books"));
    for (let book in expectedBorrowedBooks) {
        const expectedMessage = `Borrowed book ${expectedBorrowedBooks[book]}`
        const borrowedBookElement = screen.getByText(expectedMessage);
        expect(borrowedBookElement).toBeInTheDocument()
    }
}

