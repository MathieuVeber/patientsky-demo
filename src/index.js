const dayjs = require("dayjs");
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");

const { importCalendars } = require("./import");
const { calendarsIntersection } = require("./slots/intersection");
const { getFilteredSlotsByCalendar } = require("./slots/filterTimeSlots");
const { getAvailableSlots } = require("./slots/filterAppointements");

const DATADIRPATH = "./data";

function findAvailableTime(calendarIds, duration, period) {
  dayjs.extend(isSameOrAfter);
  dayjs.extend(isSameOrBefore);

  // 0 - Import data (as if it came from DB)
  const { appointments, timeSlots } = importCalendars(DATADIRPATH);

  // 1 - Filter time slots by period, duration and calendarId
  // and order them by dates and group by calendarId
  const orderedCalendarsSlots = getFilteredSlotsByCalendar(
    calendarIds,
    duration,
    period,
    timeSlots
  );

  // 2 - Get the intersection of calendars
  const calendarSlotsIntersection = calendarsIntersection(
    orderedCalendarsSlots,
    duration
  );

  // 3 - Substract appointments to get available slots
  const availableSlots = getAvailableSlots(
    calendarIds,
    duration,
    period,
    calendarSlotsIntersection,
    appointments
  );

  // 4 - Print available slots (consider this as the result of an API request)
  console.log(
    `\n${availableSlots.length} available slots
    - for a ${duration} minutes meeting
    - with ${calendarIds}
    - between ${period.start.toISOString()} and ${period.end.toISOString()}\n`
  );

  availableSlots.forEach((slot) =>
    console.log({
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
    })
  );

  return availableSlots;
}

module.exports = findAvailableTime;
