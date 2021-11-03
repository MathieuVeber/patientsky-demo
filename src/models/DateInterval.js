const dayjs = require("dayjs");

class DateInterval {
  start;
  end;

  /**
   *
   * @param {string} interval Format: < ISO8601 > / < ISO8601 >
   */
  constructor(interval) {
    const [start, end] = interval.split("/");
    this.start = dayjs(start);
    this.end = dayjs(end);
  }
}

module.exports = DateInterval;
