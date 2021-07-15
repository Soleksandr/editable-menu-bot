import { createClient } from 'redis';
import { IUserData } from '../../entities';

const redis = createClient();

redis.on('error', function (error) {
  console.error(error);
});

redis.on('ready', function () {
  console.log('-- REDIS CONNECTED --');
});

export const set = async <T extends {}>(key: string, data: T) => {
  const existedData = await get(key);
  const newData = existedData ? { ...existedData, ...data } : data;

  redis.set(key, JSON.stringify(newData));
};

export const get = (key: string): Promise<IUserData | null> => {
  return new Promise((resolve, reject) => {
    redis.get(key, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const parsedData = data ? JSON.parse(data) : null;

      resolve(parsedData);
    });
  });
};
