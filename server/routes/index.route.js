import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import userRoutes from './user.route';
import authRoutes from './auth.route';

const swaggerDocument = YAML.load('./server/swagger.yaml');
const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

if (process.env.NODE_ENV === 'development') {
  // mount swagger docs
  router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

export default router;
