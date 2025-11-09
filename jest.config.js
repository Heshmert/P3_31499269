const { pathsToModuleNameMapper } = require('ts-jest');

module.exports = {
  moduleNameMapper: {
    '^@controllers/(.*)$': '<rootDir>/controllers/$1',
    '^@models/(.*)$': '<rootDir>/models/$1',
    '^@middleware/(.*)$': '<rootDir>/middleware/$1',
    '^@routes/(.*)$': '<rootDir>/routes/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@orm/(.*)$': '<rootDir>/prisma/$1',
    '^@repositories/(.*)$': '<rootDir>/repositories/$1',
    '^@services/(.*)$': '<rootDir>/services/$1'
  }
};