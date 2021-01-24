import React from "react";
import {renderHook, act} from '@testing-library/react-hooks'
import {setupServer} from "msw/node";
import {
    validBorrowBook,
    EXPECTED_BOOK_COPY_ID,
    notRegisteredMember,
    REGISTERED_MEMBER_WITH_LESS_THAN_THRESHOLD_BORROWED_BOOKS,
    NOT_REGISTERED_MEMBER,
    bookWithoutAvailableCopies,
    EXPECTED_BOOK_SECOND_COPY_ID,
    BOOK_WITH_AVAILABLE_COPIES,
    SECOND_BOOK_WITH_AVAILABLE_COPIES,
    registeredMemberWithMaxBorrowedBooks, REGISTERED_MEMBER_WITH_THRESHOLD_BOOKS, BOOK_WITHOUT_AVAILABLE_COPIES,
} from "./api-mock-responses";
import {BorrowBookErrorKeys, UseBorrowBook, useBorrowBook} from "./UseBorrowBook";
import {BorrowBooksByMember} from "../borrowed-books-by-member/BorrowedBooksByMemberContext";

const server = setupServer();
beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());


test("should borrow a book", async () => {

    // arrange
    const {result, waitForNextUpdate, borrowBook} = renderUseBorrowBook()
    server.use(validBorrowBook(EXPECTED_BOOK_COPY_ID))
    const memberId = REGISTERED_MEMBER_WITH_LESS_THAN_THRESHOLD_BORROWED_BOOKS;
    const bookIsbn = BOOK_WITH_AVAILABLE_COPIES;


    act(() => {
        borrowBook(memberId, bookIsbn)
    })
    await waitForNextUpdate()

    // assert
    const {borrowedBookCopyId, borrowedBooksByMember} = result.current
    expect(borrowedBookCopyId).toBe(EXPECTED_BOOK_COPY_ID)
    expect(borrowedBooksByMember.length).toBe(1)
    expect(borrowedBooksByMember).toContain(EXPECTED_BOOK_COPY_ID)
});

test("should borrow two books", async () => {


    // arrange
    const {result, waitForNextUpdate, borrowBook} = renderUseBorrowBook()
    const memberId = REGISTERED_MEMBER_WITH_LESS_THAN_THRESHOLD_BORROWED_BOOKS;
    const firstBookIsbn = BOOK_WITH_AVAILABLE_COPIES;
    const secondBookIsbn = SECOND_BOOK_WITH_AVAILABLE_COPIES


    server.use(validBorrowBook(EXPECTED_BOOK_COPY_ID))
    act(() => {
        borrowBook(memberId, firstBookIsbn)
    })
    await waitForNextUpdate()

    server.use(validBorrowBook(EXPECTED_BOOK_SECOND_COPY_ID))
    act(() => {
        borrowBook(memberId, secondBookIsbn)
    })
    await waitForNextUpdate()

    const {borrowedBooksByMember} = result.current
    expect(borrowedBooksByMember.length).toBe(2)
    expect(borrowedBooksByMember).toContain(EXPECTED_BOOK_COPY_ID)
    expect(borrowedBooksByMember).toContain(EXPECTED_BOOK_SECOND_COPY_ID)
});


test("should not borrow a book if the member already has borrowed two books", async () => {

    // arrange
    const {result, waitForNextUpdate, borrowBook} = renderUseBorrowBook()
    server.use(registeredMemberWithMaxBorrowedBooks)
    const memberId = REGISTERED_MEMBER_WITH_THRESHOLD_BOOKS;
    const bookIsbn = BOOK_WITH_AVAILABLE_COPIES;

    act(() => {
        borrowBook(memberId, bookIsbn)
    })
    await waitForNextUpdate()


    const {error} = result.current
    expect(error.message).toBe(BorrowBookErrorKeys.THRESHOLD_BOOKS);
});


test("should not borrow a book if the member is not registered", async () => {

    const {result, waitForNextUpdate, borrowBook} = renderUseBorrowBook()
    server.use(notRegisteredMember)
    const memberId = NOT_REGISTERED_MEMBER;
    const bookIsbn = BOOK_WITH_AVAILABLE_COPIES;

    act(() => {
        borrowBook(memberId, bookIsbn)
    })
    await waitForNextUpdate()

    const {error} = result.current
    expect(error.message).toBe(BorrowBookErrorKeys.MEMBER_NOT_REGISTERED);
});


test("should not borrow a book if the book has no available copies", async () => {
    const {result, waitForNextUpdate, borrowBook} = renderUseBorrowBook()
    server.use(bookWithoutAvailableCopies)
    const memberId = REGISTERED_MEMBER_WITH_LESS_THAN_THRESHOLD_BORROWED_BOOKS;
    const bookIsbn = BOOK_WITHOUT_AVAILABLE_COPIES;

    act(() => {
        borrowBook(memberId, bookIsbn)
    })
    await waitForNextUpdate()

    const {error} = result.current
    expect(BorrowBookErrorKeys.BOOK_WITHOUT_AVAILABLE_COPIES).toBe(error.message);
});


function renderUseBorrowBook(initialBorrowedBooks:string[] = []) {

    const wrapper = ({children}) => <BorrowBooksByMember
        initialBorrowedBooks={initialBorrowedBooks}>{children}</BorrowBooksByMember>

    const {result, waitForNextUpdate} = renderHook<any, UseBorrowBook>(() => useBorrowBook(), {wrapper});
    return {result, waitForNextUpdate, borrowBook: result.current.borrowBook}
}

