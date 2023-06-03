import { getDb } from '../migrations-utils/db';

export const up = async () => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const db = await getDb();
  return db
    .collection('users')
    .updateMany({}, { $set: { isEnabledTwoFactorAuth: false } });
};

export const down = async () => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const db = await getDb();
};
