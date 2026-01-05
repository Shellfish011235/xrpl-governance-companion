// AI Assistant Response System
// Provides contextual, informational responses about XRPL governance

import { Amendment } from '../types';

export interface AssistantResponse {
  message: string;
  type: 'info' | 'amendment' | 'help' | 'warning';
  followUp?: string[];
}

// Keywords for matching questions
const QUESTION_PATTERNS = {
  // Amendment-specific questions
  whatDoes: /what (does|is|does this|is this)|explain|tell me about|describe/i,
  whoHelps: /who (does this help|benefits|is this for)|beneficiar|help|for whom/i,
  performance: /performance|impact|speed|ledger|cpu|memory|resource|slow/i,
  safe: /safe|risk|danger|secure|trust|reliable/i,
  tier: /tier|priority|classification|category/i,
  support: /support|vote|validator|how many|threshold|progress|percentage/i,
  activate: /activate|activation|when|timeline|time|how long/i,
  changed: /change|update|recent|new|different|modified/i,
  review: /review|time|minutes|how long to read|effort/i,
  clarity: /clarity|documentation|docs|information available/i,
  
  // General governance
  whatAmendments: /what are amendments|amendment system|how (do|does) amendment/i,
  howVoting: /how (does|do) voting|voting (work|process)|vote process/i,
  threshold: /80|eighty|threshold|consensus|majority/i,
  
  // App usage
  markCompleted: /mark|completed|complete|done|finish/i,
  privacy: /privacy|private|data|storage|local|stored/i,
  appVote: /does (this|the) app vote|vote for me|automatic|automate/i,
  addValidator: /add|enter|input|my validator|validator key|public key/i,
  findValidatorKey: /where.*(find|get|look|browse).*(validator|key|public)|find.*validator|list.*validator|validator.*list|xrpscan/i,
  
  // Validator
  validatorStatus: /validator status|my status|am i|check (my|validator)/i,
  unl: /unl|unique node list|trusted/i,
  
  // Safety
  appSafe: /app safe|is (this|it) safe|security|read.only|custody/i,
  keys: /key|private|secret|wallet|custody/i,
  
  // Greetings & misc
  greeting: /^(hi|hello|hey|good morning|good afternoon|good evening)/i,
  thanks: /thank|thanks|thx|appreciate/i,
  help: /^help$|how (can|do) (i|you)|what can you/i,
};

// Get response based on question and context
export function getAssistantResponse(
  question: string,
  selectedAmendment?: Amendment,
  context?: {
    totalAmendments?: number;
    pendingCount?: number;
    completedCount?: number;
    validatorKey?: string;
  }
): AssistantResponse {
  const q = question.toLowerCase().trim();
  
  // Greetings
  if (QUESTION_PATTERNS.greeting.test(q)) {
    return {
      message: "Hello! I'm here to help you understand XRPL governance and amendments. Feel free to ask me about any amendment, how voting works, or how to use this app.",
      type: 'info',
      followUp: ['What are amendments?', 'How does voting work?', 'Is this app safe?']
    };
  }
  
  // Thanks
  if (QUESTION_PATTERNS.thanks.test(q)) {
    return {
      message: "You're welcome! Let me know if you have any other questions about XRPL governance.",
      type: 'info'
    };
  }
  
  // General help
  if (QUESTION_PATTERNS.help.test(q)) {
    return {
      message: "I can help you with:\n\n• Understanding specific amendments (select one first)\n• Explaining governance concepts\n• Clarifying performance impacts\n• Answering questions about this app\n\nJust ask me anything about XRPL amendments or governance!",
      type: 'help',
      followUp: ['What are amendments?', 'How does voting work?', 'What does clarity mean?']
    };
  }
  
  // App safety & read-only
  if (QUESTION_PATTERNS.appSafe.test(q) || QUESTION_PATTERNS.keys.test(q)) {
    return {
      message: "This app is designed with security as a priority:\n\n🔒 **Read-only** — It cannot execute transactions or votes\n🔑 **No private keys** — Never asks for or stores private keys\n💾 **Local storage only** — Your preferences stay on your device\n🌐 **Public data only** — Only reads publicly available XRPL data\n\nThis app helps you understand and track amendments, but all actual voting happens through your validator's configuration.",
      type: 'info'
    };
  }
  
  // Does app vote
  if (QUESTION_PATTERNS.appVote.test(q)) {
    return {
      message: "No, this app does **not** vote on your behalf.\n\nThis is strictly an informational tool. It helps you:\n• Understand amendments\n• Track your review progress\n• See network voting status\n\nActual voting is done through your validator's configuration file (validators.txt or rippled.cfg). This app cannot and will not influence the network.",
      type: 'warning'
    };
  }
  
  // Privacy
  if (QUESTION_PATTERNS.privacy.test(q)) {
    return {
      message: "Your privacy is protected:\n\n• All preferences are stored **locally in your browser**\n• No account or login required\n• No data is sent to external servers (except XRPL public nodes)\n• Your validator key (if entered) is only used to fetch public network data\n• You can clear all data anytime in Settings",
      type: 'info'
    };
  }
  
  // What are amendments
  if (QUESTION_PATTERNS.whatAmendments.test(q) && !selectedAmendment) {
    return {
      message: "**XRPL Amendments** are protocol changes to the XRP Ledger that require validator consensus to activate.\n\nThey can:\n• Introduce new features\n• Fix bugs\n• Modify existing behavior\n\nEach amendment is identified by a unique hash and requires **80% validator support** maintained for approximately **2 weeks** before activating.\n\nOnce activated, amendments are permanent and cannot be reversed.",
      type: 'info',
      followUp: ['How does voting work?', 'What is the 80% threshold?']
    };
  }
  
  // How voting works
  if (QUESTION_PATTERNS.howVoting.test(q)) {
    return {
      message: "**How Amendment Voting Works:**\n\n1. Developers propose an amendment with code changes\n2. Validators signal support by adding the amendment hash to their config\n3. When **80% of trusted validators** support it, a 2-week countdown begins\n4. If support stays above 80% for ~256 flag ledgers (~2 weeks), it activates\n5. Once active, the change is permanent\n\nValidators can also veto amendments they believe are harmful.",
      type: 'info',
      followUp: ['What is the 80% threshold?', 'How long does activation take?']
    };
  }
  
  // Threshold
  if (QUESTION_PATTERNS.threshold.test(q) && !QUESTION_PATTERNS.support.test(q)) {
    return {
      message: "The **80% threshold** means that at least 80% of validators on the Unique Node List (UNL) must signal support for an amendment.\n\nThis high threshold ensures:\n• Broad consensus before changes\n• Protection against rushed or controversial changes\n• Network stability and security\n\nThe threshold must be maintained continuously for approximately 2 weeks for activation.",
      type: 'info'
    };
  }
  
  // Find validator keys
  if (QUESTION_PATTERNS.findValidatorKey.test(q)) {
    return {
      message: "You can find XRPL validator public keys at **[xrpscan.com](https://xrpscan.com/)**.\n\nXRPScan provides:\n• A list of all active validators\n• Their public keys (starting with 'n')\n• UNL status and voting history\n• Agreement scores and reliability metrics\n\nOnce you have the public key, paste it into the Validator Context page to track governance activity.",
      type: 'help',
      followUp: ['How do I add my validator?', 'What is UNL?']
    };
  }
  
  // Add validator
  if (QUESTION_PATTERNS.addValidator.test(q)) {
    const hasKey = context?.validatorKey;
    if (hasKey) {
      return {
        message: "Your validator key is already configured. You can view your governance activity on the **Validator Context** page.\n\nTo change or remove it, go to the Validator Context page and click 'Clear'.",
        type: 'info'
      };
    }
    return {
      message: "To add your validator:\n\n1. Click the **Validator Context** link at the bottom of the home page\n2. Enter your validator's **public key** (starts with 'n')\n3. Click **Look up validator**\n\nThis allows you to see which amendments you've signaled support for. Your key is stored locally and only used to fetch public network data.\n\n**Need to find a validator public key?**\nVisit [xrpscan.com](https://xrpscan.com/) to browse validators and find their public keys.",
      type: 'help',
      followUp: ['Is my data private?', 'What is UNL?', 'Where do I find validator keys?']
    };
  }
  
  // Validator status
  if (QUESTION_PATTERNS.validatorStatus.test(q)) {
    return {
      message: "To check your validator status:\n\n1. Go to the **Validator Context** page\n2. Enter your validator public key\n3. View your voting activity and network status\n\nThe status shows:\n• Whether you're on the UNL\n• Amendments you've supported\n• Pending amendments awaiting your vote\n\n**Don't have your public key handy?** Find it at [xrpscan.com](https://xrpscan.com/)",
      type: 'help',
      followUp: ['Where do I find validator keys?', 'What is UNL?']
    };
  }
  
  // UNL
  if (QUESTION_PATTERNS.unl.test(q)) {
    return {
      message: "The **Unique Node List (UNL)** is the set of validators that a server trusts to not collude.\n\nKey points:\n• The default UNL is published by the XRPL Foundation\n• Only validators on the UNL participate in amendment voting\n• Being on the UNL means your votes count toward the 80% threshold\n• Operators can customize their UNL, but most use the default",
      type: 'info'
    };
  }
  
  // Mark completed
  if (QUESTION_PATTERNS.markCompleted.test(q)) {
    return {
      message: "**Marking an amendment as 'Completed'** is your personal tracking system.\n\nIt means:\n• You've reviewed and understood the amendment\n• It's stored locally on your device only\n• It has **no effect** on the network\n• It does **not** cast a vote\n\nUse it to track your progress through the amendment list. You can undo it anytime.",
      type: 'info'
    };
  }
  
  // Clarity
  if (QUESTION_PATTERNS.clarity.test(q) && !selectedAmendment) {
    return {
      message: "**Clarity** indicates the availability and quality of documentation for an amendment.\n\n• **High** — Extensive documentation, analysis, and developer notes available\n• **Medium** — Some documentation exists but may be incomplete\n• **Low** — Limited publicly available information\n\nClarity reflects documentation status, **not** community sentiment or safety.",
      type: 'info'
    };
  }
  
  // Tier explanation (general)
  if (QUESTION_PATTERNS.tier.test(q) && !selectedAmendment) {
    return {
      message: "**Amendment Tiers** help prioritize your review:\n\n**Tier A** — Bug fixes and minor improvements with minimal risk. Often called 'fix-only' amendments.\n\n**Tier B** — New features or significant changes that introduce new capabilities.\n\n**Tier C** — Substantial protocol changes requiring careful consideration.\n\nThese tiers are informational guides, not official XRPL classifications.",
      type: 'info'
    };
  }
  
  // ===== AMENDMENT-SPECIFIC QUESTIONS =====
  
  if (selectedAmendment) {
    // What does this amendment do
    if (QUESTION_PATTERNS.whatDoes.test(q)) {
      return {
        message: `**${selectedAmendment.name}**\n\n${selectedAmendment.plainEnglishExplanation}`,
        type: 'amendment',
        followUp: ['Who does this help?', 'What is the performance impact?', 'Is this safe?']
      };
    }
    
    // Who does this help
    if (QUESTION_PATTERNS.whoHelps.test(q)) {
      const helps = selectedAmendment.whoThisHelps;
      const categories = helps.categories.join(', ');
      const examples = helps.examples?.length 
        ? `\n\nExamples: ${helps.examples.join(', ')}`
        : '';
      
      return {
        message: `**Who ${selectedAmendment.name} helps:**\n\n${helps.explanation}\n\n**Beneficiaries:** ${categories}${examples}\n\n_Note: Examples are illustrative, not endorsements._`,
        type: 'amendment',
        followUp: ['What is the performance impact?', 'What tier is this?']
      };
    }
    
    // Performance impact
    if (QUESTION_PATTERNS.performance.test(q)) {
      const impact = selectedAmendment.ledgerImpact;
      const areas = impact.affectedAreas.length > 0 
        ? impact.affectedAreas.join(', ') 
        : 'None identified';
      
      return {
        message: `**Ledger Impact for ${selectedAmendment.name}:**\n\n• **Estimated Impact:** ${impact.estimatedImpact}\n• **Confidence:** ${impact.confidence}\n• **Affected Areas:** ${areas}\n\n**Rationale:** ${impact.rationale}`,
        type: 'amendment',
        followUp: ['Is this safe?', 'What tier is this?']
      };
    }
    
    // Is it safe
    if (QUESTION_PATTERNS.safe.test(q)) {
      const tier = selectedAmendment.tier;
      const perf = selectedAmendment.performanceImpact;
      const clarity = selectedAmendment.clarity;
      
      let safetyNote = '';
      if (tier === 'A' && perf === 'Low') {
        safetyNote = 'This is classified as a **Tier A fix-only** amendment with **low performance impact**, suggesting minimal risk.';
      } else if (tier === 'A') {
        safetyNote = 'This is a **Tier A** amendment, typically indicating lower complexity.';
      } else if (tier === 'B') {
        safetyNote = 'This is a **Tier B** amendment, introducing new features that warrant review.';
      } else {
        safetyNote = 'This is a **Tier C** amendment, involving substantial changes that require careful consideration.';
      }
      
      return {
        message: `**Safety Assessment for ${selectedAmendment.name}:**\n\n${safetyNote}\n\n• **Performance Impact:** ${perf}\n• **Clarity:** ${clarity} (documentation availability)\n\n_This assessment is informational. Review the technical details and community discussion before making decisions._`,
        type: 'amendment',
        followUp: ['What is the performance impact?', 'Who does this help?']
      };
    }
    
    // Tier
    if (QUESTION_PATTERNS.tier.test(q)) {
      const tierDescriptions: Record<string, string> = {
        'A': 'Bug fixes and minor improvements with minimal risk',
        'B': 'New features or significant changes',
        'C': 'Substantial protocol changes requiring careful review'
      };
      
      return {
        message: `**${selectedAmendment.name}** is classified as **Tier ${selectedAmendment.tier}**.\n\n${tierDescriptions[selectedAmendment.tier]}\n\nThis classification helps prioritize review but is not an official XRPL designation.`,
        type: 'amendment'
      };
    }
    
    // Support/votes
    if (QUESTION_PATTERNS.support.test(q)) {
      const support = selectedAmendment.validatorSupport;
      const percentage = Math.round((support.current / support.required) * 100);
      const needed = support.required - support.current;
      
      return {
        message: `**Validator Support for ${selectedAmendment.name}:**\n\n• **Current:** ${support.current} validators\n• **Required:** ${support.required} validators (80%)\n• **Progress:** ${percentage}%\n• **Needed:** ${needed > 0 ? `${needed} more validators` : 'Threshold reached!'}\n\nOnce 80% support is reached and maintained for ~2 weeks, the amendment activates.`,
        type: 'amendment',
        followUp: ['When will this activate?', 'How does voting work?']
      };
    }
    
    // Activation timeline
    if (QUESTION_PATTERNS.activate.test(q)) {
      const support = selectedAmendment.validatorSupport;
      const hasThreshold = support.current >= support.required;
      const waiting = selectedAmendment.waitingDays;
      
      let timeline = '';
      if (hasThreshold) {
        const remaining = Math.max(0, 14 - waiting);
        timeline = `This amendment has reached the 80% threshold and has been waiting **${waiting} days**.\n\nEstimated activation: **~${remaining} days** (if support is maintained).`;
      } else {
        const needed = support.required - support.current;
        timeline = `This amendment needs **${needed} more validators** to reach the 80% threshold.\n\nOnce threshold is reached, it requires ~2 weeks of sustained support before activation.`;
      }
      
      return {
        message: `**Activation Timeline for ${selectedAmendment.name}:**\n\n${timeline}`,
        type: 'amendment'
      };
    }
    
    // What changed
    if (QUESTION_PATTERNS.changed.test(q)) {
      const changed = selectedAmendment.whatChanged;
      const tag = selectedAmendment.tag;
      
      const tagLabels: Record<string, string> = {
        'new': '🆕 This is a new amendment',
        'updated': '🔁 This amendment has been updated recently',
        'no_change': '🕒 No changes since last review',
        'safe_to_ignore': '💤 Safe to defer for now'
      };
      
      return {
        message: `**Recent Changes for ${selectedAmendment.name}:**\n\n${tagLabels[tag]}\n\n${changed || 'No specific changes noted.'}`,
        type: 'amendment'
      };
    }
    
    // Review time
    if (QUESTION_PATTERNS.review.test(q)) {
      return {
        message: `**Estimated Review Time for ${selectedAmendment.name}:**\n\n~${selectedAmendment.estimatedReviewMinutes} minutes\n\nThis estimate includes reading the plain-English explanation, understanding the impact, and reviewing key references.`,
        type: 'amendment'
      };
    }
    
    // Clarity (with amendment selected)
    if (QUESTION_PATTERNS.clarity.test(q)) {
      const clarityDescriptions: Record<string, string> = {
        'High': 'Extensive documentation and analysis is available for this amendment.',
        'Medium': 'Some documentation exists, but may benefit from additional review of source materials.',
        'Low': 'Limited documentation is publicly available. Consider reviewing GitHub PRs and developer discussions.'
      };
      
      return {
        message: `**Documentation Clarity for ${selectedAmendment.name}:** ${selectedAmendment.clarity}\n\n${clarityDescriptions[selectedAmendment.clarity]}\n\n_Clarity reflects documentation availability, not sentiment or safety._`,
        type: 'amendment'
      };
    }
  }
  
  // Default response when no pattern matches
  if (selectedAmendment) {
    return {
      message: `I can help you understand **${selectedAmendment.name}**. Try asking:\n\n• What does this amendment do?\n• Who does this help?\n• What is the performance impact?\n• Is this safe?\n• What tier is this?\n• How many validators support this?`,
      type: 'help',
      followUp: ['What does this do?', 'Who does this help?', 'Is this safe?']
    };
  }
  
  return {
    message: "I can help you understand XRPL amendments and governance. Try asking:\n\n• What are amendments?\n• How does voting work?\n• What does clarity mean?\n• Is this app safe?\n\nOr select an amendment and ask specific questions about it!",
    type: 'help',
    followUp: ['What are amendments?', 'How does voting work?', 'Is this app safe?']
  };
}

// Quick question suggestions based on context
export function getQuickQuestions(selectedAmendment?: Amendment): string[] {
  if (selectedAmendment) {
    return [
      'What does this do?',
      'Who does this help?',
      'Performance impact?',
      'Is this safe?',
    ];
  }
  
  return [
    'What are amendments?',
    'How does voting work?',
    'Where do I find validator keys?',
    'Is this app safe?',
  ];
}
