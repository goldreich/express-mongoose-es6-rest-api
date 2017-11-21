import express from 'express';
import expressJwt from 'express-jwt';
import validate from 'express-validation';
import userCtrl from '../controllers/user.controller';
import config from '../../config/config';
import paramValidation from '../../config/param-validation';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** POST /api/users - Create new user (Free)*/
  .post(validate(paramValidation.createUser), userCtrl.create)

  /** GET /api/users - Get list of users (Auth required) */
  .get(expressJwt({ secret: config.jwtSecret }), userCtrl.list)

  /** DELETE /api/users - Delete authorized user account. (Auth required)*/
  .delete(expressJwt({ secret: config.jwtSecret }), userCtrl.remove);

router.route('/:userId')
  /** GET /api/users/:userId - Get user (Auth required)*/
  .get(expressJwt({ secret: config.jwtSecret }), userCtrl.get);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

export default router;
