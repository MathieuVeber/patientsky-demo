const path = require("path");
const fs = require("fs");

const Appointment = require("./models/Appointment");
const TimeSlot = require("./models/TimeSlot");

function importCalendars(relativePath) {
  let appointments = [];
  let timeSlots = [];

  const fullPath = path.join(process.cwd(), relativePath);

  let calendarNames;
  try {
    calendarNames = fs.readdirSync(fullPath);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  const calendars = calendarNames.map((file) =>
    require(path.join(process.cwd(), relativePath, file))
  );

  for (const calendar of calendars) {
    const { appointments: calendarAppointments, timeSlots: calendarTimeSlots } =
      importCalendar(calendar);
    appointments = [...appointments, ...calendarAppointments];
    timeSlots = [...timeSlots, ...calendarTimeSlots];
  }

  return { appointments, timeSlots };
}

function importCalendar(calendar) {
  const appointments = [];
  const timeSlots = [];

  for (const appointment of calendar.appointments) {
    appointments.push(
      new Appointment(
        appointment.id,
        appointment.calendar_id,
        appointment.start,
        appointment.end
      )
    );
  }

  for (const timeSlot of calendar.timeslots) {
    timeSlots.push(
      new TimeSlot(
        timeSlot.id,
        timeSlot.calendar_id,
        timeSlot.start,
        timeSlot.end
      )
    );
  }

  return { appointments, timeSlots };
}

module.exports = { importCalendars };
