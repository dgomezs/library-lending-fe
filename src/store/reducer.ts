import {
    borrowedBooksByMemberReducer,
    BorrowedBooksByMemberState
} from 'src/hooks/borrowed-books-by-member/redux/BorrowBooksByMemberReducer';
import {combineReducers} from 'redux';

export interface GlobalState {
    borrowedBooksByMemberReducer: BorrowedBooksByMemberState
}


export const rootReducer = combineReducers({borrowedBooksByMemberReducer}) ;
