import { Tables } from '@/db/schema'

export const insertInto = (tableName: keyof Tables) => {
  let str = `INSERT INTO ${tableName} `
  let colArray: string[] = []
  let valArray: (string | number)[] = []
  function colVal(colVals: [string, string | number]) {
    colArray.push(colVals[0])
    valArray.push(colVals[1])
    return { colVal, end }
  }
  function end() {
    str += `(`
    str += colArray.join(', ')
    str += `) VALUES (`
    str += valArray.map((val) => (typeof val === 'string' ? `'${val}'` : val)).join(', ')
    str += `);`
    return str
  }

  return { colVal }
}
export const errorMsg = (e: any) => {
  if (typeof e === 'string') {
    return e
  }
  return `Unknown Error`
}
