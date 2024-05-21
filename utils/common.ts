export const sortArrayByDate = <T extends { date: string }>(array: T[]): T[] => {
  const copy = array.slice();
  return copy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
