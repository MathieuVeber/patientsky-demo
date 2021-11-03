const dayjs = require("dayjs");

class Appointment {
  id;
  calendarId;
  start;
  end;

  constructor(id, calendarId, start, end) {
    this.id = id;
    this.calendarId = calendarId;
    this.start = dayjs(start);
    this.end = dayjs(end);
  }
}

module.exports = Appointment;
