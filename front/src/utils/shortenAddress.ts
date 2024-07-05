export function shortenAddress(address: string) {
  const firstPart = address.substring(0, 6);
  const lastPart = address.substring(address.length - 6);
  return `${firstPart}...${lastPart}`;
}
