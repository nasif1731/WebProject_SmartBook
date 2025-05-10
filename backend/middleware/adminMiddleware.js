// middleware/adminMiddleware.js

exports.admin = (req, res, next) => {
    // Check if the user is authenticated and if the user is an admin
    if (req.user && req.user.isAdmin) {
      return next();  // Continue to the next middleware or route handler
    } else {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  };
  