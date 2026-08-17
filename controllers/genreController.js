const Genre = require("../models/genre");
const Book = require("../models/book");
const { body, validationResult } = require("express-validator");

// Display list of all Genre.
exports.genre_list = async (req, res, next) => {
  const allGenre = await Genre.find().sort({ name: 1 }).exec();
  res.render("genre", {
    title: "Genre List",
    genre_list: allGenre,
  });
};

// Display detail page for a specific Genre.
exports.genre_detail = async (req, res, next) => {
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);

  if (genre === null) {
    // No results.
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("genre_detail", {
    title: "Genre Detail",
    genre,
    genre_books: booksInGenre,
  });
};

// Display Genre create form on GET.
exports.genre_create_get = async (req, res, next) => {
  res.render("genre_form", { title: "Create Genre " });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization
  async (req, res, next) => {
    //Extract thevalidation errors from a request.
    const errors = validationResult(req);

    //Create a genre object with escaped and trimmed data.
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/ error messages.
      res.render("genre_form", {
        title: "Create Genre",
        genre,
        errors: errors.array(),
      });
      return;
    }

    // Data from form is valid.
    // Check if Genre with same name already exists.

    const genreExists = await Genre.findOne({ name: req.body.name })
      .collation({ locale: "en", strength: 2 })
      .exec();
    if (genreExists) {
      // Genre exists, redirect to its detail page.
      res.redirect(genreExists.url);
      return;
    }

    // New genre. Save and redirect to its detail page.
    await genre.save();
    res.redirect(genre.url);
  },
];

// Display Genre delete form on GET.
exports.genre_delete_get = async (req, res, next) => {
  const [genre, allBooksbyGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);

  if (genre === null) {
    // No results. Redirect to genre list.
    res.redirect("/catalog/genres");
    return;
  }

  res.render("genre_delete", {
    title: "Delete Genre List",
    genre,
    allBooksbyGenre,
  });
};

// Handle Genre delete on POST.
exports.genre_delete_post = async (req, res, next) => {
  const [genre, allBooksbyGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);

  if (genre === null) {
    // Nothing to delete. Redirect to book list.
    res.redirect("/catalog/genres");
    return;
  }

  // Delete the specific genre and render the associated genre's detail template.
  await Genre.findByIdAndDelete(req.params.id);
  // Fallback: redirect to book list if no associated book
  res.redirect("/catalog/genres");
};

// Display Genre update form on GET.
exports.genre_update_get = async (req, res, next) => {
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);

  if (genre === null) {
    // No results.
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("genre_form", {
    title: "Update Genre",
    genre,
    genre_books: booksInGenre,
  });
};

// Handle Genre update on POST.
exports.genre_update_post = [
  // Validate and sanitize fields.
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization
  async (req, res, next) => {
    //Extract thevalidation errors from a request.
    const errors = validationResult(req);

    //Create a genre object with escaped and trimmed data.
    const genre_update = { name: req.body.name };

    if (!errors.isEmpty()) {
      // Get all books and genres for form
      const [genre, booksInGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({ genre: req.params.id }, "title summary").exec(),
      ]);

      if (genre === null) {
        //No results
        const err = new Error("Genre not found");
        err.status = 404;
        return next(err);
      }

      res.render("genre_form", {
        title: "Update Genre",
        genre,
        genre_books: booksInGenre,
      });
      return;
    }

    // Data from form is valid.
    // Check if Genre with same name already exists.

    const genreExists = await Genre.findOne({ name: req.body.name })
      .collation({ locale: "en", strength: 2 })
      .exec();
    if (genreExists) {
      // Genre exists, redirect to its detail page.
      res.redirect(genreExists.url);
      return;
    }

    // Data from form is valid. Update the record.
    const updatedGenre = await Genre.findByIdAndUpdate(
      req.params.id,
      genre_update,
      {},
    );
    // Redirect to book detail page.
    res.redirect(updatedGenre.url);
  },
];
