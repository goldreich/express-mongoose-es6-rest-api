import Joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      login: Joi.string().required(),
      password: Joi.string().min(6).required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      login: Joi.string().required(),
      password: Joi.string().required()
    }
  },
};
