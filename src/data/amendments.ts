import { Amendment } from '../types';

export const amendments: Amendment[] = [
  {
    id: 'fix-nftoken-dir-v1',
    name: 'fixNFTokenDirV1',
    summary: 'Corrects edge-case errors in NFToken directory pagination logic',
    tier: 'A',
    performanceImpact: 'Low',
    clarity: 'High',
    waitingDays: 21,
    plainEnglishExplanation: 'This amendment fixes a bug where NFToken directories could become corrupted in rare circumstances when tokens are created and deleted rapidly. The fix ensures directory entries are properly ordered and prevents orphaned references.',
    whoThisHelps: {
      categories: ['Builders', 'Exchanges/Liquidity', 'Public Infrastructure'],
      explanation: 'Improves reliability for NFT marketplaces and applications that handle high-volume token operations.',
      examples: ['NFT marketplaces', 'Gaming platforms', 'Collectible services']
    },
    ledgerImpact: {
      estimatedImpact: 'Low',
      confidence: 'High',
      affectedAreas: ['CPU', 'Disk IO'],
      rationale: 'Adds a single validation check during NFToken operations. Benchmarks show negligible impact (<0.1% CPU overhead).',
      evidenceLinks: [
        { label: 'Performance Analysis PR', url: 'https://github.com/XRPLF/rippled/pull/4567' }
      ]
    },
    whatChanged: 'Initial review available. No changes since last check.',
    estimatedReviewMinutes: 5,
    references: [
      { label: 'Amendment Proposal', url: 'https://github.com/XRPLF/rippled/pull/4567', type: 'github' },
      { label: 'Technical Specification', url: 'https://xrpl.org/amendments.html#fixnftokendirv1', type: 'documentation' }
    ],
    tag: 'safe_to_ignore',
    validatorSupport: {
      current: 28,
      required: 35
    }
  },
  {
    id: 'clawback',
    name: 'Clawback',
    summary: 'Enables token issuers to reclaim tokens from holder accounts when enabled at issuance',
    tier: 'B',
    performanceImpact: 'Low',
    clarity: 'High',
    waitingDays: 45,
    plainEnglishExplanation: 'Allows token issuers to optionally enable clawback functionality when creating tokens. If enabled, the issuer can reclaim tokens from any holder. This is an opt-in feature at token creation time only.',
    whoThisHelps: {
      categories: ['Enterprise', 'Security/Stability', 'Builders'],
      explanation: 'Enables compliant stablecoin implementations and regulated asset tokenization.',
      examples: ['Regulated stablecoins', 'Security tokens', 'Compliance-focused issuers']
    },
    ledgerImpact: {
      estimatedImpact: 'Low',
      confidence: 'High',
      affectedAreas: ['CPU'],
      rationale: 'Adds a flag check during token transfers. Only affects tokens with clawback enabled.',
      evidenceLinks: [
        { label: 'Implementation PR', url: 'https://github.com/XRPLF/rippled/pull/4553', type: 'github' }
      ]
    },
    estimatedReviewMinutes: 15,
    references: [
      { label: 'XLS-39d Specification', url: 'https://github.com/XRPLF/XRPL-Standards/discussions/94', type: 'discussion' },
      { label: 'Documentation', url: 'https://xrpl.org/clawback.html', type: 'documentation' }
    ],
    tag: 'no_change',
    validatorSupport: {
      current: 32,
      required: 35
    }
  },
  {
    id: 'amm',
    name: 'AMM',
    summary: 'Introduces native automated market maker functionality to the XRP Ledger',
    tier: 'B',
    performanceImpact: 'Medium',
    clarity: 'High',
    waitingDays: 67,
    plainEnglishExplanation: 'Adds built-in liquidity pools directly to the ledger, allowing users to provide liquidity and swap tokens through constant-product market makers. AMM pools exist alongside the order book.',
    whoThisHelps: {
      categories: ['Exchanges/Liquidity', 'Builders', 'Public Infrastructure'],
      explanation: 'Enables decentralized liquidity provision and more efficient token swaps.',
      examples: ['DEX aggregators', 'Liquidity providers', 'Token projects']
    },
    ledgerImpact: {
      estimatedImpact: 'Medium',
      confidence: 'Medium',
      affectedAreas: ['CPU', 'Memory', 'Disk IO'],
      rationale: 'New ledger object type and transaction types. Pathfinding complexity increases. Extensive testing shows acceptable performance under load.',
      evidenceLinks: [
        { label: 'Performance Report', url: 'https://github.com/XRPLF/rippled/pull/4294', type: 'analysis' }
      ]
    },
    whatChanged: 'Audit completed. Documentation updated with edge case handling.',
    estimatedReviewMinutes: 30,
    references: [
      { label: 'XLS-30d Specification', url: 'https://github.com/XRPLF/XRPL-Standards/discussions/78', type: 'discussion' },
      { label: 'Implementation', url: 'https://github.com/XRPLF/rippled/pull/4294', type: 'github' },
      { label: 'AMM Documentation', url: 'https://xrpl.org/amm.html', type: 'documentation' }
    ],
    tag: 'updated',
    validatorSupport: {
      current: 34,
      required: 35
    }
  },
  {
    id: 'fix-reduce-fee',
    name: 'fixReducedOffersV1',
    summary: 'Fixes rounding errors in offer crossing when dealing with very small amounts',
    tier: 'A',
    performanceImpact: 'Low',
    clarity: 'High',
    waitingDays: 14,
    plainEnglishExplanation: 'Corrects a calculation error where very small offers could result in incorrect amounts being transferred due to rounding. This is a pure bug fix with no behavioral changes for normal transactions.',
    whoThisHelps: {
      categories: ['Security/Stability', 'Exchanges/Liquidity', 'Public Infrastructure'],
      explanation: 'Ensures accurate accounting for all transactions, particularly micro-transactions.',
      examples: ['High-frequency trading', 'Micro-payment systems']
    },
    ledgerImpact: {
      estimatedImpact: 'Low',
      confidence: 'High',
      affectedAreas: ['CPU'],
      rationale: 'Replaces one rounding function with another. No measurable performance difference.',
      evidenceLinks: []
    },
    estimatedReviewMinutes: 5,
    references: [
      { label: 'Bug Report', url: 'https://github.com/XRPLF/rippled/issues/4590', type: 'github' },
      { label: 'Fix Implementation', url: 'https://github.com/XRPLF/rippled/pull/4591', type: 'github' }
    ],
    tag: 'new',
    validatorSupport: {
      current: 22,
      required: 35
    }
  },
  {
    id: 'xchain-bridge',
    name: 'XChainBridge',
    summary: 'Enables native cross-chain bridges between XRPL and sidechains',
    tier: 'C',
    performanceImpact: 'Medium',
    clarity: 'Medium',
    waitingDays: 30,
    plainEnglishExplanation: 'Introduces infrastructure for creating bridges between the main XRPL network and sidechains. Allows assets to be locked on one chain and released on another through a decentralized attestation system.',
    whoThisHelps: {
      categories: ['Builders', 'Enterprise', 'Public Infrastructure'],
      explanation: 'Enables new sidechain deployments and cross-chain asset transfers.',
      examples: ['Sidechain operators', 'Cross-chain applications', 'Enterprise deployments']
    },
    ledgerImpact: {
      estimatedImpact: 'Medium',
      confidence: 'Medium',
      affectedAreas: ['CPU', 'Memory', 'Network'],
      rationale: 'Adds new ledger objects and transaction types. Bridge operations require witness server coordination.',
      evidenceLinks: [
        { label: 'Architecture Overview', url: 'https://github.com/XRPLF/rippled/pull/4300', type: 'documentation' }
      ]
    },
    estimatedReviewMinutes: 45,
    references: [
      { label: 'XLS-38d Specification', url: 'https://github.com/XRPLF/XRPL-Standards/discussions/92', type: 'discussion' },
      { label: 'Implementation', url: 'https://github.com/XRPLF/rippled/pull/4300', type: 'github' }
    ],
    tag: 'no_change',
    validatorSupport: {
      current: 18,
      required: 35
    }
  },
  {
    id: 'did',
    name: 'DID',
    summary: 'Adds decentralized identifier (DID) support to XRPL accounts',
    tier: 'C',
    performanceImpact: 'Low',
    clarity: 'Medium',
    waitingDays: 12,
    plainEnglishExplanation: 'Enables accounts to store W3C-compliant Decentralized Identifier documents on the ledger. DIDs provide a standardized way to establish verifiable digital identity.',
    whoThisHelps: {
      categories: ['Builders', 'Enterprise', 'Public Infrastructure'],
      explanation: 'Supports identity verification use cases and credential issuance.',
      examples: ['Identity providers', 'KYC services', 'Credential issuers']
    },
    ledgerImpact: {
      estimatedImpact: 'Low',
      confidence: 'High',
      affectedAreas: ['Disk IO'],
      rationale: 'Adds optional DID object to accounts. Only affects accounts that explicitly create DID entries.',
      evidenceLinks: []
    },
    estimatedReviewMinutes: 20,
    references: [
      { label: 'XLS-40d Specification', url: 'https://github.com/XRPLF/XRPL-Standards/discussions/95', type: 'discussion' },
      { label: 'W3C DID Standard', url: 'https://www.w3.org/TR/did-core/', type: 'documentation' }
    ],
    tag: 'new',
    validatorSupport: {
      current: 15,
      required: 35
    }
  },
  {
    id: 'price-oracle',
    name: 'PriceOracle',
    summary: 'Native price oracle infrastructure for on-chain price feeds',
    tier: 'B',
    performanceImpact: 'Low',
    clarity: 'High',
    waitingDays: 8,
    plainEnglishExplanation: 'Allows designated oracle providers to publish price data directly on the ledger. Applications can read aggregated price feeds without relying on external services.',
    whoThisHelps: {
      categories: ['Builders', 'Exchanges/Liquidity', 'Enterprise'],
      explanation: 'Enables DeFi applications that require reliable on-chain price data.',
      examples: ['Lending protocols', 'Derivatives', 'Stablecoin mechanisms']
    },
    ledgerImpact: {
      estimatedImpact: 'Low',
      confidence: 'High',
      affectedAreas: ['Disk IO', 'CPU'],
      rationale: 'Price objects are small and updates are infrequent. Aggregation is computed on read.',
      evidenceLinks: [
        { label: 'Benchmark Results', url: 'https://github.com/XRPLF/rippled/pull/4789', type: 'analysis' }
      ]
    },
    estimatedReviewMinutes: 15,
    references: [
      { label: 'XLS-47d Specification', url: 'https://github.com/XRPLF/XRPL-Standards/discussions/120', type: 'discussion' },
      { label: 'Implementation', url: 'https://github.com/XRPLF/rippled/pull/4789', type: 'github' }
    ],
    tag: 'new',
    validatorSupport: {
      current: 12,
      required: 35
    }
  }
];

export const getAmendmentById = (id: string): Amendment | undefined => {
  return amendments.find(a => a.id === id);
};

export const getAmendmentsByTier = (tier: 'A' | 'B' | 'C'): Amendment[] => {
  return amendments.filter(a => a.tier === tier);
};

export const getFixOnlyAmendments = (): Amendment[] => {
  return amendments.filter(a => a.tier === 'A' && a.performanceImpact === 'Low');
};

export const getNearThresholdAmendments = (): Amendment[] => {
  return amendments.filter(a => a.validatorSupport.required - a.validatorSupport.current <= 3);
};

export const getTotalValidators = (): number => {
  return 35; // Current XRPL validator set for simplicity
};
