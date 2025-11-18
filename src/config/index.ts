import 'dotenv/config'
import zod from 'zod'
const ENV = process.env
const config = {
  ...ENV,
  LOCAL_TEST: ENV.LOCAL_TEST === 'true',
  DEBUG_LOG: ENV.DEBUG_LOG === 'true',
  POSTGRES_PORT: ENV.POSTGRES_PORT &&  parseInt(ENV.POSTGRES_PORT),
}
const schema = zod.object({
    PORT: zod.string(),
    OPENAI_API_KEY: zod.string(),

    POSTGRES_HOST: zod.string(),
    POSTGRES_PORT: zod.number(),
    POSTGRES_USER: zod.string(),
    POSTGRES_PASSWORD: zod.string(),
    POSTGRES_DB: zod.string(),

    DEBUG_LOG: zod.boolean(),
})

const verifiedConfig = process.env.TEST_MODE === 'true' ? config : schema.parse(config)

export default verifiedConfig as typeof schema['_output']