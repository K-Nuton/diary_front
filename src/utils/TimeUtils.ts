
export default function encodeDate(date: Date) {
  return (
    date.getFullYear() + '-' + 
        zeroPadding(date.getMonth() + 1) + '-' + 
        zeroPadding(date.getDate()) + 'T' +
        zeroPadding(date.getHours()) + ':' +
        zeroPadding(date.getMinutes()) + ':' +
        zeroPadding(date.getSeconds()) + '.0'
  );
}

export function fixDate(date: Date, begin: boolean): Date {
  const result = new Date(date);

  result.setHours(begin ? 0 : 23);
  result.setMinutes(begin ? 0 : 59);
  result.setSeconds(begin ? 0 : 59);

  return result;
}

function zeroPadding(num: number): string {
  return ('0' + num).slice(-2);
}