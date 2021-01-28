import {
    BorrowBooksByMemberActionTypes,
    BORROWED_BOOKS_BY_MEMBER_SUCCESS
} from "src/hooks/borrowed-books-by-member/redux/BorrowBooksByMemberActions";

export interface BorrowedBooksByMemberState {
    borrowedBooksByMember: string[]
}

const initialState: BorrowedBooksByMemberState = {
    borrowedBooksByMember: []
}


export function borrowedBooksByMemberReducer(
    state = initialState,
    action: BorrowBooksByMemberActionTypes
): BorrowedBooksByMemberState {
    switch (action.type) {
        case BORROWED_BOOKS_BY_MEMBER_SUCCESS:
            return {
                ...state,
                borrowedBooksByMember: action.payload
            };
        default:
            return state
    }
}