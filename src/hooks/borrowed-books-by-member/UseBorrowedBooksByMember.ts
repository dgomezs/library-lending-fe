import {ApiErrorResponse} from 'src/core/api-error-codes/api-error-codes';
import {useAsync} from "react-async";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState} from "src/store/reducer";
import {sendBorrowedBooksByMemberSuccess} from "src/hooks/borrowed-books-by-member/redux/BorrowBooksByMemberActions";
import {BorrowedBooksByMemberState} from "src/hooks/borrowed-books-by-member/redux/BorrowBooksByMemberReducer";


export interface BorrowedBooksByMemberApiResponse {
    borrowedBooks: string[]
}

export enum BorrowedBooksByMemberErrorKeys {
    MEMBER_NOT_REGISTERED = "MEMBER_NOT_REGISTERED",
}

export interface GetBorrowedBooksByMember {
    (memberId: string): void
}

export interface UseBorrowedBooksByMember {
    borrowedBooksByMember: string[],
    getBorrowedBooksByMember: GetBorrowedBooksByMember,
    error: Error | undefined,
    isPending: boolean
}

async function getBorrowedBooksByMemberApiCall([
                                                   memberId,
                                               ]: any): Promise<BorrowedBooksByMemberApiResponse> {

    const uri = `/api/member/${memberId}/borrowed/books`;

    const res = await fetch(uri, {method: "GET"});
    if (!res.ok) {
        const data: ApiErrorResponse = await res.json();
        const e = new Error(`Couldn't get borrowed books for Member ${memberId}. Error code ${data.errorKey} `);
        e.name = data.errorKey;
        throw e;
    }

    return res.json();
}


export function useBorrowedBooksByMember(): UseBorrowedBooksByMember {

    const {borrowedBooksByMember} = useSelector<GlobalState, BorrowedBooksByMemberState>(state => state.borrowedBooksByMember);
    const dispatch = useDispatch();

    const result = useAsync<BorrowedBooksByMemberApiResponse>({
        deferFn: getBorrowedBooksByMemberApiCall,
        onResolve: (data => dispatch(sendBorrowedBooksByMemberSuccess(data.borrowedBooks)))
    });


    return {
        borrowedBooksByMember,
        getBorrowedBooksByMember: result.run,
        error: result.error,
        isPending: result.isPending
    }
}