export const getDistanceInMeters = (
  coord1: { latitude: number; longitude: number },
  coord2: { latitude: number; longitude: number }
) => {
  const toRad = (v: number) => (v * Math.PI) / 180;

  if (
    !coord1 || !coord2 ||
    !isFinite(coord1.latitude) || !isFinite(coord1.longitude) ||
    !isFinite(coord2.latitude) || !isFinite(coord2.longitude)
  ) return 0;

  const R = 6371e3; // meters
  const φ1 = toRad(coord1.latitude);
  const φ2 = toRad(coord2.latitude);
  const Δφ = toRad(coord2.latitude - coord1.latitude);
  const Δλ = toRad(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
