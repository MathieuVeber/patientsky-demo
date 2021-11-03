const SlotTree = require("../models/SlotTree");
const compareSlots = require("./compare");

function getFilteredSlotsByCalendar(calendarIds, minDuration, period, slots) {
  let calendarsById = {};
  for (const calendarId of calendarIds) {
    calendarsById[calendarId] = new SlotTree();
  }

  calendarsById = slots.reduce((result, slot) => {
    // 1 - Slot must belong to one of the calendars
    if (!calendarIds.includes(slot.calendarId)) {
      return result;
    }

    // 2 - Slot must coincide with (or at least overlap) the period
    const comparison = compareSlots(slot, period);

    if (comparison.noOverlap) {
      return result;
    }

    // 3 - Slot is adjusted to the period if necessary
    const slotToAppend = slot;
    if (comparison.slotAStartsBeforeSlotB) {
      slotToAppend.start = period.start;
    }
    if (!comparison.slotAEndsBeforeSlotB) {
      slotToAppend.end = period.end;
    }

    // 4 - Slot is ordered in a binary tree according to its calendarId
    result[slot.calendarId].append(slotToAppend);

    return result;
  }, calendarsById);

  const calendarsArray = calendarIds.map((calendarId) =>
    calendarsById[calendarId]
      // 5 - Slots in juxtaposition are merged
      .flatAndConcat()
      // 6 - Remaining slots must be long enough
      .filter(
        (slot) => Math.abs(slot.start.diff(slot.end, "minute")) >= minDuration
      )
  );

  // 7 - Calendars are ordered by number of slots
  return calendarsArray.sort((a, b) => a.length - b.length);
}

module.exports = { getFilteredSlotsByCalendar };
