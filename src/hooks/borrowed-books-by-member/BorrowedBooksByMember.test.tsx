import {act, renderHook} from '@testing-library/react-hooks'
import {Provider} from 'react-redux'
import {setupServer} from "msw/node";
import {
    borrowedBooksByMemberApiResponse,
    EXPECTED_BOOK_COPY_ID,
    NOT_REGISTERED_MEMBER,
    notRegisteredMemberApiResponse,
    REGISTERED_MEMBER_WITH_LESS_THAN_THRESHOLD_BORROWED_BOOKS
} from "./api-mock-borrowed-books-member-responses";
import {
    BorrowedBooksByMemberErrorKeys,
    UseBorrowedBooksByMember,
    useBorrowedBooksByMember
} from "./UseBorrowedBooksByMember";
import initializeStore from "src/store/store";

const server = setupServer();
beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());


test("should get the current borrowed books by a member", async () => {

    // arrange
    const {result, waitForNextUpdate, getBorrowedBooksByMember} = renderUseBorrowedBooksByMember()
    const memberId = REGISTERED_MEMBER_WITH_LESS_THAN_THRESHOLD_BORROWED_BOOKS;
    const expectedBorrowedBooksByMember = [EXPECTED_BOOK_COPY_ID];
    server.use(borrowedBooksByMemberApiResponse(memberId, expectedBorrowedBooksByMember));

    act(() => {
        getBorrowedBooksByMember(memberId)
    })
    await waitForNextUpdate()


    // assert
    const {borrowedBooksByMember} = result.current
    expect(borrowedBooksByMember.length).toBe(1)
    expect(borrowedBooksByMember).toContain(EXPECTED_BOOK_COPY_ID)
});

test("should get an error trying to get the current borrowed books by a non registered member", async () => {

    // arrange
    const {result, waitForNextUpdate, getBorrowedBooksByMember} = renderUseBorrowedBooksByMember()
    const memberId = NOT_REGISTERED_MEMBER;
    server.use(notRegisteredMemberApiResponse);

    act(() => {
        getBorrowedBooksByMember(memberId)
    })
    await waitForNextUpdate()


    // assert
    const {error} = result.current
    expect(error?.name).toBe(BorrowedBooksByMemberErrorKeys.MEMBER_NOT_REGISTERED)
});


function renderUseBorrowedBooksByMember(initialBorrowedBooks: string[] = []) {

    const store = initializeStore({borrowedBooksByMember: {borrowedBooksByMember: initialBorrowedBooks}});

    const wrapper = ({children}: { children: any }) =>
        <Provider store={store}>{children}</Provider>
    const {
        result,
        waitForNextUpdate
    } = renderHook<any, UseBorrowedBooksByMember>(() => useBorrowedBooksByMember(), {wrapper});
    return {
        result,
        waitForNextUpdate,
        borrowBook: result.current.borrowedBooksByMember,
        getBorrowedBooksByMember: result.current.getBorrowedBooksByMember
    }
}

