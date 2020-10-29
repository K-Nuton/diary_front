import { RawDiary, Diary } from '../model/Diary';
import encodeDate, { fixDate } from './TimeUtils';

export type SearchResponse = {
  diaries: RawDiary[]
};
export default class DiaryAPI {
  private static URI = '../web_diary/';
  private static DIARY = 'diary/';
  private static SEARCH = 'search/';

  private static POST = 'POST';
  private static PUT = 'PUT';
  private static DELETE = 'DELETE';

  private static HEADERS = {
    'Content-Type': 'application/json'
  };

  public static async search(
    inner_user_id: number, 
    searchInput: string | null, 
    fromDate: Date | null, 
    toDate: Date | null
  ): Promise<{
    diaries: Diary[],
    original: SearchResponse
  }> {

    let date: Date | null;
    let end_date: Date | null;
    if (fromDate && toDate) {
      date = fixDate(fromDate, true);
      end_date = fixDate(toDate, false);
    } else if (fromDate && !toDate) {
      date = fixDate(fromDate, true);
      end_date = fixDate(fromDate, false);
    } else {
      date = null;
      end_date = null;
    }

    if (!fromDate && !toDate && !searchInput) return { diaries: [], original: { diaries: [] } };

    const body = {
      inner_user_id,
      text: searchInput,
      date: date && encodeDate(date),
      end_date: end_date && encodeDate(end_date)
    };

    const res = await fetch(
      `${this.URI}${this.SEARCH}`,
      {
        method: this.POST,
        headers: this.HEADERS,
        body: this.stringifyBody(body)
      }
    );

    if (!res.ok) throw new Error(res.statusText);

    const json: SearchResponse = await res.json();

    return {
      diaries: json.diaries.map(this.encodeRaw2Diary).reverse(),
      original: json
    };
  }

  public static async insert(
    inner_user_id: number,
    date: Date,
    wheather: number,
    feeling: number,
    text: string
  ): Promise<Diary> {
    const res = await fetch(
      `${this.URI}${this.DIARY}`,
      {
        method: this.POST,
        headers: this.HEADERS,
        body: this.stringifyBody({
          inner_user_id,
          date: encodeDate(date),
          wheather,
          feeling,
          text
        })
      }
    );

    if (!res.ok) throw new Error(res.statusText);

    return (await res.json()) as Diary;
  }

  public static async update(
    diary_id: number,
    date: Date | null,
    wheather: number | null,
    feeling: number | null,
    text: string | null
  ): Promise<Diary> {
    
    const body = {
      diary_id,
      date: date && encodeDate(date),
      wheather,
      feeling,
      text
    };

    const res = await fetch(
      `${this.URI}${this.DIARY}`,
      {
        method: this.PUT,
        headers: this.HEADERS,
        body: this.stringifyBody(body)
      }
    );

    if (!res.ok) throw new Error(res.statusText);

    return (await res.json()) as Diary;
  }

  public static async delete(diary_id: number): Promise<void> {
    const res = await fetch(
      `${this.URI}${this.DIARY}${diary_id}`,
      { method: this.DELETE }
    );

    if (!res.ok) throw new Error(res.statusText);
  }

  private static stringifyBody(body: any): string {
    return JSON.stringify(body, (_, v) => v != null ? v : undefined);
  }

  private static encodeRaw2Diary({ 
    inner_user_id,
    diary_id,
    date,
    update_date,
    wheather,
    feeling,
    text
   }: RawDiary): Diary {
    return {
      inner_user_id,
      diary_id,
      date: new Date(date),
      update_date: new Date(update_date),
      wheather,
      feeling,
      text
    };
  }
}