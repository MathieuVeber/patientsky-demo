function compareSlots(slotA, slotB) {
  const slotAIsAfterSlotB = slotA.start.isSameOrAfter(slotB.end);
  const slotAIsBeforeSlotB = slotAIsAfterSlotB
    ? false
    : slotA.end.isSameOrBefore(slotB.start);
  const noOverlap = slotAIsAfterSlotB || slotAIsBeforeSlotB;
  const slotAStartsBeforeSlotB = noOverlap
    ? null
    : slotA.start.isBefore(slotB.start);
  const slotAEndsBeforeSlotB = noOverlap ? null : slotA.end.isBefore(slotB.end);

  return {
    slotAIsAfterSlotB,
    slotAIsBeforeSlotB,
    noOverlap,
    slotAStartsBeforeSlotB,
    slotAEndsBeforeSlotB,
  };
}

module.exports = compareSlots;
