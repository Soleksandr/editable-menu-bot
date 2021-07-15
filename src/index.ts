import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import { router } from './router';
import { validateRequestBody } from './middlewares';
import { initTelegramBot } from './bots/telegram';

require('dotenv').config();

const { TELEGRAM_BOT_TOKEN } = process.env;
const TOKEN_PASSED_IN_ARGV = process.argv[2];

initTelegramBot((TELEGRAM_BOT_TOKEN || TOKEN_PASSED_IN_ARGV) as string);

const app = new Koa();

app.use(bodyParser());
app.use(validateRequestBody);
app.use(router.routes());

app.listen(3000);
