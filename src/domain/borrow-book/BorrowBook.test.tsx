import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { setupServer } from "msw/node";
import {
  validBorrowBook,
  EXPECTED_BOOK_COPY_ID,
  invalidMember,
  VALID_MEMBER_ID,
  INVALID_MEMBER_ID,
  bookDoesNotExist,
} from "./api-mock-responses";
import { BorrowBookErrorKeys, useBorrowBook } from "./UseBorrowBook";

const server = setupServer();
beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

type BorrowBookTestProps = {
  memberId: string;
}; /* could also use interface */

const BorrowBookTestComponent = ({ memberId }: BorrowBookTestProps) => {
  const { data, error, borrowBook } = useBorrowBook();
  const [bookId, setBookId] = useState("");
  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    borrowBook(memberId, bookId);
  };

  if (error) {
    return <span data-testid="user-message">The error is {error.message}</span>;
  }
  if (data)
    return (
      <span data-testid="user-message">
        The book copy is {data?.bookCopyId}
      </span>
    );
  return (
    <div>
      <span>{memberId}</span>
      <input
        data-testid="borrow-book-id-input"
        type="text"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
      ></input>
      <button data-testid="borrow-book-buttom" onClick={handleSubmit}></button>
    </div>
  );
};

test("should borrow a book", async () => {
  arrange({
    memberIsValid: true,
    bookExists:true, 
    memberId: VALID_MEMBER_ID
  });
  borrowBook("1");
  await verifyBookHasBeenBorrowed();
});

test("should not borrow a book if the member is invalid", async () => {
  arrange({
    memberIsValid: false,
    bookExists: true,
    memberId: INVALID_MEMBER_ID
  });
  borrowBook("1");
  await verifyMessageToUser(BorrowBookErrorKeys.INVALID_MEMBER);
});


test("should not borrow a book if the book does not exist", async () => {
  arrange({
    bookExists: false
  });
  borrowBook("1");
  await verifyMessageToUser(BorrowBookErrorKeys.BOOK_NOT_FOUND);
});


async function verifyBookHasBeenBorrowed() {
 return verifyMessageToUser(EXPECTED_BOOK_COPY_ID);
}

async function verifyMessageToUser(message: string) {
  const userMessageElement: Element = await screen.findByTestId(
    "user-message",
    undefined,
    {
      timeout: 1500,
      onTimeout: () => {
        throw new Error("timeout");
      },
    }
  );
  expect(userMessageElement.textContent).toContain(message);
}

function arrange({
  memberIsValid= true,
  bookExists = true,
  memberId = VALID_MEMBER_ID
}: {
  memberIsValid?: boolean;
  bookExists?: boolean;
  memberId?:string;
}) {
  if (!memberIsValid) {
    server.use(invalidMember);
  } else if (!bookExists) {
    server.use(bookDoesNotExist);
  } else {
    server.use(validBorrowBook);
  }

  render(<BorrowBookTestComponent memberId={memberId} />);
}

function borrowBook(bookId: string) {
  const submitButton = screen.getByTestId("borrow-book-buttom");
  const bookIdInput = screen.getByTestId("borrow-book-id-input");
  fireEvent.change(bookIdInput, { target: { value: bookId } });
  fireEvent.click(submitButton);
}
