import {useAsync} from "react-async";
import {ApiErrorResponse} from "../../core/api-error-codes/api-error-codes";

export enum BorrowBookErrorKeys {
    MEMBER_NOT_REGISTERED = "MEMBER_NOT_REGISTERED",
    BOOK_WITHOUT_AVAILABLE_COPIES = "BOOK_WITHOUT_AVAILABLE_COPIES",
    THRESHOLD_BOOKS = "THRESHOLD_BOOKS",
}

export interface BorrowBookApiResponse {
    borrowedBookCopyId: string;
}

export interface UseBorrowBook {
    borrowedBookCopyId?: string,
    borrowBook: any,
    isPending: boolean,
    error: Error
}

async function borrowBookApiCall([
                                     memberId,
                                     bookId
                                 ]: any): Promise<BorrowBookApiResponse> {

    const uri = `/api/member/${memberId}/borrow/book/${bookId}`;

    const res = await fetch(uri, {method: "POST"});
    if (!res.ok) {
        const data: ApiErrorResponse = await res.json();
        const e = new Error(`Member ${memberId} couldn't borrow book ${bookId}. Error code ${data.errorKey} `);
        e.name = data.errorKey;
        throw e;
    }

    return res.json();
}

export function useBorrowBook(): UseBorrowBook {
    const result = useAsync<BorrowBookApiResponse>({
        deferFn: borrowBookApiCall
    });

    return {
        isPending: result.isPending,
        borrowBook:result.run,
        borrowedBookCopyId: result.data?.borrowedBookCopyId,
        error: result.error
    };
}

