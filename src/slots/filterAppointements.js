const compareSlots = require("./compare");

function getAvailableSlots(
  calendarIds,
  minDuration,
  period,
  slots,
  appointments
) {
  if (slots.length < 1) {
    return [];
  }

  const appointmentMapping = {};

  // 1 - Look for appointment of interest
  for (const appointment of appointments) {
    if (
      calendarIds.includes(appointment.calendarId) &&
      !compareSlots(appointment, period).noOverlap
    ) {
      // 2 - Make a list of impacted slots
      const busySlots = dichotomousFindSlot(slots, appointment);
      for (const slotIndex of busySlots) {
        if (!appointmentMapping[slotIndex]) {
          appointmentMapping[slotIndex] = [];
        }
        appointmentMapping[slotIndex].push(appointment);
      }
    }
  }

  // 3 - Look at busy slots and handle them
  return slots.reduce(
    (result, slot, index) => [
      ...result,
      ...handleBusySlot(slot, minDuration, appointmentMapping[index]),
    ],
    []
  );
}

function handleBusySlot(slot, minDuration, appointments = []) {
  // Case 1 - No appointments
  if (appointments.length < 1) {
    return [slot];
  }

  const comparison = compareSlots(slot, appointments[0]);

  // Case 2 - Slot is not busy
  if (comparison.noOverlap) {
    return handleBusySlot(slot, minDuration, appointments.slice(1));
  }
  // Case 3 - Slot is full busy
  else if (
    !comparison.slotAStartsBeforeSlotB &&
    comparison.slotAEndsBeforeSlotB
  ) {
    return [];
  }

  // Case 4 - Appointment starts late enough
  const enoughTimeBeforeAppointment =
    comparison.slotAStartsBeforeSlotB &&
    Math.abs(slot.start.diff(appointments[0].start, "minute")) >= minDuration;

  const slotsBeforeAppointment = enoughTimeBeforeAppointment
    ? handleBusySlot(
        { ...slot, end: appointments[0].start },
        minDuration,
        appointments.slice[1]
      )
    : [];

  // Case 5 - Appointment ends soon enough
  const enoughTimeAfterAppointment =
    !comparison.slotAEndsBeforeSlotB &&
    Math.abs(appointments[0].end.diff(slot.end, "minute")) >= minDuration;

  const slotsAfterAppointment = enoughTimeAfterAppointment
    ? handleBusySlot(
        { ...slot, start: appointments[0].end },
        minDuration,
        appointments.slice[1]
      )
    : [];

  return [...slotsBeforeAppointment, ...slotsAfterAppointment];
}

function dichotomousFindSlot(
  slots,
  appointment,
  min = 0,
  max = slots.length - 1
) {
  if (slots.length < 1) {
    return [];
  }

  const mid = Math.floor((min + max) / 2);
  const comparison = compareSlots(appointment, slots[mid]);

  if (comparison.noOverlap) {
    return comparison.slotAIsAfterSlotB
      ? dichotomousFindSlot(slots, appointment, mid + 1, max)
      : dichotomousFindSlot(slots, appointment, min, mid - 1);
  }

  // At least the current slot is impacted
  const slotsFound = [mid];

  // Look for impacted slots before this one...
  let previousIndex = mid - 1;
  let appointmentStartsBeforeSlot = comparison.slotAStartsBeforeSlotB;
  while (appointmentStartsBeforeSlot && previousIndex >= 0) {
    if (appointment.start.isBefore(slots[previousIndex].end)) {
      slotsFound.push(previousIndex);
    }
    appointmentStartsBeforeSlot = appointment.start.isBefore(
      slots[previousIndex].start
    );
    previousIndex -= 1;
  }

  // ...and after it
  let nextIndex = mid + 1;
  let appointementEndsAfterSlot = !comparison.slotAEndsBeforeSlotB;
  while (appointementEndsAfterSlot && nextIndex < slots.length) {
    if (appointment.end.isAfter(slots[nextIndex].start)) {
      slotsFound.push(nextIndex);
    }
    appointementEndsAfterSlot = appointment.end.isAfter(slots[nextIndex].end);
    nextIndex += 1;
  }

  return slotsFound;
}

module.exports = { getAvailableSlots };
