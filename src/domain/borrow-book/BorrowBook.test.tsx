import React from "react";
import {renderHook, act} from '@testing-library/react-hooks'
import {setupServer} from "msw/node";
import {
    validBorrowBook,
    EXPECTED_BOOK_COPY_ID,
    invalidMember,
    VALID_MEMBER_ID,
    INVALID_MEMBER_ID,
    bookDoesNotExist,
} from "./api-mock-responses";
import {BorrowBookErrorKeys, UseBorrowBook, useBorrowBook} from "./UseBorrowBook";

const server = setupServer();
beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());


test("should borrow a book", async () => {

    const {result, waitForNextUpdate, borrowBook} = arrange({
        memberIsValid: true,
        bookExists: true,
    });

    act(() => {
        borrowBook(VALID_MEMBER_ID, EXPECTED_BOOK_COPY_ID)
    })
    await waitForNextUpdate()

    const {borrowBookId} = result.current
    expect(borrowBookId).toBe(EXPECTED_BOOK_COPY_ID)
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
                 }: {
    memberIsValid?: boolean;
    bookExists?: boolean;
}) {
    if (!memberIsValid) {
        server.use(invalidMember);
    } else if (!bookExists) {
        server.use(bookDoesNotExist);
    } else {
        server.use(validBorrowBook);
    }
    const {result, waitForNextUpdate} = renderHook<any, UseBorrowBook>(() => useBorrowBook());
    return {result, waitForNextUpdate, borrowBook: result.current.borrowBook}
}

