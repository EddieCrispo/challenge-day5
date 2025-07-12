// Mock API simulation
export const mockAPI = {
  users: [
    { id: 1, email: 'demo@banktech.com', password: 'demo123', name: 'Alex Johnson', balance: 15420.50 },
    { id: 2, email: 'sarah@example.com', password: 'pass123', name: 'Sarah Wilson', balance: 8750.25 }
  ],
  
  transactions: [
    { id: 1, userId: 1, type: 'income', amount: 3200, description: 'Salary Deposit', category: 'salary', date: '2024-01-15', status: 'completed' },
    { id: 2, userId: 1, type: 'expense', amount: 850, description: 'Rent Payment', category: 'housing', date: '2024-01-14', status: 'completed' },
    { id: 3, userId: 1, type: 'expense', amount: 45.50, description: 'Grocery Shopping', category: 'food', date: '2024-01-13', status: 'completed' },
    { id: 4, userId: 1, type: 'income', amount: 150, description: 'Freelance Work', category: 'freelance', date: '2024-01-12', status: 'completed' },
    { id: 5, userId: 1, type: 'expense', amount: 25, description: 'Coffee Shop', category: 'food', date: '2024-01-11', status: 'completed' },
    { id: 6, userId: 1, type: 'transfer', amount: 500, description: 'Transfer to Savings', category: 'transfer', date: '2024-01-10', status: 'completed' }
  ],

  authenticate: (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockAPI.users.find(u => u.email === email && u.password === password);
        if (user) {
          resolve({ ...user, password: undefined });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  },

  register: (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = mockAPI.users.find(u => u.email === userData.email);
        if (existingUser) {
          reject(new Error('User already exists'));
        } else {
          const newUser = { 
            id: mockAPI.users.length + 1, 
            ...userData, 
            balance: 0 
          };
          mockAPI.users.push(newUser);
          resolve({ ...newUser, password: undefined });
        }
      }, 1000);
    });
  },

  getTransactions: (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userTransactions = mockAPI.transactions.filter(t => t.userId === userId);
        resolve(userTransactions);
      }, 500);
    });
  },

  addTransaction: (transaction) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTransaction = {
          id: mockAPI.transactions.length + 1,
          ...transaction,
          date: new Date().toISOString().split('T')[0],
          status: 'completed'
        };
        mockAPI.transactions.push(newTransaction);
        resolve(newTransaction);
      }, 500);
    });
  },

  updateUserBalance: (userId, newBalance) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userIndex = mockAPI.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
          mockAPI.users[userIndex].balance = newBalance;
          resolve(mockAPI.users[userIndex]);
        }
      }, 500);
    });
  }
};