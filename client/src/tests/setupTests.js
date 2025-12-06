import '@testing-library/jest-dom';
const originalWarn = console.warn;

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation((...args) => {
    const msg = args[0];

    if (
      typeof msg === 'string' &&
      msg.includes('React Router Future Flag Warning')
    ) {
      return; // swallow these
    }

    originalWarn(...args);
  });
});

afterAll(() => {
  console.warn.mockRestore();
});