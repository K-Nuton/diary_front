
export default class DiaryBody {
  private inner_user_id: number;
  private text: string | null;
  private fromDate: Date | null;
  private toDate: Date | null;

  constructor(inner_user_id: number, text: string | null, fromDate: Date | null, toDate: Date | null) {
    this.inner_user_id = inner_user_id;
    this.text = text;
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  public toString(): string {
    const result: any = {
      inner_user_id: this.inner_user_id
    }
    this.text ? result.text = this.text : void(0);
    
    if (this.fromDate) {
      result.date = this.encodeDate(this.fromDate, false);
      result.end_date = this.encodeDate((this.toDate || this.fromDate), true);
    }

    return JSON.stringify(result);
  }

  private encodeDate(date: Date, to: boolean): string {
    date.setHours(to ? 23 : 0);
    date.setMinutes(to ? 59 : 0);
    date.setSeconds(to ? 59 : 0);

    return (
      date.getFullYear() + '-' + 
        this.zeroPadding(date.getMonth() + 1) + '-' + 
        this.zeroPadding(date.getDate()) + 'T' +
        this.zeroPadding(date.getHours()) + ':' +
        this.zeroPadding(date.getMinutes()) + ':' +
        this.zeroPadding(date.getSeconds()) + '.0'
    );
  }

  private zeroPadding(num: number): string {
    return ('0' + num).slice(-2);
  }
}