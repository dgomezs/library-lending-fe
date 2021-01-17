import { rest } from "msw";
import { ApiErrorResponse, BorrowBookApiResponse, BorrowBookErrorKeys } from "./UseBorrowBook";

const delay = 300;
const borrowBookEndPoint = (memberId:string, bookId:string) => `/api/member/${memberId}/borrow/book/${bookId}`;
const BORROW_BOOK_PARAM = ":bookId"

export const EXPECTED_BOOK_COPY_ID = "2";
export const INVALID_MEMBER_ID = "2";
export const VALID_MEMBER_ID = "1";


const validBorrowBook = rest.post<BorrowBookApiResponse, any>(
  borrowBookEndPoint(VALID_MEMBER_ID, BORROW_BOOK_PARAM),
  async (req, res, ctx) => {
    const {bookId} = req.params
    return res(
      ctx.delay(delay),
      ctx.json({ borrowedBookId: bookId })
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
