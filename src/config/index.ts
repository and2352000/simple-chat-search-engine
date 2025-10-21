import 'dotenv/config'
import zod from 'zod'
const ENV = process.env
const config = {
  ...ENV,
  LOCAL_TEST: ENV.LOCAL_TEST === 'true'
}
const schema = zod.object({
    PORT: zod.string(),
    OPENAI_API_KEY: zod.string()
})

const verifiedConfig = process.env.TEST_MODE === 'true' ? config : schema.parse(config)

export default verifiedConfig as typeof schema['_output']