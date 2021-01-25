import {useContext} from 'react'
import {BorrowedBooksByMemberContext} from './BorrowedBooksByMemberContext'
import {ApiErrorResponse} from 'src/core/api-error-codes/api-error-codes';
import {useAsync} from "react-async";


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
    error: Error
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
    const context = useContext<BorrowedBooksByMemberContext>(BorrowedBooksByMemberContext)
    if (context === undefined) {
        throw new Error('useBorrowedBooksByMember must be used within a <BorrowBooksByMember />')
    }
    const {borrowedBooksByMember, setBorrowedBooksByMember} = context

    const result = useAsync<BorrowedBooksByMemberApiResponse>({
        deferFn: getBorrowedBooksByMemberApiCall,
        onResolve: (data => setBorrowedBooksByMember(data.borrowedBooks))
    });


    return {borrowedBooksByMember, getBorrowedBooksByMember: result.run, error: result.error}
}