import { Router } from 'express';
import controller from '../controller';
const router = Router();

export default  (app) => {
  app.use('/', router);

  router.post('/api/quotation', controller.quotationConroller.quotation);
  
};
