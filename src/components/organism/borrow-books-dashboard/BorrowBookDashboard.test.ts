import {fireEvent, screen} from "@testing-library/react";
import {setupServer} from "msw/node";
import {
    BOOK_WITH_AVAILABLE_COPIES,
    EXPECTED_BOOK_COPY_ID,
    REGISTERED_MEMBER_WITH_LESS_THAN_THRESHOLD_BORROWED_BOOKS,
    validBorrowBookApiResponse
} from 'src/hooks/borrow-book/api-mock-borrow-book-responses';
import {borrowedBooksByMemberApiResponse} from "src/hooks/borrowed-books-by-member/api-mock-borrowed-books-member-responses";

const server = setupServer();
beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());


test("should borrow a book", async () => {

    // arrange
    const initialBorrowedBooks: string[] = [];
    const expectedBorrowedBooks = [EXPECTED_BOOK_COPY_ID]
    renderDashboard(initialBorrowedBooks);
    const memberId = REGISTERED_MEMBER_WITH_LESS_THAN_THRESHOLD_BORROWED_BOOKS;
    const bookIsbn = BOOK_WITH_AVAILABLE_COPIES;

    server.use(validBorrowBookApiResponse(EXPECTED_BOOK_COPY_ID),
        borrowedBooksByMemberApiResponse(memberId, expectedBorrowedBooks));

    borrowBook(memberId, bookIsbn)

    // assert
    VerifyBorrowedBooks(expectedBorrowedBooks)

});

function renderDashboard(initialBorrowedBooks: string[]) {


}


function borrowBook(memberId: string, bookIsbn: string) {
    const submitButton = screen.getByText("/Borrow book/i");
    const bookIdInput = screen.getByLabelText("/Book to borrow/i");
    fireEvent.change(bookIdInput, {target: {value: bookIsbn}});
    fireEvent.click(submitButton);
}

function VerifyBorrowedBooks(expectedBorrowedBooks: string[]) {

}

