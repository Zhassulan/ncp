import {DatePipe} from '@angular/common';

export class Utils {

  static dateToLocalString(dt: string): string {
    const pipe = new DatePipe('ru-RU');
    return pipe.transform(new Date(dt)).toString();
  }

  static toLocalDate(dt: string): string {
    const pipe = new DatePipe('ru-RU');
    return pipe.transform(new Date(dt));
  }

  static removeRepeatedSpaces(str): string {
    return str.replace(/\s\s+/g, ' ');
  }

  /*  static getMd5(strVal) {
      const md5 = new Md5();
      md5.appendStr(strVal);
      /!*
      .appendAsciiStr('a different string')
      .appendByteArray(blob);
      *!/
      // Generate the MD5 hex string

      return md5.end().toString();
    }*/

  static millsToDateStr(mills) {
    return new Date(mills).toLocaleString('ru').replace(',', '');
  }

  static jsonPretty(data) {
    return JSON.stringify(data, undefined, 3);
  }

  static getTodayStartTime(): Date {
    const res = new Date();
    res.setHours(0, 0, 0, 0);
    return res;
  }

  static getTodayEndTime(): Date {
    const res = new Date();
    res.setHours(23, 59, 59, 999);
    return res;
  }

}
