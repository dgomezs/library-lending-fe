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
}; 

function ShowUserMessage({userMessage, errorMessage, isPending}: {userMessage?:string, errorMessage?:string, isPending:boolean}) {

  if (isPending){
    return <div>Loading ...</div>
  }
  if (!isPending && errorMessage) {
    return <span data-testid="error-message">{errorMessage}</span>;
  }
  if (!isPending && userMessage) {
    return <span data-testid="user-message">{userMessage}</span>;
  }
  return null
}



const BorrowBookTestComponent = ({ memberId }: BorrowBookTestProps) => {
  const { borrowBookId, error, borrowBook, isPending } = useBorrowBook();
  const [bookId, setBookId] = useState("");
  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    borrowBook(memberId, bookId);
  };

  return (
    <div>
      <span>{memberId}</span>
      <ShowUserMessage userMessage={borrowBookId} errorMessage={error?.message} isPending={isPending}/>
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
  borrowBook(EXPECTED_BOOK_COPY_ID);
  await verifyBookHasBeenBorrowed(EXPECTED_BOOK_COPY_ID);
});

test("should not borrow a book if the member is invalid", async () => {
  arrange({
    memberIsValid: false,
    bookExists: true,
    memberId: INVALID_MEMBER_ID
  });
  borrowBook(EXPECTED_BOOK_COPY_ID);
  await verifyErrorMessage(BorrowBookErrorKeys.INVALID_MEMBER);
});


test("should not borrow a book if the book does not exist", async () => {
  arrange({
    bookExists: false
  });
  borrowBook(EXPECTED_BOOK_COPY_ID);
  await verifyErrorMessage(BorrowBookErrorKeys.BOOK_NOT_FOUND);
});


async function verifyBookHasBeenBorrowed(borrowedBookId:string) {
 await verifyMessageToUser(borrowedBookId);
}

async function verifyMessageToUser(message:string) {
  await verifyMessage(message, "user-message")  
}

async function verifyErrorMessage(message:string) {
  await verifyMessage(message, "error-message")  
}

async function verifyMessage(message: string, elementDataId:string) {
  const userMessageElement: Element = await screen.findByTestId(
    elementDataId,
    undefined,
    {
      timeout: 1500,
      onTimeout: () => {
        throw new Error("timeout");
      },
    }
  );
  expect(userMessageElement.textContent).toEqual(message);
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
