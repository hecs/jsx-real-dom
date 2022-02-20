const hashQueue = {};
const requestCache = {};

let cache: CacheHandler = {
    get: (key, cb) => {
        cb(null, requestCache[key]);
    },
    set: (key, data) => {
        requestCache[key] = data;
    },
};

type CacheHandler = {
    get: (key: string, callback) => any;
    set: (key: string, data: any) => any;
};

export const setCacheHandler = (handler: CacheHandler) => {
    cache = handler;
};

const setCacheValue = (cacheKey) => (response) => {
    cache.set(cacheKey, response);
    return response;
};

const runQueue = (key, prop) => (data) => {
    hashQueue[key].map((o) => o[prop](data));
    delete hashQueue[key];
    return data;
};

// const resolveQueue = (key) => (data) => {
//     hashQueue[key].map(({ resolve }) => resolve(data));
//     delete hashQueue[key];
//     return data;
// };

// const rejectQueue = (key) => (error) => {
//     hashQueue[key].map(({ reject }) => reject(error));
//     delete hashQueue[key];
//     return error;
// };

export const cachedPromise = (cacheKey, internalQuery) =>
    new Promise((resolve, reject) => {
        cache.get(cacheKey, (err, data) => {
            if (!err && data) {
                resolve(data);
            } else {
                const isFirst = !hashQueue[cacheKey],
                    q = { resolve, reject };
                if (isFirst) {
                    hashQueue[cacheKey] = [q];
                } else {
                    hashQueue[cacheKey].push(q);
                }
                if (isFirst) {
                    internalQuery()
                        .then(setCacheValue(cacheKey))
                        .then(runQueue(cacheKey, "resolve"))
                        .catch(runQueue(cacheKey, "reject"));
                }
            }
        });
    });
