import httpStatus from 'http-status';
import User from '../models/user.model';
import APIError from '../helpers/APIError';

/**
 * Preload user by id and append to req.preloadedUser.
 * it's convenient in building CRUD API.
 */
function load(req, res, next, id) {
  User.findById(id)
  .then((user) => {
    if (user) {
      req.preloadedUser = { // eslint-disable-line no-param-reassign
        id: user.id,
        login: user.login,
        createdAt: user.createdAt
      };
    } else {
      const err = new APIError('Not Found', httpStatus.NOT_FOUND, true);
      return next(err);
    }
    return next();
  })
  .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.preloadedUser);
}

/**
 * Create new user
 * @property {string} req.body.login - The login of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  const login = req.body.login.trim();
  const user = new User({
    login: req.body.login,
    password: req.body.password
  });

  User.findOne({ login }).then((userExist) => {
    if (userExist) {
      const err = new APIError('User already exist', httpStatus.CONFLICT, true);
      return next(err);
    }
    return user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
  })
  .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.login - The login of user.
 * @property {string} req.body.password - The password of user.
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.user;
  user.login = req.body.login;
  user.password = req.body.password;

  user.save()
  .then(savedUser => res.json(savedUser))
  .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;

  User.list({ limit, skip })
    .then((users) => {
      const userList = users.map(user => ({
        id: user.id,
        login: user.login,
        createdAt: user.createdAt
      }));
      res.json(userList);
    })
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user; // JWT authorized user

  User.findByIdAndRemove(user.id)
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
