import Application from 'koa';

export const validateRequestBody = (
  ctx: Application.ParameterizedContext,
  next: Application.Next
) => {
  if (
    typeof ctx.request.body === 'string' ||
    !ctx.request.body?.username ||
    !ctx.request.body?.menuList
  ) {
    ctx.throw(400, 'Request body must contain "username" and "menuList" properties');
  }

  next();
};
