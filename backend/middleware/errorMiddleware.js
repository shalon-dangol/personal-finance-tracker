export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  // Duplicate key (e.g., category {user,name} unique index)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    res.status(400);
    return res.json({ message: `${field} already exists`, stack: process.env.NODE_ENV === 'production' ? null : err.stack });
  }
  // Mongoose CastError (invalid ObjectId not caught by validation)
  if (err.name === 'CastError') {
    res.status(400);
    return res.json({ message: `Invalid ${err.path}: ${err.value}`, stack: process.env.NODE_ENV === 'production' ? null : err.stack });
  }
  const statusCode = err.status || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
