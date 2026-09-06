export interface CategoryAccent {
  bg: string;
  fg: string;
}

const CATEGORY_ACCENTS: readonly CategoryAccent[] = [
  { bg: "#EDE9FB", fg: "#7C5CFC" },
  { bg: "#FEF3D6", fg: "#C98A0B" },
  { bg: "#FBE3E1", fg: "#E2574C" },
  { bg: "#DFF0EA", fg: "#2F8F76" },
  { bg: "#E8EEDD", fg: "#6B7B4F" },
] as const;

export function getCategoryAccent(categoryId: string): CategoryAccent {
  let hash = 0;
  for (let i = 0; i < categoryId.length; i++) {
    hash = (hash * 31 + categoryId.charCodeAt(i)) >>> 0;
  }
  return CATEGORY_ACCENTS[hash % CATEGORY_ACCENTS.length];
}