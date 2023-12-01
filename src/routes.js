// Controllers
const UserController = require('./controllers/UserController');
const TransactionController = require('./controllers/TransactionController');

// Middleware
const AuthMiddleware = require('./middlewares/AuthMiddleware');

module.exports = function(app) {
    // User routes
    app.post('/auth/register', UserController.register);
    app.post('/auth/login', UserController.login);
    app.post('/auth/me', AuthMiddleware.isAuth, UserController.me);
    app.post('/user/:id', AuthMiddleware.isAdmin, UserController.update);
    app.delete('/user/:id', AuthMiddleware.isAdmin, UserController.destroy);

    // Transaction routes
    app.post('/transaction/give/:id', AuthMiddleware.isAuth, TransactionController.give);
    app.post('/transaction/store', AuthMiddleware.isAuth, TransactionController.store);
    app.post('/transaction/take/:id', AuthMiddleware.isAuth, TransactionController.take);

    // Default route
    app.get('*', (req, res) => {
        res.status(404).json({ success: false, message: 'Not Found' });
    });
};