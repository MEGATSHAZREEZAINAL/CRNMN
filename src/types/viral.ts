export interface ViralPredictionScore {
  overallScore: number; // 0-100
  guaranteeLevel: 'CONFIRM_VIRAL' | 'HIGH_POTENTIAL' | 'MEDIUM_POTENTIAL' | 'LOW_RISK';
  confidence: number;
  expectedReach: {
    min: number;
    max: number;
    guaranteed: number;
  };
  timeToViral: string; // "2-4 hours", "24 hours", etc.
}

export interface ViralFactors {
  // Platform-specific factors
  platform: {
    name: string;
    algorithmScore: number;
    peakTime: string;
    competitionLevel: number;
  };

  // Content analysis
  content: {
    emotionalTrigger: number; // Joy, surprise, anger, etc.
    shareability: number;
    relatability: number;
    uniqueness: number;
    trendAlignment: number;
  };

  // Malaysian context
  localContext: {
    culturalRelevance: number;
    languageOptimization: number;
    localTrendAlignment: number;
    festivalSeasonBonus: number;
  };

  // Timing factors
  timing: {
    dayOfWeek: number;
    timeOfDay: number;
    seasonality: number;
    currentEvents: number;
  };

  // Engagement predictors
  engagement: {
    commentTrigger: number;
    shareTrigger: number;
    saveWorthiness: number;
    followPotential: number;
  };
}

export interface ViralGuarantee {
  id: string;
  contentId: string;
  guaranteeLevel: string;
  minimumReach: number;
  timeframe: string;
  conditions: string[];
  refundPolicy: string;
  status: 'ACTIVE' | 'FULFILLED' | 'PROCESSING' | 'REFUNDED';
  actualReach?: number;
  fulfillmentDate?: string;
}

export interface TrendingContent {
  id: string;
  platform: string;
  content: string;
  hashtags: string[];
  viralScore: number;
  currentViews: number;
  growthRate: number;
  peakPrediction: string;
  category: string;
  region: 'MALAYSIA' | 'SOUTHEAST_ASIA' | 'GLOBAL';
}

export interface ViralBooster {
  name: string;
  description: string;
  scoreBoost: number;
  cost: number;
  duration: string;
  availability: boolean;
  category: 'TIMING' | 'HASHTAG' | 'COLLABORATION' | 'PROMOTION' | 'AI_ENHANCEMENT';
}

export interface CompetitorAnalysis {
  competitor: string;
  recentViral: TrendingContent[];
  patterns: {
    bestTimes: string[];
    topHashtags: string[];
    contentTypes: string[];
    averageViralScore: number;
  };
  weaknesses: string[];
  opportunities: string[];
}

export interface ViralCampaign {
  id: string;
  name: string;
  objective: string;
  targetReach: number;
  budget: number;
  platforms: string[];
  content: {
    posts: unknown[];
    stories: unknown[];
    reels: unknown[];
  };
  timeline: {
    start: string;
    peak: string;
    end: string;
  };
  viralScore: ViralPredictionScore;
  guarantee: ViralGuarantee;
  status: 'PLANNING' | 'ACTIVE' | 'VIRAL' | 'COMPLETED';
}
