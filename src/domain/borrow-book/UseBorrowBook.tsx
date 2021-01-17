import { useAsync } from "react-async";



export interface ApiErrorResponse {
  errorKey: string;
}

export interface BorrowBookApiResponse {
  bookCopyId: string;
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
  const data = useAsync<BorrowBookApiResponse>({ deferFn: borrowBook });
  return { ...data, borrowBook: data.run };
}

export enum BorrowBookErrorKeys {
    INVALID_MEMBER = 'INVALID_MEMBER', 
    BOOK_NOT_FOUND = 'BOOK_NOT_FOUND',
    

} 