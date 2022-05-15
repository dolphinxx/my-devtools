/* eslint-disable @typescript-eslint/consistent-type-imports */

interface Exposed {
  readonly nodeCrypto: Readonly<typeof import('./src/nodeCrypto').nodeCrypto>;
  readonly nodeFormatter: Readonly<typeof import('./src/nodeFormatter').nodeFormatter>;
  readonly versions: Readonly<typeof import('./src/versions').versions>;
  readonly systems: Readonly<typeof import('./src/systems').systems>;
  readonly tools: Readonly<typeof import('./src/tools').tools>;
}


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Window extends Exposed {}
