import {useAsync} from "react-async";
import {useBorrowedBooksByMember} from '../borrowed-books-by-member/UseBorrowedBooksByMember'

export enum BorrowBookErrorKeys {
    INVALID_MEMBER = "INVALID_MEMBER",
    BOOK_NOT_FOUND = "BOOK_NOT_FOUND",
    THRESHOLD_BOOKS = "THRESHOLD_BOOKS",
}

export interface ApiErrorResponse {
    errorKey: string;
}

export const MAX_BORROWED_BOOKS = 2;

export interface BorrowBookApiResponse {
    borrowedBookCopyId: string;
}

export interface UseBorrowBook {
    borrowedBookCopyId?: string,
    borrowBook: any,
    isPending: boolean,
    error: Error,
    borrowedBooksByMember: string[]
}

async function borrowBookApiCall([
                                     memberId,
                                     bookId,
                                     borrowedBooksByMember
                                 ]: any): Promise<BorrowBookApiResponse> {

    if (borrowedBooksByMember.length >= MAX_BORROWED_BOOKS) {
        throw new Error(BorrowBookErrorKeys.THRESHOLD_BOOKS);
    }

    const uri = `/api/member/${memberId}/borrow/book/${bookId}`;

    const res = await fetch(uri, {method: "POST"});
    if (!res.ok) {
        const data: ApiErrorResponse = await res.json();
        throw new Error(data.errorKey);
    }

    return res.json();
}

export function useBorrowBook(): UseBorrowBook {
    const {addBook, state: {borrowedBooksByMember}} = useBorrowedBooksByMember();

    const addBookOnResolve = (data: BorrowBookApiResponse) => addBook(data.borrowedBookCopyId);
    const result = useAsync<BorrowBookApiResponse>({
        deferFn: borrowBookApiCall,
        onResolve: addBookOnResolve,
    });
    const borrowBook = (...args: any) => {
        return result.run(...args, borrowedBooksByMember);
    };

    return {
        isPending: result.isPending,
        borrowBook,
        borrowedBookCopyId: result.data?.borrowedBookCopyId,
        error: result.error,
        borrowedBooksByMember
    };
}

