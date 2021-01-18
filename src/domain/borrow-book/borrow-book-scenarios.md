# Feature: Borrow a book
## Scenario: Valid member can borrow a book

A valid member wants to borrow a book. Since the specific book is not relevant to the functionality itself we are not using specific examples.

### Arrange:
- Member is valid
- Book has available copies
- Member has 1 book or less borrowed

### Act:
- Member borrows the book

### Assert:
- Member now has a copy of the book in the borrowed books list
- The book has one less copy available for borrowing
- it shouldn't be possible that another member tries to borrow that book 

