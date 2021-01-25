import {act} from '@testing-library/react'
import {setupServer} from "msw/node";
import {REGISTERED_MEMBER_WITH_LESS_THAN_THRESHOLD_BORROWED_BOOKS} from 'src/hooks/borrow-book/api-mock-borrow-book-responses';
import {
    BOOK_WITH_AVAILABLE_COPIES,
    EXPECTED_BOOK_COPY_ID,
    validBorrowBookApiResponse
} from 'src/hooks/borrow-book/api-mock-borrow-book-responses';

const server = setupServer();
beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());


test("should borrow a book", async () => {

    // arrange
    renderDashboard();
    const memberId = REGISTERED_MEMBER_WITH_LESS_THAN_THRESHOLD_BORROWED_BOOKS;
    const bookIsbn = BOOK_WITH_AVAILABLE_COPIES;

    server.use(validBorrowBookApiResponse(EXPECTED_BOOK_COPY_ID));

    act(() => {
        borrowBook(memberId, bookIsbn)
    })
    await waitForNextUpdate()

    // assert
    const {borrowedBookCopyId} = result.current
    expect(borrowedBookCopyId).toBe(EXPECTED_BOOK_COPY_ID)
});


function renderDashboard() {
    const {result, waitForNextUpdate} = render<any, UseBorrowBook>(() => useBorrowBook());
}

function borrowBook(memberId: string, bookIsbn: string) {

}

