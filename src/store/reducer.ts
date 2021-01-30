import {
    borrowedBooksByMember,
    BorrowedBooksByMemberState
} from 'src/hooks/borrowed-books-by-member/redux/BorrowBooksByMemberReducer';
import {combineReducers} from 'redux';

export interface GlobalState {
    borrowedBooksByMember: BorrowedBooksByMemberState
}


export const rootReducer = combineReducers({borrowedBooksByMember}) ;
