import Application from 'koa';

import { set } from '../services/redis';
import { IUpdateMenuListRequestBody } from '../types';

export const updateMenuList = (ctx: Application.ParameterizedContext) => {
  const { username, menuList } = ctx.request.body as unknown as IUpdateMenuListRequestBody;

  set(username, { menuList, activePage: 1 });

  ctx.body = 'OK';
};
