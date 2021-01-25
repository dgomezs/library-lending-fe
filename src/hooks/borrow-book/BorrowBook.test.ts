import {act, renderHook} from '@testing-library/react-hooks'
import {setupServer} from "msw/node";
import {
    BOOK_WITH_AVAILABLE_COPIES,
    BOOK_WITHOUT_AVAILABLE_COPIES,
    bookWithoutAvailableCopiesApiResponse,
    EXPECTED_BOOK_COPY_ID,
    EXPECTED_BOOK_SECOND_COPY_ID,
    NOT_REGISTERED_MEMBER,
    notRegisteredMemberApiResponse,
    REGISTERED_MEMBER_WITH_LESS_THAN_THRESHOLD_BORROWED_BOOKS,
    REGISTERED_MEMBER_WITH_THRESHOLD_BOOKS,
    registeredMemberWithMaxBorrowedBooksApiResponse,
    SECOND_BOOK_WITH_AVAILABLE_COPIES,
    validBorrowBookApiResponse,
} from "./api-mock-borrow-book-responses";
import {BorrowBookErrorKeys, UseBorrowBook, useBorrowBook} from "./UseBorrowBook";

const server = setupServer();
beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());


test("should borrow a book", async () => {

    // arrange
    const {result, waitForNextUpdate, borrowBook} = renderUseBorrowBook()
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

test("should borrow two books", async () => {


    // arrange
    const {result, waitForNextUpdate, borrowBook} = renderUseBorrowBook()
    const memberId = REGISTERED_MEMBER_WITH_LESS_THAN_THRESHOLD_BORROWED_BOOKS;
    const firstBookIsbn = BOOK_WITH_AVAILABLE_COPIES;
    const secondBookIsbn = SECOND_BOOK_WITH_AVAILABLE_COPIES


    server.use(validBorrowBookApiResponse(EXPECTED_BOOK_COPY_ID))
    act(() => {
        borrowBook(memberId, firstBookIsbn)
    })
    await waitForNextUpdate()
    const {borrowedBookCopyId: firstBorrowedCopy} = result.current
    server.use(validBorrowBookApiResponse(EXPECTED_BOOK_SECOND_COPY_ID))

    act(() => {
        borrowBook(memberId, secondBookIsbn)
    })
    await waitForNextUpdate()
    const {borrowedBookCopyId: secondBorrowedCopy} = result.current

    expect(firstBorrowedCopy).toBe(EXPECTED_BOOK_COPY_ID)
    expect(secondBorrowedCopy).toBe(EXPECTED_BOOK_SECOND_COPY_ID)
});


test("should not borrow a book if the member already has borrowed two books", async () => {

    // arrange
    const {result, waitForNextUpdate, borrowBook} = renderUseBorrowBook()
    server.use(registeredMemberWithMaxBorrowedBooksApiResponse)
    const memberId = REGISTERED_MEMBER_WITH_THRESHOLD_BOOKS;
    const bookIsbn = BOOK_WITH_AVAILABLE_COPIES;

    act(() => {
        borrowBook(memberId, bookIsbn)
    })
    await waitForNextUpdate()


    const {error} = result.current
    expect(error.name).toBe(BorrowBookErrorKeys.THRESHOLD_BOOKS);
});


test("should not borrow a book if the member is not registered", async () => {

    const {result, waitForNextUpdate, borrowBook} = renderUseBorrowBook()
    server.use(notRegisteredMemberApiResponse)
    const memberId = NOT_REGISTERED_MEMBER;
    const bookIsbn = BOOK_WITH_AVAILABLE_COPIES;

    act(() => {
        borrowBook(memberId, bookIsbn)
    })
    await waitForNextUpdate()

    const {error} = result.current
    expect(error.name).toBe(BorrowBookErrorKeys.MEMBER_NOT_REGISTERED);
});


test("should not borrow a book if the book has no available copies", async () => {
    const {result, waitForNextUpdate, borrowBook} = renderUseBorrowBook()
    server.use(bookWithoutAvailableCopiesApiResponse)
    const memberId = REGISTERED_MEMBER_WITH_LESS_THAN_THRESHOLD_BORROWED_BOOKS;
    const bookIsbn = BOOK_WITHOUT_AVAILABLE_COPIES;

    act(() => {
        borrowBook(memberId, bookIsbn)
    })
    await waitForNextUpdate()

    const {error} = result.current
    expect(error.name).toBe(BorrowBookErrorKeys.BOOK_WITHOUT_AVAILABLE_COPIES);
});


function renderUseBorrowBook() {
    const {result, waitForNextUpdate} = renderHook<any, UseBorrowBook>(() => useBorrowBook());
    return {result, waitForNextUpdate, borrowBook: result.current.borrowBook}
}

