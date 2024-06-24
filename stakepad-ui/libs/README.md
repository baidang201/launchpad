# Folder structure

```
─── libs
    │
    ├── apis/           API calls to the backend server
    │   └── proto           Protobuf utility functions and Typescript typings
    │
    ├── extrinsics/     Substrate extrinsics
    │
    ├── polkadot/       Polkadot.js-related files
    │   ├── hooks/          useApiPromise and useWeb3 hooks
    │   ├── interfaces/     Auto-generated typings for extrinsics, queries and types
    │   └── augment.d.ts    Helper to imports typings globally
    │
    ├── queries/        react-query wrappers of API and Substrate queries
    │
    └── README.md
```
