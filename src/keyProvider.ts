export function getRootKey(index: number): string {
  return `code-segment-${index}`;
}
export function getDescendantKey(parentKey: string, index: number): string {
  return `${parentKey}-${index}`;
}

export function keyIsNextSibling(rootKey: string, key: string): boolean {
  const rootParts = rootKey.split('-');
  const potentialSiblingParts = key.split('-');
  let isSibling = true;
  if (rootParts.length === potentialSiblingParts.length) {
    for (let i = 0; i < rootParts.length - 1; i += 1) {
      if (rootParts[i] !== potentialSiblingParts[i]) {
        isSibling = false;
        break;
      }
    }
    if (
      Number.parseInt(rootParts[rootParts.length - 1], 10) !==
      Number.parseInt(potentialSiblingParts[rootParts.length - 1], 10) - 1
    ) {
      isSibling = false;
    }
  } else {
    isSibling = false;
  }
  return isSibling;
}
