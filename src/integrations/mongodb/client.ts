// LocalStorage-based MongoDB simulation for browser compatibility
// This will be replaced with actual MongoDB backend API calls

// Generate unique IDs
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// LocalStorage collections
const getLocalStorageCollection = (collectionName: string) => {
  const key = `mongodb_${collectionName}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setLocalStorageCollection = (collectionName: string, data: any[]) => {
  const key = `mongodb_${collectionName}`;
  localStorage.setItem(key, JSON.stringify(data));
};

// Simulate MongoDB collections
export const getCollections = () => {
  return {
    users: {
      find: (query: any) => {
        const data = getLocalStorageCollection('users');
        if (query._id) {
          return data.find((item: any) => item._id === query._id);
        }
        if (query.email) {
          return data.find((item: any) => item.email === query.email);
        }
        return data;
      },
      findOne: (query: any) => {
        const data = getLocalStorageCollection('users');
        if (query._id) {
          return data.find((item: any) => item._id === query._id);
        }
        if (query.email) {
          return data.find((item: any) => item.email === query.email);
        }
        return null;
      },
      insertOne: (doc: any) => {
        const data = getLocalStorageCollection('users');
        const newDoc = { ...doc, _id: generateId() };
        data.push(newDoc);
        setLocalStorageCollection('users', data);
        return { insertedId: newDoc._id };
      },
      findOneAndUpdate: (query: any, update: any, options: any) => {
        const data = getLocalStorageCollection('users');
        const index = data.findIndex((item: any) => item._id === query._id);
        if (index !== -1) {
          data[index] = { ...data[index], ...update.$set };
          setLocalStorageCollection('users', data);
          return data[index];
        }
        return null;
      },
      deleteOne: (query: any) => {
        const data = getLocalStorageCollection('users');
        const index = data.findIndex((item: any) => item._id === query._id);
        if (index !== -1) {
          data.splice(index, 1);
          setLocalStorageCollection('users', data);
          return { deletedCount: 1 };
        }
        return { deletedCount: 0 };
      }
    },
    portfolios: {
      find: (query: any) => {
        const data = getLocalStorageCollection('portfolios');
        if (query.user_id) {
          return data.filter((item: any) => item.user_id === query.user_id);
        }
        return data;
      },
      findOne: (query: any) => {
        const data = getLocalStorageCollection('portfolios');
        return data.find((item: any) => item._id === query._id);
      },
      insertOne: (doc: any) => {
        const data = getLocalStorageCollection('portfolios');
        const newDoc = { ...doc, _id: generateId() };
        data.push(newDoc);
        setLocalStorageCollection('portfolios', data);
        return { insertedId: newDoc._id };
      },
      findOneAndUpdate: (query: any, update: any, options: any) => {
        const data = getLocalStorageCollection('portfolios');
        const index = data.findIndex((item: any) => item._id === query._id);
        if (index !== -1) {
          data[index] = { ...data[index], ...update.$set };
          setLocalStorageCollection('portfolios', data);
          return data[index];
        }
        return null;
      },
      deleteOne: (query: any) => {
        const data = getLocalStorageCollection('portfolios');
        const index = data.findIndex((item: any) => item._id === query._id);
        if (index !== -1) {
          data.splice(index, 1);
          setLocalStorageCollection('portfolios', data);
          return { deletedCount: 1 };
        }
        return { deletedCount: 0 };
      }
    },
    watchlists: {
      find: (query: any) => {
        const data = getLocalStorageCollection('watchlists');
        if (query.user_id) {
          return data.filter((item: any) => item.user_id === query.user_id);
        }
        return data;
      },
      findOne: (query: any) => {
        const data = getLocalStorageCollection('watchlists');
        if (query.user_id && query.coin_id) {
          return data.find((item: any) => item.user_id === query.user_id && item.coin_id === query.coin_id);
        }
        return data.find((item: any) => item._id === query._id);
      },
      insertOne: (doc: any) => {
        const data = getLocalStorageCollection('watchlists');
        const newDoc = { ...doc, _id: generateId() };
        data.push(newDoc);
        setLocalStorageCollection('watchlists', data);
        return { insertedId: newDoc._id };
      },
      deleteOne: (query: any) => {
        const data = getLocalStorageCollection('watchlists');
        const index = data.findIndex((item: any) => item._id === query._id);
        if (index !== -1) {
          data.splice(index, 1);
          setLocalStorageCollection('watchlists', data);
          return { deletedCount: 1 };
        }
        return { deletedCount: 0 };
      }
    },
    alerts: {
      find: (query: any) => {
        const data = getLocalStorageCollection('alerts');
        if (query.user_id) {
          return data.filter((item: any) => item.user_id === query.user_id);
        }
        return data;
      },
      findOne: (query: any) => {
        const data = getLocalStorageCollection('alerts');
        return data.find((item: any) => item._id === query._id);
      },
      insertOne: (doc: any) => {
        const data = getLocalStorageCollection('alerts');
        const newDoc = { ...doc, _id: generateId() };
        data.push(newDoc);
        setLocalStorageCollection('alerts', data);
        return { insertedId: newDoc._id };
      },
      findOneAndUpdate: (query: any, update: any, options: any) => {
        const data = getLocalStorageCollection('alerts');
        const index = data.findIndex((item: any) => item._id === query._id);
        if (index !== -1) {
          data[index] = { ...data[index], ...update.$set };
          setLocalStorageCollection('alerts', data);
          return data[index];
        }
        return null;
      },
      deleteOne: (query: any) => {
        const data = getLocalStorageCollection('alerts');
        const index = data.findIndex((item: any) => item._id === query._id);
        if (index !== -1) {
          data.splice(index, 1);
          setLocalStorageCollection('alerts', data);
          return { deletedCount: 1 };
        }
        return { deletedCount: 0 };
      }
    },
    transactions: {
      find: (query: any) => {
        const data = getLocalStorageCollection('transactions');
        if (query.user_id) {
          return data.filter((item: any) => item.user_id === query.user_id);
        }
        return data;
      },
      findOne: (query: any) => {
        const data = getLocalStorageCollection('transactions');
        return data.find((item: any) => item._id === query._id);
      },
      insertOne: (doc: any) => {
        const data = getLocalStorageCollection('transactions');
        const newDoc = { ...doc, _id: generateId() };
        data.push(newDoc);
        setLocalStorageCollection('transactions', data);
        return { insertedId: newDoc._id };
      }
    }
  };
};

// Connect to MongoDB (simulated)
export const connectToMongoDB = async () => {
  return Promise.resolve();
};

// Disconnect from MongoDB (simulated)
export const disconnectFromMongoDB = async () => {
  return Promise.resolve();
}; 