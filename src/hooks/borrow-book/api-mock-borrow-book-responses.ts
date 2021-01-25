import {rest} from "msw";
import {ApiErrorResponse, BorrowBookApiResponse, BorrowBookErrorKeys} from "./UseBorrowBook";

const delay = 300;
const borrowBookEndPoint = (memberId: string, bookIsbn: string) => `/api/member/${memberId}/borrow/book/${bookIsbn}`;
const BORROW_BOOK_PARAM = ":bookIsbn"

export const EXPECTED_BOOK_COPY_ID = "1";
export const EXPECTED_BOOK_SECOND_COPY_ID = "2";

export const NOT_REGISTERED_MEMBER = "2";
export const REGISTERED_MEMBER_WITH_LESS_THAN_THRESHOLD_BORROWED_BOOKS = "1";
export const REGISTERED_MEMBER_WITH_THRESHOLD_BOOKS = "3"

export const BOOK_WITH_AVAILABLE_COPIES = "1"
export const SECOND_BOOK_WITH_AVAILABLE_COPIES = "1"
export const BOOK_WITHOUT_AVAILABLE_COPIES = "2";


export const validBorrowBookApiResponse = (borrowedBookCopyId: string) => rest.post<BorrowBookApiResponse, any>(
    borrowBookEndPoint(REGISTERED_MEMBER_WITH_LESS_THAN_THRESHOLD_BORROWED_BOOKS, BOOK_WITH_AVAILABLE_COPIES),
    async (req, res, ctx) => {
        return res(
            ctx.delay(delay),
            ctx.json({borrowedBookCopyId})
        );
    }
);

export const notRegisteredMemberApiResponse = rest.post<ApiErrorResponse, any>(
    borrowBookEndPoint(NOT_REGISTERED_MEMBER, BORROW_BOOK_PARAM),
    async (req, res, ctx) => {
        return res(
            ctx.delay(delay),
            ctx.status(401),
            ctx.json({errorKey: BorrowBookErrorKeys.MEMBER_NOT_REGISTERED})
        );
    }
);

export const registeredMemberWithMaxBorrowedBooksApiResponse = rest.post<ApiErrorResponse, any>(
    borrowBookEndPoint(REGISTERED_MEMBER_WITH_THRESHOLD_BOOKS, BORROW_BOOK_PARAM),
    async (req, res, ctx) => {
        return res(
            ctx.delay(delay),
            ctx.status(400),
            ctx.json({errorKey: BorrowBookErrorKeys.THRESHOLD_BOOKS})
        );
    }
);

export const bookWithoutAvailableCopiesApiResponse = rest.post<ApiErrorResponse, any>(
    borrowBookEndPoint(REGISTERED_MEMBER_WITH_LESS_THAN_THRESHOLD_BORROWED_BOOKS, BOOK_WITHOUT_AVAILABLE_COPIES),
    async (req, res, ctx) => {
        return res(
            ctx.delay(delay),
            ctx.status(404),
            ctx.json({errorKey: BorrowBookErrorKeys.BOOK_WITHOUT_AVAILABLE_COPIES})
        );
    }
);

