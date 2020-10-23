
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

function zeroPadding(num: number): string {
  return ('0' + num).slice(-2);
}