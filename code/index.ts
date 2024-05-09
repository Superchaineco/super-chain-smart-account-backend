const { ethers } = require('ethers');
const {
  DefenderRelaySigner,
  DefenderRelayProvider,
} = require('defender-relay-client/lib/ethers');

const FactoryABI = [
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_components',
        type: 'address[]',
      },
      {
        internalType: 'int256[]',
        name: '_units',
        type: 'int256[]',
      },
      {
        internalType: 'address',
        name: '_manager',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_symbol',
        type: 'string',
      },
    ],
    name: 'create',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_vToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_manager',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_symbol',
        type: 'string',
      },
    ],
    name: 'NewVaultCreated',
    type: 'event',
  },
];
const VerifierABI = [
  { inputs: [], name: 'EC_SCALAR_MUL_FAILURE', type: 'error' },
  { inputs: [], name: 'MOD_EXP_FAILURE', type: 'error' },
  { inputs: [], name: 'PROOF_FAILURE', type: 'error' },
  {
    inputs: [
      { internalType: 'uint256', name: 'expected', type: 'uint256' },
      { internalType: 'uint256', name: 'actual', type: 'uint256' },
    ],
    name: 'PUBLIC_INPUT_COUNT_INVALID',
    type: 'error',
  },
  { inputs: [], name: 'PUBLIC_INPUT_GE_P', type: 'error' },
  { inputs: [], name: 'PUBLIC_INPUT_INVALID_BN128_G1_POINT', type: 'error' },
  {
    inputs: [],
    name: 'getVerificationKeyHash',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes', name: '_proof', type: 'bytes' },
      { internalType: 'bytes32[]', name: '_publicInputs', type: 'bytes32[]' },
    ],
    name: 'verify',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
];

exports.handler = async function (payload) {
  const verifierAddress = '0x53783878377fead9323973f5617fE634105Ca484';
  const factoryAddress = '0x8b7c857DBDf3139F7A0df44a147a2c5E35420dd3';
  const zkProof = '0x';
  const provider = new DefenderRelayProvider(payload);
  const signer = new DefenderRelaySigner(payload, provider, { speed: 'fast' });
  const body = payload.request.body;
  const verifier = new ethers.Contract(verifierAddress, VerifierABI, signer);

  const token = new ethers.Contract(
    body.transaction.to,
    body.monitor.abi,
    signer
  );

  try {
    const components = await token.getComponents();
    let totalValue = ethers.BigNumber.from(0);

    // Sum values of componentPositions
    for (const component of components) {
      const positionValue = await token.componentPositions(component);
      totalValue = totalValue.add(positionValue);
    }

    const verify = verifier.verify(zkProof, [
      ethers.zeroPadValue(totalValue, 32),
    ]);
    if (!verify) throw new Error('Invalid Proof');
  } catch (e) {
    const tx = await token.pause();
    return { tx, message: 'paused' };
  }

  return { message: 'ok' };
};
