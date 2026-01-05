// XRPL Service - Fetches live data from the XRP Ledger
// Uses HTTP JSON-RPC API for browser compatibility

// Public XRPL JSON-RPC endpoints (HTTP, more reliable in browsers)
const MAINNET_RPC_ENDPOINTS = [
  'https://xrplcluster.com',
  'https://s1.ripple.com:51234',
  'https://s2.ripple.com:51234',
];

// Fallback public APIs
const XRPSCAN_API = 'https://api.xrpscan.com/api/v1';

export interface AmendmentInfo {
  id: string;
  name: string;
  enabled: boolean;
  supported: boolean;
  vetoed: boolean;
  count?: number;
  threshold?: number;
  validatorCount?: number;
}

export interface ValidatorInfo {
  publicKey: string;
  isOnUNL: boolean;
  isValidating: boolean;
  lastLedgerSequence?: number;
  domain?: string;
  amendments?: string[];
}

export interface NetworkInfo {
  ledgerIndex: number;
  validatorCount: number;
  quorum: number;
}

// Amendment names mapping (XRPL amendments are identified by hash)
const AMENDMENT_NAMES: Record<string, string> = {
  '42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE': 'fixReducedOffersV1',
  '4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373': 'MultiSign',
  '6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC': 'TrustSetAuth',
  '1562511F573A19AE9BD103B5D6B9E01B3B46805AEC5D3C4805C902B514399146': 'EnableAmendment',
  '08DE7D96082187F6E6578530258C77FABD8882931A30881F9F61E9606E9A0C8D': 'PayChan',
  '532651B4FD58DF8922A49BA101AB3E996E5BFBF95A913B3E392504863E63B164': 'TicketBatch',
  '30CD365592B8EE40489BA01AE2F7555CAC9C983145871DC82A42A31CF5BAE7D9': 'NonFungibleTokensV1_1',
  '75A7E01C505DD5A179DFE3E000A9B6F1EDDEB55A12F95579A23E15B15DC8BE5A': 'PriceOracle',
  'DC9CA96AEA1DCF83E527D1AFC916EFAF5D27388ECA4060A88817C1238CAEE0BF': 'AMM',
  'B4E4F5D2D6FB84DF7399960A732309C9FD530EAE5941838BF3D9C5E32C75E0F1': 'XChainBridge',
  '89308AF3B8B10B7192C4E613E1D2E4D9BA64B2EE2D5232402AE82A6A7220D953': 'Clawback',
  'D82EC1F28E47C7E6A74016C00E0BD6E9665EE5B210108D5D8D6B8092BE3E6FD1': 'fixNFTokenRemint',
  'CA4F696C54B7D94C4AB6D53A0D9B11FB16C9D2E8C0C10A8C80D44EFEF8F77D7A': 'fixNFTokenDirV1',
  '2CD5286D8D687E98B41102BDD797198E81EA41DF7BD104E6E9024A53E57E46CE': 'DID',
  '3012E8230864E95A58C60FD61430D7E1B4D3353195F2981DC12B0C7C0950FFAC': 'fixNFTokenPageLinks',
  'B2A4DB846F0891BF2C76AB2F2ACC8F5B4EC64437135C6E56F3C859BA2F2E2FDA': 'fixInnerObjTemplate',
  '586480873651E106F1D6339B0C4A8945BA705A777F3F4524626FF1FC07EFE41D': 'ExpandedSignerList',
  'B9E739B8296B4A1BB29BE990B17D66E21B62A300A909F25AC55C22D6C72E1F9D': 'DisallowIncoming',
  '7117E2EC2DBF119CA55181D69819F1999ECEE1A0225A7FD2B9ED47940968479C': 'RequireFullyCanonicalSig',
  '9178256A980A86CF3D70D0260A7DA6402AAFE43632FDBCB88037978404188871': 'CheckCashMakesTrustLine',
  '5D08145F0A4983F23AFFFF514E83FAD355C5ABFBB6CAB76FB5BC8519FF5F33BE': 'ImmediateOfferKilled',
  'C1B8D934087225F509BEB5A8EC24447854713EE447D277F69545ABFA0E0FD490': 'Checks',
  '3CBC5C4E630A1B82A8D1B8B4C22E5D3C5D8B6AECC51CDE692E0F5B88E1D5A8E5': 'DepositAuth',
  '4F46B0B6DBA5D24B6EC8D42E89A9B8E6D6C32B3B7E7AA3C5C1D6F3E5B7A8C9D0': 'DepositPreauth',
  'F64D1453CED5C956E0B8A39EBC5ECB1A6AA33C0D01FBB526CE4D6D9FBCB26C52': 'fixAMMv1_1',
  '56B241D7A43D40354D02A9DC4C8DF5C7A1F930D92A9035C4E1F3D0B38E4F5F01': 'fixNFTokenReserve',
  'CC5ABAE4F3EC92E94A59B1908C2BE82D2228B6485C00AFF8F22DF930D89C194E': 'fixEmptyDID',
  '58BE9B5968C4DA7C59BA900961828B113E5490699B21877DEF9A31E9D0FE5D5F': 'XRPFees',
};

class XRPLService {
  private currentEndpoint: string | null = null;

  // Make JSON-RPC request to XRPL
  private async rpcRequest(method: string, params: any = {}): Promise<any> {
    const errors: string[] = [];
    
    for (const endpoint of MAINNET_RPC_ENDPOINTS) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            method,
            params: [params],
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        if (data.result?.error) {
          throw new Error(data.result.error_message || data.result.error);
        }

        this.currentEndpoint = endpoint;
        return data.result;
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`${endpoint}: ${errMsg}`);
        console.warn(`XRPL endpoint ${endpoint} failed:`, errMsg);
      }
    }
    
    throw new Error(`All XRPL endpoints failed: ${errors.join('; ')}`);
  }

  async disconnect(): Promise<void> {
    // No persistent connection to close with HTTP
    this.currentEndpoint = null;
  }

  async getServerInfo(): Promise<any> {
    return this.rpcRequest('server_info');
  }

  async getAmendments(): Promise<AmendmentInfo[]> {
    try {
      const result = await this.rpcRequest('feature');
      const features = result.features || {};
      const amendments: AmendmentInfo[] = [];

      for (const [hash, data] of Object.entries(features)) {
        const featureData = data as any;
        const name = featureData.name || AMENDMENT_NAMES[hash] || `Unknown (${hash.slice(0, 8)}...)`;
        
        amendments.push({
          id: hash,
          name,
          enabled: featureData.enabled || false,
          supported: featureData.supported || false,
          vetoed: featureData.vetoed || false,
          count: featureData.count,
          threshold: featureData.threshold,
          validatorCount: featureData.validators,
        });
      }

      console.log(`Fetched ${amendments.length} amendments from XRPL`);
      return amendments;
    } catch (error) {
      console.error('Failed to fetch amendments from RPC, trying xrpscan...', error);
      return this.getAmendmentsFromXrpscan();
    }
  }

  // Fallback: Get amendments from xrpscan.com API
  private async getAmendmentsFromXrpscan(): Promise<AmendmentInfo[]> {
    try {
      const response = await fetch(`${XRPSCAN_API}/amendments`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      
      return data.map((a: any) => ({
        id: a.id || a.hash,
        name: a.name || AMENDMENT_NAMES[a.id] || 'Unknown',
        enabled: a.enabled || false,
        supported: a.supported || a.majority || false,
        vetoed: a.vetoed || false,
        count: a.count || a.validations,
        threshold: a.threshold,
      }));
    } catch (error) {
      console.error('xrpscan API also failed:', error);
      throw new Error('Failed to fetch amendment data from all sources');
    }
  }

  async getPendingAmendments(): Promise<AmendmentInfo[]> {
    const amendments = await this.getAmendments();
    return amendments.filter(a => a.supported && !a.enabled && !a.vetoed);
  }

  async getEnabledAmendments(): Promise<AmendmentInfo[]> {
    const amendments = await this.getAmendments();
    return amendments.filter(a => a.enabled);
  }

  async getValidatorInfo(publicKey: string): Promise<ValidatorInfo | null> {
    try {
      // Try xrpscan API for validator info
      const response = await fetch(`${XRPSCAN_API}/validatorhistory/${publicKey}`);
      
      if (response.ok) {
        const data = await response.json();
        return {
          publicKey,
          isOnUNL: data.unl || false,
          isValidating: data.agreement !== undefined,
          domain: data.domain,
          amendments: [],
        };
      }
      
      // Fallback: just return basic info
      return {
        publicKey,
        isOnUNL: false,
        isValidating: false,
        amendments: [],
      };
    } catch (error) {
      console.error('Error fetching validator info:', error);
      return {
        publicKey,
        isOnUNL: false,
        isValidating: false,
        amendments: [],
      };
    }
  }

  async getValidatorVotes(publicKey: string): Promise<string[]> {
    // Get amendments that are currently being voted on (have support)
    // Individual validator votes require deeper analysis of validation streams
    try {
      const amendments = await this.getAmendments();
      
      // Return supported (but not enabled) amendments as potential votes
      // In reality, you'd need to track individual validator endorsements
      const supportedAmendments = amendments
        .filter(a => a.supported && !a.enabled)
        .map(a => a.name);
      
      return supportedAmendments;
    } catch (error) {
      console.error('Error fetching validator votes:', error);
      return [];
    }
  }

  async getAmendmentProgress(): Promise<{ 
    current: number; 
    required: number; 
    percentage: number;
    amendmentsNearThreshold: string[];
  }> {
    try {
      const serverInfo = await this.getServerInfo();
      const info = serverInfo.info;
      const validatorCount = info.validation_quorum || 35;
      const required = Math.ceil(validatorCount * 0.8);

      const amendments = await this.getAmendments();
      const pendingWithVotes = amendments.filter(a => 
        a.supported && !a.enabled && a.count && a.count > 0
      );

      const nearThreshold = pendingWithVotes
        .filter(a => a.count && (required - a.count) <= 5)
        .map(a => a.name);

      const maxVotes = Math.max(...pendingWithVotes.map(a => a.count || 0), 0);

      return {
        current: maxVotes,
        required,
        percentage: Math.round((maxVotes / required) * 100),
        amendmentsNearThreshold: nearThreshold,
      };
    } catch (error) {
      console.error('Error fetching amendment progress:', error);
      return { current: 0, required: 28, percentage: 0, amendmentsNearThreshold: [] };
    }
  }

  getAmendmentName(hash: string): string {
    return AMENDMENT_NAMES[hash] || hash;
  }

  isConnected(): boolean {
    return this.currentEndpoint !== null;
  }
}

// Singleton instance
export const xrplService = new XRPLService();
