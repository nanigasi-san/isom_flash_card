import symbolMap from "./isom-symbol-map.json";

const svgModules = import.meta.glob("../../ISOM/*.svg", {
  eager: true,
  import: "default",
});

function parseSymbolPath(filePath, assetUrl) {
  const fileName = filePath.split("/").pop();
  const match = fileName.match(/^([0-9]+(?:\.[0-9]+)?)_(.+)\.svg$/i);

  if (!match) {
    throw new Error(`Unexpected ISOM asset name: ${filePath}`);
  }

  const number = match[1];
  const mapping = symbolMap[number];

  if (!mapping) {
    throw new Error(`Missing symbol mapping for ${number}`);
  }

  return {
    id: number,
    number,
    englishName: mapping.englishName,
    japaneseName: mapping.japaneseName,
    svgPath: assetUrl,
  };
}

function compareNumbers(left, right) {
  const leftParts = left.number.split(".").map(Number);
  const rightParts = right.number.split(".").map(Number);
  const maxLength = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const leftValue = leftParts[index] ?? 0;
    const rightValue = rightParts[index] ?? 0;

    if (leftValue !== rightValue) {
      return leftValue - rightValue;
    }
  }

  return 0;
}

export const isomItems = Object.entries(svgModules)
  .map(([filePath, assetUrl]) => parseSymbolPath(filePath, assetUrl))
  .sort(compareNumbers);

export const uniqueJapaneseNames = Array.from(
  new Set(isomItems.map((item) => item.japaneseName))
);

const itemsByJapaneseName = isomItems.reduce((groups, item) => {
  if (!groups.has(item.japaneseName)) {
    groups.set(item.japaneseName, []);
  }

  groups.get(item.japaneseName).push(item);
  return groups;
}, new Map());

export function findUniqueItemByJapaneseName(name) {
  if (!name) {
    return null;
  }

  const matchedItems = itemsByJapaneseName.get(name) ?? [];
  return matchedItems.length === 1 ? matchedItems[0] : null;
}
