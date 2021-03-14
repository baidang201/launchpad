
import {api} from "../config/index.js"
import Router from "koa-router"

const router = new Router();

router.prefix(api.prefix + api.version + '/workers')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a workers response!'
})

export default router;
