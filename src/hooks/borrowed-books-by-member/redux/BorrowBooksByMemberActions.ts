export const BORROWED_BOOKS_BY_MEMBER_SUCCESS = 'BORROWED_BOOKS_BY_MEMBER_SUCCESS'

interface BorrowBooksByMemberSuccessAction {
    type: typeof BORROWED_BOOKS_BY_MEMBER_SUCCESS
    payload: string[]
}

export type BorrowBooksByMemberActionTypes =
    BorrowBooksByMemberSuccessAction

export function sendBorrowedBooksByMemberSuccess(borrowedBooksByMember: string[]): BorrowBooksByMemberSuccessAction {
    return {
        type: BORROWED_BOOKS_BY_MEMBER_SUCCESS,
        payload: borrowedBooksByMember
    }
}