/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
export function midnight(dt) {
  const mt = new Date(dt);
  const utcHours = mt.getUTCHours();
  const delta = utcHours < 8 ? -16 : 8;
  mt.setUTCHours(0, 0, 0, 0); // midnight UTC
  mt.setHours(mt.getHours() + delta); // midnight PST today
  return mt;
};

export const midnightBefore = (dt) => {
  const my = new Date(dt);
  const utcHours = my.getUTCHours();
  const delta = utcHours < 8 ? -16 : 8;
  my.setUTCHours(0, 0, 0, 0); // midnight UTC
  my.setHours(my.getHours() + delta); // midnight PST today
  my.setDate(my.getDate() - 1);
  return my;
};

export function midnightToday() {
  return midnight(new Date());
};

export function midnightYesterday() {
  return midnightBefore(new Date());
};

export function  sevenDaysAgo() {
  const s = new Date();
  s.setDate(s.getDate() - 7);
  return s;
};

export function dateToStatsString(d) {
  const dt = d.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
  const dts = dt.split(',')[0].split('/');
  return `${dts[2]}-${dts[0].padStart(2, '0')}-${dts[1].padStart(2, '0')}`;
};
