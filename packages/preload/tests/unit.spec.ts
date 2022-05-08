import {createHash} from 'crypto';
import {afterEach, expect, test, vi} from 'vitest';


const exposeInMainWorldMock = vi.fn();
vi.mock('electron', () => ({
  contextBridge: {exposeInMainWorld: exposeInMainWorldMock},
}));


afterEach(() => {
  vi.clearAllMocks();
});


test('versions', async () => {
  await import('../src/versions');
  expect(exposeInMainWorldMock).toBeCalledTimes(1);
  expect(exposeInMainWorldMock).lastCalledWith('versions', process.versions);
});


test('nodeCrypto', async () => {
  await import('../src/nodeCrypto');
  expect(exposeInMainWorldMock).toBeCalledTimes(1);
  expect(exposeInMainWorldMock.mock.calls[0][0]).toBe('nodeCrypto');
  expect(exposeInMainWorldMock.mock.calls[0][1]).toHaveProperty('sha1');
  expect(exposeInMainWorldMock.mock.calls[0][1]).toHaveProperty('sha256');
  expect(exposeInMainWorldMock.mock.calls[0][1]).toHaveProperty('md5');
  expect(exposeInMainWorldMock.mock.calls[0][1]).toHaveProperty('base64url');

  const data = 'rawData';
  const expectedHash = createHash('sha256')
    .update(data)
    .digest('hex');

  expect(exposeInMainWorldMock.mock.calls[0][1].sha256(data)).toBe(expectedHash);
});

test('nodeFormatter', async () => {
  await import('../src/formatter');
  expect(exposeInMainWorldMock).toBeCalledTimes(1);
  expect(exposeInMainWorldMock.mock.calls[0][0]).toBe('nodeFormatter');
  expect(exposeInMainWorldMock.mock.calls[0][1]).toHaveProperty('beautifyHTML');
  expect(exposeInMainWorldMock.mock.calls[0][1]).toHaveProperty('beautifyCSS');
  expect(exposeInMainWorldMock.mock.calls[0][1]).toHaveProperty('beautifyJS');
  expect(exposeInMainWorldMock.mock.calls[0][1]).toHaveProperty('minifyHTML');
  expect(exposeInMainWorldMock.mock.calls[0][1]).toHaveProperty('minifyCSS');
  expect(exposeInMainWorldMock.mock.calls[0][1]).toHaveProperty('minifyJS');
});
