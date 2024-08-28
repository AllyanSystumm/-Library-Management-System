// Book and Library classes remain the same as before

// Initialize Library
const library = new Library();

// Populate Filter Dropdown
function populateAuthorFilter() {
  const filterAuthor = document.getElementById('filter-author');
  const authors = [...new Set(library.getBooks().map(book => book.getDetails().author))];
  
  filterAuthor.innerHTML = '<option value="">Filter by Author</option>';
  authors.forEach(author => {
    const option = document.createElement('option');
    option.value = author;
    option.textContent = author;
    filterAuthor.appendChild(option);
  });
}

// Event: Add/Edit Book
document.getElementById('book-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('book-title').value;
  const author = document.getElementById('book-author').value;
  const isbn = document.getElementById('book-isbn').value;
  const id = parseInt(document.getElementById('book-id').value);

  if (id) {
    const book = library.getBookById(id);
    if (book) {
      book.update(title, author, isbn);
      updateBookList();
      clearForm();
    }
  } else {
    library.addBook(title, author, isbn);
    updateBookList();
    clearForm();
  }

  populateAuthorFilter();
});

// Event: Handle Book Actions
document.getElementById('book-list').addEventListener('click', (e) => {
  if (e.target.classList.contains('edit-button')) {
    const id = parseInt(e.target.dataset.id);
    const book = library.getBookById(id);
    if (book) {
      const { title, author, isbn } = book.getDetails();
      document.getElementById('book-title').value = title;
      document.getElementById('book-author').value = author;
      document.getElementById('book-isbn').value = isbn;
      document.getElementById('book-id').value = id;
    }
  } else if (e.target.classList.contains('delete-button')) {
    const id = parseInt(e.target.dataset.id);
    library.deleteBook(id);
    updateBookList();
    populateAuthorFilter();
  }
});

// Event: Search and Filter
document.getElementById('search-query').addEventListener('input', updateBookList);
document.getElementById('filter-author').addEventListener('change', updateBookList);

// Update book list UI with Search and Filter
function updateBookList() {
  const bookList = document.getElementById('book-list');
  const query = document.getElementById('search-query').value.toLowerCase();
  const filterAuthor = document.getElementById('filter-author').value;

  bookList.innerHTML = '';

  library.getBooks().forEach(book => {
    const { id, title, author, isbn } = book.getDetails();

    if (
      (title.toLowerCase().includes(query) || author.toLowerCase().includes(query)) &&
      (filterAuthor === '' || author === filterAuthor)
    ) {
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <strong>${title}</strong><br>
          Author: ${author}<br>
          ISBN: ${isbn}
        </div>
        <div>
          <button class="edit-button" data-id="${id}">Edit</button>
          <button class="delete-button" data-id="${id}">Delete</button>
        </div>
      `;
      bookList.appendChild(li);
    }
  });
}

// Clear form fields
function clearForm() {
  document.getElementById('book-title').value = '';
  document.getElementById('book-author').value = '';
  document.getElementById('book-isbn').value = '';
  document.getElementById('book-id').value = '';
}

populateAuthorFilter();
updateBookList();
