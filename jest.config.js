/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
 preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  // "globals": {
  //   "ts-jest": {
  //     "useESM": true
  //   }
  // },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  // moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  // moduleDirectories: ['node_modules', 'src'],
};
