import {useAsync} from "react-async";
import {useBorrowedBooksByMember} from '../borrowed-books-by-member/UseBorrowedBooksByMember'

export enum BorrowBookErrorKeys {
    MEMBER_NOT_REGISTERED = "MEMBER_NOT_REGISTERED",
    BOOK_WITHOUT_AVAILABLE_COPIES = "BOOK_WITHOUT_AVAILABLE_COPIES",
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
                                     bookId
                                 ]: any): Promise<BorrowBookApiResponse> {

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

    return {
        isPending: result.isPending,
        borrowBook : result.run,
        borrowedBookCopyId: result.data?.borrowedBookCopyId,
        error: result.error,
        borrowedBooksByMember
    };
}

