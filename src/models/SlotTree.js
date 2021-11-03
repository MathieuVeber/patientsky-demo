class SlotTree {
  length = 0;
  root;

  constructor() {}

  append(slot) {
    if (this.root) {
      let previousNode;
      let currentNode = this.root;
      let mustGoDeeper = true;

      while (mustGoDeeper) {
        if (slot.start.isSameOrAfter(currentNode.slot.end)) {
          if (currentNode.afterNode) {
            previousNode = currentNode;
            currentNode = currentNode.afterNode;
          } else {
            currentNode.afterNode = new SlotNode(slot, previousNode);
            mustGoDeeper = false;
          }
        } else if (slot.end.isSameOrBefore(currentNode.slot.start)) {
          if (currentNode.beforeNode) {
            previousNode = currentNode;
            currentNode = currentNode.beforeNode;
          } else {
            currentNode.beforeNode = new SlotNode(slot, previousNode);
            mustGoDeeper = false;
          }
        }
      }
    } else {
      this.root = new SlotNode(slot, undefined);
    }
    this.length += 1;
  }

  flatAndConcat() {
    if (!this.root) {
      return [];
    }
    const slots = this.root.flat();

    return slots.reduce((result, slot, index) => {
      if (
        index === 0 ||
        slot.start.diff(result[result.length - 1].end, "minute") !== 0
      ) {
        result.push(slot);
      } else {
        result[result.length - 1].end = slot.end;
      }
      return result;
    }, []);
  }
}

class SlotNode {
  parentNode;
  beforeNode;
  afterNode;
  slot;

  constructor(slot, parentNode) {
    this.slot = slot;
    this.parentNode = parentNode;
  }

  flat() {
    return [
      ...(this.beforeNode ? this.beforeNode.flat() : []),
      this.slot,
      ...(this.afterNode ? this.afterNode.flat() : []),
    ];
  }
}

module.exports = SlotTree;
