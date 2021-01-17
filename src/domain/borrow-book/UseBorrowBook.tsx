import { useAsync } from "react-async";



export interface ApiErrorResponse {
  errorKey: string;
}

export interface BorrowBookApiResponse {
  borrowedBookId: string;
}

async function borrowBook([
  memberId,
  bookId,
]: any): Promise<BorrowBookApiResponse> {
  const uri = `/api/member/${memberId}/borrow/book/${bookId}`;

  const res = await fetch(uri, { method: "POST" });
  if (!res.ok) {
    const data: ApiErrorResponse = await res.json();
    throw new Error(data.errorKey);
  }

  return res.json();
}

export function useBorrowBook() {
  const result = useAsync<BorrowBookApiResponse>({ deferFn: borrowBook });
  return {isPending: result.isPending, borrowBook: result.run, borrowBookId: result.data?.borrowedBookId, error: result.error };
}

export enum BorrowBookErrorKeys {
    INVALID_MEMBER = 'INVALID_MEMBER', 
    BOOK_NOT_FOUND = 'BOOK_NOT_FOUND',
    

} 