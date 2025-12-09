export const get = <T extends string | Record<string, any>>(
  arr: T[],
  key?: T extends string ? undefined : string
): (string | any)[] => {
  if (!Array.isArray(arr)) return [];

  if (typeof arr[0] === "string") {
    return arr as string[];
  }

  if (key) {
    return (arr as Record<string, any>[]).map(item => item[key]);
  }

  return arr ?? null;
};


export const getCount = <T extends string | Record<string, any>>(
  arr: T[],
  value?: string,
  key?: T extends string ? undefined : string
): number => {
  if(value) return get(arr).filter((item) => item[key] === value).length;
  return get(arr, key)?.length ?? 0;
};