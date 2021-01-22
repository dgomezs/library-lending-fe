import { rest } from "msw";
import { ApiErrorResponse, BorrowBookApiResponse, BorrowBookErrorKeys } from "./UseBorrowBook";

const delay = 300;
const borrowBookEndPoint = (memberId:string, bookIsbn:string) => `/api/member/${memberId}/borrow/book/${bookIsbn}`;
const BORROW_BOOK_PARAM = ":bookIsbn"

export const EXPECTED_BOOK_COPY_ID = "1";
export const EXPECTED_BOOK_SECOND_COPY_ID = "2";
export const INVALID_MEMBER_ID = "2";
export const VALID_MEMBER_ID = "1";
export const BOOK_TO_BORROW_ISBN = EXPECTED_BOOK_COPY_ID;
export const SECOND_BOOK_TO_BORROW_ISBN = EXPECTED_BOOK_SECOND_COPY_ID;


const validBorrowBook = rest.post<BorrowBookApiResponse, any>(
  borrowBookEndPoint(VALID_MEMBER_ID, BORROW_BOOK_PARAM),
  async (req, res, ctx) => {
    const {bookIsbn} = req.params
    return res(
      ctx.delay(delay),
      ctx.json({ borrowedBookCopyId: bookIsbn })
    );
  }
);

const invalidMember = rest.post<ApiErrorResponse, any>(
  borrowBookEndPoint(INVALID_MEMBER_ID, BORROW_BOOK_PARAM),
  async (req, res, ctx) => {
    return res(
      ctx.delay(delay),
      ctx.status(401),
      ctx.json({ errorKey: BorrowBookErrorKeys.INVALID_MEMBER })
    );
  }
);

const bookDoesNotExist = rest.post<ApiErrorResponse, any>(
    borrowBookEndPoint(VALID_MEMBER_ID, BORROW_BOOK_PARAM),
    async (req, res, ctx) => {
      return res(
        ctx.delay(delay),
        ctx.status(404),
        ctx.json({ errorKey: BorrowBookErrorKeys.BOOK_NOT_FOUND })
      );
    }
  );

export { validBorrowBook, invalidMember, bookDoesNotExist };
