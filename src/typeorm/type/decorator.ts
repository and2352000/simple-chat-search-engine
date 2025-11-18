import { Column, type ValueTransformer } from 'typeorm'

import moment from 'moment'
export const timeTransformer: ValueTransformer = {

  from: (value: Date) => value ? moment(value).format('x') : null,
  to: (value: string | Date) => {
    if (!value) return
    if (value instanceof Date) return value
    return moment(value, 'x').toDate()
  }

}

export function TimestampColumn (opts?: { defaultTime?: string }): PropertyDecorator {
  return Column({ transformer: timeTransformer })
}
