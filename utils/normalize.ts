export const normalizeMoney = (input: string) => {
  let output = input.trim();
  output = output.replace(/^d[^\d]+/, '');
  output = output.replace(/\s/g, '');
  output = output.replace(/,/g, '.');
  return parseFloat(output).toFixed(2);
};
