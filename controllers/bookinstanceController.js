const BookInstance = require("../models/bookinstance");
const { body, validationResult } = require("express-validator");
const Book = require("../models/book");

// Display list of all BookInstances.
exports.bookinstance_list = async (req, res, next) => {
  const allBookInstance = await BookInstance.find().populate("book").exec();

  res.render("bookinstance_list", {
    title: "Book Instance List",
    bookinstance_list: allBookInstance,
  });
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = async (req, res, next) => {
  const bookInstance = await BookInstance.findById(req.params.id)
    .populate("book")
    .exec();

  if (bookInstance === null) {
    // No results.
    const err = new Error("Book copy not found");
    err.status = 404;
    return next(err);
  }

  res.render("bookinstance_detail", {
    title: "Book: ",
    bookinstance: bookInstance,
  });
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = async (req, res, next) => {
  const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();

  res.render("bookinstance_form", {
    title: "Create BookInstance",
    book_list: allBooks,
  });
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
  // Validate and sanitize fields.
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a BookInstanceobject with escaped and trimmed data.
    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allBooks = (await Book.find({}, "title"))
        .toSorted({ title: 1 })
        .exec();

      res.render("bookInstance_form", {
        title: "Create BookInstance",
        book_list: allBooks,
        selected_book: bookInstance.book_id,
        errors: errors.array(),
        bookInstance: bookInstance,
      });
      return;
    }

    // Data from form is valid
    await bookInstance.save();
    res.redirect(bookInstance.url);
  },
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = async (req, res, next) => {
  const copies = await BookInstance.findById(req.params.id)
    .populate("book")
    .exec();

  if (copies === null) {
    // No results. Redirect to book list.
    res.redirect("/catalog/books");
    return;
  }

  res.render("bookinstance_delete", {
    title: "Delete Book Copies",
    copies,
  });
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = async (req, res, next) => {
  const copies = await BookInstance.findById(req.params.id)
    .populate("book")
    .exec();

  if (copies === null) {
    // Nothing to delete. Redirect to book list.
    res.redirect("/catalog/books");
    return;
  }

  // Delete the specific book instance and render the associated book's detail template.
  await BookInstance.findByIdAndDelete(req.params.id);
  // Redirect to the associated book's detail page if available.
  if (copies.book && copies.book._id) {
    res.redirect(`/catalog/book/${copies.book._id}`);
  } else {
    // Fallback: redirect to book list if no associated book
    res.redirect("/catalog/books");
  }
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = async (req, res, next) => {
  // Get book, authors, and genres for form.
  const [copies, allBooks] = await Promise.all([
    BookInstance.findById(req.params.id).populate("book").exec(),
    Book.find({}, "title").sort({ title: 1 }).exec(),
  ]);

  if (copies === null) {
    //No results
    const err = new Error("Copies not found");
    err.status = 404;
    return next(err);
  }

  // Mark our selected status as checked
  allBooks.forEach((copy) => {
    if (copies.book === copy._id) copy.checked = "true";
  });

  res.render("bookinstance_form", {
    title: "Update Book Copy",
    copies,
    book_list: allBooks,
  });
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = [
  // Convert the status to an array.
  (req, res, next) => {
    if (typeof req.body.status === "undefined") {
      req.body.status = "";
    }
    next();
  },

  // Validate and sanitize fields.
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a BookInstanceobject with escaped and trimmed data.
    const bookInstance = new BookInstance({
      _id: req.params.id,
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      // Get copies and book title for form.
      const [copies, allBooks] = await Promise.all([
        BookInstance.findById(req.params.id).populate("book").exec(),
        Book.find({}, "title").sort({ title: 1 }).exec(),
      ]);

      if (copies === null) {
        //No results
        const err = new Error("Copies not found");
        err.status = 404;
        return next(err);
      }

      // Mark our selected status as checked
      allBooks.forEach((copy) => {
        if (copies.book && copies.book._id.toString() === copy._id.toString()) {
          copy.checked = "true";
        }
      });

      res.render("bookinstance_form", {
        title: "Update Book Copy",
        copies,
        book_list: allBooks,
      });
      return;
    }

    // Data from form is valid. Update the record.
    const updatedCopies = await BookInstance.findByIdAndUpdate(
      req.params.id,
      bookInstance,
      { new: true },
    );
    // Redirect to book detail page.
    res.redirect(updatedCopies.url);
  },
];
