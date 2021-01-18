import React from "react";
import {renderHook, act} from '@testing-library/react-hooks'
import {setupServer} from "msw/node";
import {
    validBorrowBook,
    EXPECTED_BOOK_COPY_ID,
    invalidMember,
    VALID_MEMBER_ID,
    INVALID_MEMBER_ID,
    bookDoesNotExist, EXPECTED_BOOK_SECOND_COPY_ID,
} from "./api-mock-responses";
import {BorrowBookErrorKeys, UseBorrowBook, useBorrowBook} from "./UseBorrowBook";
import {BorrowBooksByMember} from "../borrowed-books-by-member/BorrowedBooksByMemberContext";

const server = setupServer();
beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());


test("should borrow a book", async () => {

    const {result, waitForNextUpdate, borrowBook} = arrange({
        memberIsValid: true,
        bookExists: true,
        initialBorrowedBooks: []
    });

    act(() => {
        borrowBook(VALID_MEMBER_ID, EXPECTED_BOOK_COPY_ID)
    })
    await waitForNextUpdate()

    const {borrowBookId, borrowedBooksByMember} = result.current
    expect(borrowBookId).toBe(EXPECTED_BOOK_COPY_ID)
    expect(borrowedBooksByMember.length).toBe(1)
    expect(borrowedBooksByMember).toContain(EXPECTED_BOOK_COPY_ID)
});

test("should borrow two books ", async () => {

    const {result, waitForNextUpdate, borrowBook} = arrange({
        memberIsValid: true,
        bookExists: true,
        initialBorrowedBooks: []
    });

    act(() => {
        borrowBook(VALID_MEMBER_ID, EXPECTED_BOOK_COPY_ID)
    })
    await waitForNextUpdate()

    act(() => {
        borrowBook(VALID_MEMBER_ID, EXPECTED_BOOK_SECOND_COPY_ID)
    })
    await waitForNextUpdate()

    const {borrowedBooksByMember} = result.current
    expect(borrowedBooksByMember.length).toBe(2)
    expect(borrowedBooksByMember).toContain(EXPECTED_BOOK_COPY_ID)
    expect(borrowedBooksByMember).toContain(EXPECTED_BOOK_SECOND_COPY_ID)
});


test("should not borrow a book if the member already has borrowed two books ", async () => {

    const {result, waitForNextUpdate, borrowBook} = arrange({
        memberIsValid: true,
        bookExists: true,
        initialBorrowedBooks: [EXPECTED_BOOK_COPY_ID, EXPECTED_BOOK_SECOND_COPY_ID]
    });

    act(() => {
        borrowBook(VALID_MEMBER_ID, EXPECTED_BOOK_COPY_ID)
    })
    await waitForNextUpdate()


    const {error} = result.current
    expect(error.message).toBe(BorrowBookErrorKeys.THRESHOLD_BOOKS);
});


test("should not borrow a book if the member is invalid", async () => {
    const {result, waitForNextUpdate, borrowBook} = arrange({
        memberIsValid: false,
        bookExists: true,
    });
    act(() => {
        borrowBook(INVALID_MEMBER_ID, EXPECTED_BOOK_COPY_ID);
    })
    await waitForNextUpdate()
    const {error} = result.current
    expect(error.message).toBe(BorrowBookErrorKeys.INVALID_MEMBER);
});


test("should not borrow a book if the book does not exist", async () => {
    const {result, waitForNextUpdate, borrowBook} = arrange({
        memberIsValid: true,
        bookExists: false
    });
    act(() => {
        borrowBook(VALID_MEMBER_ID, EXPECTED_BOOK_COPY_ID);
    })
    await waitForNextUpdate()

    const {error} = result.current
    expect(BorrowBookErrorKeys.BOOK_NOT_FOUND).toBe(error.message);
});

function arrange({
                     memberIsValid = true,
                     bookExists = true,
                     initialBorrowedBooks = []
                 }: {
    memberIsValid?: boolean;
    bookExists?: boolean;
    initialBorrowedBooks?: string[]
}) {
    if (!memberIsValid) {
        server.use(invalidMember);
    } else if (!bookExists) {
        server.use(bookDoesNotExist);
    } else {
        server.use(validBorrowBook);
    }

    const wrapper = ({children}) => <BorrowBooksByMember
        initialBorrowedBooks={initialBorrowedBooks}>{children}</BorrowBooksByMember>

    const {result, waitForNextUpdate} = renderHook<any, UseBorrowBook>(() => useBorrowBook(), {wrapper});
    return {result, waitForNextUpdate, borrowBook: result.current.borrowBook}
}

