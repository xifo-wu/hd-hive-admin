const searchParamsToObj = (searchParams: URLSearchParams) => {
  const object: Record<string, string> = {};
  for (const [key, value] of searchParams) {
    object[key] = value;
  }

  return object;
};

export default searchParamsToObj;
