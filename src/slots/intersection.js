const compareSlots = require("./compare");

function calendarsIntersection(calendars, minDuration = 0) {
  if (calendars.length < 1) {
    return [];
  } else if (calendars.length === 1) {
    return calendars[0];
  }

  let intersection = calendars[0];
  let calendarIndex = 1;
  while (intersection.length > 0 && calendarIndex < calendars.length) {
    intersection = slotsIntersection(
      intersection,
      calendars[calendarIndex],
      minDuration
    );
    calendarIndex += 1;
  }

  return intersection;
}

function slotsIntersection(calendarA, calendarB, minDuration = 0) {
  const slotIntersection = [];
  let indexA = 0;
  let indexB = 0;
  while (indexA < calendarA.length && indexB < calendarB.length) {
    const comparison = compareSlots(calendarA[indexA], calendarB[indexB]);

    // 1 - When they don't overlap, which slot is before the other?
    if (comparison.noOverlap) {
      if (comparison.slotAIsAfterSlotB) {
        indexB += 1;
      } else {
        indexA += 1;
      }
    }
    // 2 - We must adjust the available slot to each calendar constraints
    else {
      const availableSlot = calendarA[indexA];

      if (comparison.slotAStartsBeforeSlotB) {
        availableSlot.start = calendarB[indexB].start;
      }

      // 3 - Which slot ends first?
      if (comparison.slotAEndsBeforeSlotB) {
        indexA += 1;
      } else {
        availableSlot.end = calendarB[indexB].end;
        indexB += 1;
      }

      // 4 - Does the slot is long enough?
      const slotDuration = Math.abs(
        availableSlot.start.diff(availableSlot.end, "minute")
      );
      if (slotDuration >= minDuration) {
        slotIntersection.push(availableSlot);
      }
    }
  }

  return slotIntersection;
}

module.exports = { calendarsIntersection };
