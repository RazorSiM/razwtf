import { format } from 'date-fns'

export function formatDate(date: Date | number, formatStr: string = 'MMMM d, yyyy'): string {
  return format(date, formatStr)
}
