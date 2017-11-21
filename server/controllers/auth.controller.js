import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import User from '../models/user.model';

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  User.findOne({ login: req.body.login })
  .then((user) => {
    if (user) {
      if (req.body.login === user.login && req.body.password.trim() === user.password) {
        const payload = {
          id: user.id,
          login: user.login
        };
        const options = {
          expiresIn: '24h' // Number for seconds: 60, String for other: "2 days", "10h", "7d"
        };
        // https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
        const token = jwt.sign(payload, config.jwtSecret, options);

        return res.json({
          token,
          id: user.id,
          login: user.login
        });
      }
    }
    const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
    return next(err);
  })
  .catch(e => next(e));
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

export default { login, getRandomNumber };
