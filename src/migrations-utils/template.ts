import { getDb } from '../migrations-utils/db';

export const up = async () => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const db = await getDb();
  /*
      Code your update script here!
   */
};

export const down = async () => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const db = await getDb();
  /*
      Code you downgrade script here!
   */
};
