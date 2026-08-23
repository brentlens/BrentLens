export const convertToDecimal = (val: string | number): string => {
  return Number(val).toFixed(2);
};

export const priceFormatter = (val:string ):string => {
  if(val.includes('-')) return `-$${convertToDecimal(val)}`
  return `+$${convertToDecimal(val)}`
}

export const percentFormatter = (val:string ):string => {
  if(val.includes('-')) return `-${convertToDecimal(val)}%`
  return `+${convertToDecimal(val)}%`
}