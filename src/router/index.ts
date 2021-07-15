import Router from 'koa-router';

import { updateMenuList } from '../manager';

export const router = new Router();

router.post('/update', updateMenuList);
