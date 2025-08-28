import { ColumnBlueprint, Tables } from "../schema"



export const insertInto = <T extends Record<string, ColumnBlueprint>>(tableName: keyof Tables, tableBlueprint: T) => {
    let str = `INSERT INTO ${tableName} `
    let colArray: (keyof T)[] = []
    let valArray: (string | number)[] = []
    function colVal(colVals: [keyof T, string | number]) {
      colArray.push(colVals[0])
      valArray.push(colVals[1])
      return {colVal, end}
    }
    function end() {
      str += `(`
      str += colArray.join(', ')
      str += `) VALUES (`
      str += valArray.map(val => typeof val === 'string' ? `'${val}'` : val).join(', ')
      str += `);`
      return str
    }
    
    return {colVal}
  }