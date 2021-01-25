import {rest} from "msw";
import {ApiErrorResponse} from 'src/core/api-error-codes/api-error-codes';
import {BorrowedBooksByMemberApiResponse, BorrowedBooksByMemberErrorKeys} from "./UseBorrowedBooksByMember";

const delay = 300;

const borrowedBooksByMemberEndPoint = (memberId: string) => `/api/member/${memberId}/borrowed/books`;

export const EXPECTED_BOOK_COPY_ID = "1";

export const NOT_REGISTERED_MEMBER = "2";
export const REGISTERED_MEMBER_WITH_LESS_THAN_THRESHOLD_BORROWED_BOOKS = "1";

export const borrowedBooksByMemberApiResponse = (memberId: string,
                                                 expectedBorrowedBookCopies: string[]) => rest.get<BorrowedBooksByMemberApiResponse, any>(
    borrowedBooksByMemberEndPoint(memberId),
    async (req, res, ctx) => {
        return res(
            ctx.delay(delay),
            ctx.json({borrowedBooks: expectedBorrowedBookCopies})
        );
    }
);


export const notRegisteredMemberApiResponse = rest.get<ApiErrorResponse, any>(
    borrowedBooksByMemberEndPoint(NOT_REGISTERED_MEMBER),
    async (req, res, ctx) => {
        return res(
            ctx.delay(delay),
            ctx.status(401),
            ctx.json({errorKey: BorrowedBooksByMemberErrorKeys.MEMBER_NOT_REGISTERED})
        );
    }
);

