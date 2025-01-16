import Book from "../models/bookModel.js";

// Create a new book
export const createBook = async (req, res) => {
  const { title, author, isbn, readStatus, userRating, notes } = req.body;
  const userId = req.user?.id; // Assuming req.user contains the authenticated user's information

  // Validate the input data before creating the book
  if (!title || !author || !isbn) {
    return res
      .status(400)
      .json({ message: "Please provide title, author, and isbn" });
  }

  // Check if the book already exists
  const existingBook = await Book.findOne({ where: { isbn } });
  if (existingBook) {
    return res
      .status(400)
      .json({ message: "Book with the same isbn already exists" });
  }

  //check if the userId is available in
  if (!userId) {
    return res.status(401).json({ message: "Please login to create a book" });
  }

  try {
    const newBook = await Book.create({
      title,
      author,
      isbn,
      readStatus,
      userRating,
      notes,
      userId,
    });

    res
      .status(201)
      .json({ message: "Book created successfully", book: newBook });
  } catch (error) {
    console.error("Error creating book:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the book", error });
  }
};

// Get all books for a user
export const getAllBooks = async (req, res) => {
  const userId = req.user?.id; // Assuming req.user contains the authenticated user's information

  if (!userId) {
    return res.status(401).json({ message: "Please login to create a book" });
  }

  try {
    const books = await Book.findAll({ where: { userId: userId } });
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the books", error });
  }
};

// Get a single book by ID
export const getBookById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id; // Assuming req.user contains the authenticated user's information

  if (!userId) {
    return res.status(401).json({ message: "Please login to create a book" });
  }

  try {
    const book = await Book.findOne({ where: { id, userId: userId } });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the book", error });
  }
};

// Update a book by ID
export const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, readStatus, userRating, notes } = req.body;

  const userId = req.user?.id; // Assuming req.user contains the authenticated user's information

  if (!userId) {
    return res.status(401).json({ message: "Please login to create a book" });
  }

  try {
    const book = await Book.findOne({ where: { id, userId: userId } });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.title = title;
    book.author = author;
    book.isbn = isbn;
    book.readStatus = readStatus;
    book.userRating = userRating;
    book.notes = notes;

    await book.save();
    res.status(200).json({ message: "Book updated successfully", book });
  } catch (error) {
    console.error("Error updating book:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the book", error });
  }
};

// Delete a book by ID
export const deleteBook = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id; // Assuming req.user contains the authenticated user's information

  if (!userId) {
    return res.status(401).json({ message: "Please login to create a book" });
  }

  try {
    const book = await Book.findOne({ where: { id, userId: userId } });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await book.destroy();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the book", error });
  }
};
