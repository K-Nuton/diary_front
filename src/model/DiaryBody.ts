import encodeDate from '../utils/TimeUtils';

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

  private get isEmpty(): boolean {
    if (this.text) return false;
    if (this.fromDate) return false;
    return true;
  }

  public toString(): string {
    const result: any = {
      inner_user_id: this.inner_user_id
    }

    if (this.isEmpty) {
      result.text = '_%_';
      return JSON.stringify(result);
    }

    this.text ? result.text = this.text : void(0);
    
    if (this.fromDate) {
      result.date = encodeDate(this.fixDate(this.fromDate, true));
      result.end_date = encodeDate(this.fixDate((this.toDate || this.fromDate), false))
    }

    return JSON.stringify(result);
  }

  private fixDate(date: Date, begin: boolean): Date {
    date.setHours(begin ? 0 : 23);
    date.setMinutes(begin ? 0 : 59);
    date.setSeconds(begin ? 0 : 59);

    return date;
  }

  private zeroPadding(num: number): string {
    return ('0' + num).slice(-2);
  }
}