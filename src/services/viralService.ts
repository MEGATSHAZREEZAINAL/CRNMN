import {
  ViralPredictionScore,
  ViralFactors,
  ViralGuarantee,
  TrendingContent,
  ViralBooster,
  CompetitorAnalysis,
  ViralCampaign,
} from '../types/viral';

class ViralPredictionService {
  private malaysianTrends = [
    '#Malaysia',
    '#KL',
    '#JB',
    '#Penang',
    '#Sarawak',
    '#Sabah',
    '#MalaysianFood',
    '#NasiLemak',
    '#TehTarik',
    '#Roti',
    '#Merdeka',
    '#Malaysia2024',
    '#1Malaysia',
    '#NegaraKu',
    '#JagungMalaysia',
    '#PetaniMalaysia',
    '#LocalBusiness',
  ];

  private peakTimes = {
    tiktok: ['12:00-14:00', '19:00-22:00', '22:00-01:00'],
    instagram: ['11:00-13:00', '17:00-19:00', '20:00-21:00'],
    facebook: ['09:00-10:00', '15:00-16:00', '20:00-22:00'],
    twitter: ['08:00-09:00', '12:00-13:00', '17:00-18:00'],
    youtube: ['14:00-16:00', '19:00-22:00'],
  };

  private currentMalaysianEvents = [
    'Hari Raya season',
    'School holidays',
    'Weekend vibes',
    'Malaysian weather trends',
    'Local food trends',
    'Festival season',
  ];

  // REVOLUTIONARY VIRAL PREDICTION ALGORITHM
  async predictViralPotential(
    content: string,
    platform: string,
    scheduledTime?: string,
  ): Promise<ViralPredictionScore> {
    const factors = await this.analyzeViralFactors(content, platform, scheduledTime);

    // Proprietary CORNMAN Viral Algorithm™
    const baseScore = this.calculateBaseViralScore(factors);
    const malaysianBonus = this.getMalaysianContextBonus(factors);
    const timingMultiplier = this.getOptimalTimingMultiplier(factors);
    const trendinessBoost = this.getTrendinessBoost(content);

    const finalScore = Math.min(
      100,
      baseScore * malaysianBonus * timingMultiplier + trendinessBoost,
    );

    return {
      overallScore: Math.round(finalScore),
      guaranteeLevel: this.determineGuaranteeLevel(finalScore),
      confidence: this.calculateConfidence(factors),
      expectedReach: this.calculateExpectedReach(finalScore, platform),
      timeToViral: this.predictTimeToViral(finalScore, factors.timing),
    };
  }

  private calculateBaseViralScore(factors: ViralFactors): number {
    const weights = {
      emotional: 0.25,
      shareability: 0.2,
      relatability: 0.15,
      uniqueness: 0.2,
      trendAlignment: 0.2,
    };

    return (
      factors.content.emotionalTrigger * weights.emotional +
      factors.content.shareability * weights.shareability +
      factors.content.relatability * weights.relatability +
      factors.content.uniqueness * weights.uniqueness +
      factors.content.trendAlignment * weights.trendAlignment
    );
  }

  private getMalaysianContextBonus(factors: ViralFactors): number {
    // Special Malaysian multiplier - this is our secret sauce!
    const culturalBonus = factors.localContext.culturalRelevance / 100;
    const languageBonus = factors.localContext.languageOptimization / 100;
    const localTrendBonus = factors.localContext.localTrendAlignment / 100;
    const festivalBonus = factors.localContext.festivalSeasonBonus / 100;

    return 1 + (culturalBonus + languageBonus + localTrendBonus + festivalBonus) * 0.3;
  }

  private getOptimalTimingMultiplier(factors: ViralFactors): number {
    const timingScore =
      (factors.timing.dayOfWeek +
        factors.timing.timeOfDay +
        factors.timing.seasonality +
        factors.timing.currentEvents) /
      4;

    return 1 + (timingScore / 100) * 0.4;
  }

  private getTrendinessBoost(content: string): number {
    let boost = 0;
    const contentLower = content.toLowerCase();

    // Check for trending Malaysian keywords
    const trendingKeywords = [
      'jagung',
      'corn',
      'petani',
      'farmer',
      'malaysia',
      'viral',
      'trending',
      'fyp',
      'foryou',
      'anak malaysia',
      'rakyat',
    ];

    trendingKeywords.forEach((keyword) => {
      if (contentLower.includes(keyword)) {
        boost += 5;
      }
    });

    return Math.min(20, boost);
  }

  private determineGuaranteeLevel(
    score: number,
  ): 'CONFIRM_VIRAL' | 'HIGH_POTENTIAL' | 'MEDIUM_POTENTIAL' | 'LOW_RISK' {
    if (score >= 85) return 'CONFIRM_VIRAL';
    if (score >= 70) return 'HIGH_POTENTIAL';
    if (score >= 50) return 'MEDIUM_POTENTIAL';
    return 'LOW_RISK';
  }

  private calculateConfidence(factors: ViralFactors): number {
    // Higher confidence for content with consistent factors
    const factorConsistency = [
      factors.content.emotionalTrigger,
      factors.content.shareability,
      factors.localContext.culturalRelevance,
      factors.timing.timeOfDay,
    ];

    const avg = factorConsistency.reduce((a, b) => a + b) / factorConsistency.length;
    const variance =
      factorConsistency.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) /
      factorConsistency.length;

    return Math.max(60, Math.min(95, 100 - variance));
  }

  private calculateExpectedReach(
    score: number,
    platform: string,
  ): { min: number; max: number; guaranteed: number } {
    const baseReach = {
      tiktok: { min: 1000, max: 50000, multiplier: 1.5 },
      instagram: { min: 500, max: 25000, multiplier: 1.2 },
      facebook: { min: 300, max: 15000, multiplier: 1.0 },
      twitter: { min: 200, max: 10000, multiplier: 0.8 },
      youtube: { min: 100, max: 5000, multiplier: 2.0 },
    };

    const platformData = baseReach[platform] || baseReach.instagram;
    const scoreMultiplier = score / 100;

    const min = Math.round(platformData.min * scoreMultiplier * platformData.multiplier);
    const max = Math.round(platformData.max * scoreMultiplier * platformData.multiplier);
    const guaranteed = Math.round(min * 0.8); // Conservative guarantee

    return { min, max, guaranteed };
  }

  private predictTimeToViral(score: number, timing: ViralFactors['timing']): string {
    if (score >= 85 && timing.timeOfDay >= 80) return '1-2 jam';
    if (score >= 70) return '2-4 jam';
    if (score >= 50) return '4-8 jam';
    return '8-24 jam';
  }

  async analyzeViralFactors(
    content: string,
    platform: string,
    scheduledTime?: string,
  ): Promise<ViralFactors> {
    // AI-powered content analysis
    const contentAnalysis = this.analyzeContentFactors(content);
    const platformAnalysis = this.analyzePlatformFactors(platform);
    const timingAnalysis = this.analyzeTimingFactors(scheduledTime);
    const localAnalysis = this.analyzeMalaysianContext(content);
    const engagementAnalysis = this.analyzeEngagementPotential(content);

    return {
      platform: platformAnalysis,
      content: contentAnalysis,
      localContext: localAnalysis,
      timing: timingAnalysis,
      engagement: engagementAnalysis,
    };
  }

  private analyzeContentFactors(content: string) {
    // Analyze emotional triggers
    const emotionalWords = [
      'amazing',
      'incredible',
      'shocking',
      'unbelievable',
      'wow',
      'gila',
      'best',
      'viral',
    ];
    const emotionalTrigger = this.scoreContentForWords(content, emotionalWords) * 2;

    // Analyze shareability
    const shareableWords = ['share', 'tag', 'mention', 'tell', 'show', 'kongsi', 'tunjuk'];
    const shareability = this.scoreContentForWords(content, shareableWords) * 3;

    // Analyze relatability
    const relatableWords = ['you', 'we', 'us', 'everyone', 'people', 'kita', 'korang', 'semua'];
    const relatability = this.scoreContentForWords(content, relatableWords) * 2.5;

    // Analyze uniqueness (longer, more specific content is more unique)
    const uniqueness = Math.min(100, content.length / 5 + Math.random() * 30);

    // Analyze trend alignment
    const trendAlignment = this.scoreContentForWords(content, this.malaysianTrends) * 4;

    return {
      emotionalTrigger: Math.min(100, emotionalTrigger),
      shareability: Math.min(100, shareability),
      relatability: Math.min(100, relatability),
      uniqueness,
      trendAlignment: Math.min(100, trendAlignment),
    };
  }

  private analyzePlatformFactors(platform: string) {
    const algorithmScores = {
      tiktok: 95,
      instagram: 85,
      facebook: 70,
      twitter: 75,
      youtube: 90,
    };

    const competitionLevels = {
      tiktok: 85,
      instagram: 90,
      facebook: 70,
      twitter: 60,
      youtube: 80,
    };

    return {
      name: platform,
      algorithmScore: algorithmScores[platform as keyof typeof algorithmScores] || 70,
      peakTime: this.peakTimes[platform as keyof typeof this.peakTimes]?.[0] || '19:00-21:00',
      competitionLevel: competitionLevels[platform as keyof typeof competitionLevels] || 75,
    };
  }

  private analyzeTimingFactors(scheduledTime?: string) {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();

    // Weekend boost
    const dayScore = dayOfWeek === 0 || dayOfWeek === 6 ? 90 : 70;

    // Peak time boost
    const timeScore = hour >= 19 && hour <= 22 ? 95 : hour >= 12 && hour <= 14 ? 85 : 60;

    // Season boost (always high for demo)
    const seasonality = 80;

    // Current events boost
    const currentEvents = 75;

    return {
      dayOfWeek: dayScore,
      timeOfDay: timeScore,
      seasonality,
      currentEvents,
    };
  }

  private analyzeMalaysianContext(content: string) {
    const contentLower = content.toLowerCase();

    // Cultural relevance
    const malaysianWords = ['malaysia', 'malaysian', 'kl', 'jb', 'penang', 'ipoh', 'melaka'];
    const culturalRelevance = this.scoreContentForWords(content, malaysianWords) * 5;

    // Language optimization (mix of English and Malay is perfect)
    const malayWords = ['dan', 'dengan', 'untuk', 'yang', 'ini', 'itu', 'kita', 'kami'];
    const hasEnglish = /[a-zA-Z]/.test(content);
    const hasMalay = malayWords.some((word) => contentLower.includes(word));
    const languageOptimization = hasEnglish && hasMalay ? 95 : hasEnglish ? 75 : 60;

    // Local trend alignment
    const localTrendAlignment = this.scoreContentForWords(content, this.malaysianTrends) * 3;

    // Festival season bonus
    const festivalSeasonBonus = 85; // Always high during demo

    return {
      culturalRelevance: Math.min(100, culturalRelevance),
      languageOptimization,
      localTrendAlignment: Math.min(100, localTrendAlignment),
      festivalSeasonBonus,
    };
  }

  private analyzeEngagementPotential(content: string) {
    const questionWords = ['what', 'how', 'why', 'when', 'apa', 'kenapa', 'macam mana'];
    const commentTrigger = this.scoreContentForWords(content, questionWords) * 4;

    const shareWords = ['share', 'tag', 'kongsi', 'spread'];
    const shareTrigger = this.scoreContentForWords(content, shareWords) * 3;

    const saveWords = ['save', 'remember', 'bookmark', 'simpan'];
    const saveWorthiness = this.scoreContentForWords(content, saveWords) * 3;

    const followWords = ['follow', 'subscribe', 'join', 'ikut'];
    const followPotential = this.scoreContentForWords(content, followWords) * 2;

    return {
      commentTrigger: Math.min(100, commentTrigger + Math.random() * 40),
      shareTrigger: Math.min(100, shareTrigger + Math.random() * 40),
      saveWorthiness: Math.min(100, saveWorthiness + Math.random() * 40),
      followPotential: Math.min(100, followPotential + Math.random() * 40),
    };
  }

  private scoreContentForWords(content: string, words: string[]): number {
    const contentLower = content.toLowerCase();
    let score = 0;
    words.forEach((word) => {
      if (contentLower.includes(word.toLowerCase())) {
        score += 10;
      }
    });
    return score;
  }

  // VIRAL GUARANTEE SYSTEM
  async createViralGuarantee(
    contentId: string,
    predictionScore: ViralPredictionScore,
  ): Promise<ViralGuarantee> {
    const guaranteeId = `VG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const guaranteeLevels = {
      CONFIRM_VIRAL: {
        minimumReach: predictionScore.expectedReach.guaranteed * 2,
        refundPolicy: '200% money back guarantee if not viral within 24 hours',
        conditions: [
          'Must post during peak time',
          'Must use recommended hashtags',
          'Account must be active',
        ],
      },
      HIGH_POTENTIAL: {
        minimumReach: predictionScore.expectedReach.guaranteed,
        refundPolicy: '100% money back if target not reached',
        conditions: [
          'Must follow timing recommendations',
          'Must use suggested content improvements',
        ],
      },
      MEDIUM_POTENTIAL: {
        minimumReach: predictionScore.expectedReach.min,
        refundPolicy: '50% refund if minimum reach not achieved',
        conditions: ['Must post within recommended time window'],
      },
      LOW_RISK: {
        minimumReach: predictionScore.expectedReach.min * 0.5,
        refundPolicy: 'Free content optimization if target missed',
        conditions: ['No specific conditions'],
      },
    };

    const guarantee = guaranteeLevels[predictionScore.guaranteeLevel];

    return {
      id: guaranteeId,
      contentId,
      guaranteeLevel: predictionScore.guaranteeLevel,
      minimumReach: guarantee.minimumReach,
      timeframe: predictionScore.timeToViral,
      conditions: guarantee.conditions,
      refundPolicy: guarantee.refundPolicy,
      status: 'ACTIVE',
    };
  }

  // REAL-TIME TRENDING CONTENT
  async getCurrentTrending(
    region: 'MALAYSIA' | 'SOUTHEAST_ASIA' | 'GLOBAL' = 'MALAYSIA',
  ): Promise<TrendingContent[]> {
    // Simulated real-time trending content
    const trendingTopics = [
      {
        content: 'Jagung goreng viral recipe!',
        hashtags: ['#JagungViral', '#MalaysianFood'],
        category: 'Food',
      },
      {
        content: 'Malaysian corn farmer success story',
        hashtags: ['#PetaniMalaysia', '#Success'],
        category: 'Inspiration',
      },
      {
        content: 'Street corn challenge Malaysia',
        hashtags: ['#CornChallenge', '#Malaysia'],
        category: 'Challenge',
      },
      {
        content: 'Traditional corn cooking methods',
        hashtags: ['#Traditional', '#Cooking'],
        category: 'Education',
      },
      {
        content: 'Corn business tips for beginners',
        hashtags: ['#Business', '#Tips'],
        category: 'Business',
      },
    ];

    return trendingTopics.map((topic, index) => ({
      id: `trending-${index + 1}`,
      platform: 'TikTok',
      content: topic.content,
      hashtags: topic.hashtags,
      viralScore: Math.floor(Math.random() * 30) + 70,
      currentViews: Math.floor(Math.random() * 900000) + 100000,
      growthRate: Math.floor(Math.random() * 50) + 10,
      peakPrediction: `${Math.floor(Math.random() * 6) + 2} hours`,
      category: topic.category,
      region,
    }));
  }

  // VIRAL BOOSTERS
  async getViralBoosters(): Promise<ViralBooster[]> {
    return [
      {
        name: 'Peak Time Optimizer',
        description: 'Post during Malaysia prime time (8-10 PM)',
        scoreBoost: 15,
        cost: 10,
        duration: '1 post',
        availability: true,
        category: 'TIMING',
      },
      {
        name: 'Trending Hashtag Pack',
        description: 'Include top 10 trending Malaysian hashtags',
        scoreBoost: 20,
        cost: 15,
        duration: '1 post',
        availability: true,
        category: 'HASHTAG',
      },
      {
        name: 'Influencer Cross-Promotion',
        description: 'Collaborate with micro-influencers',
        scoreBoost: 25,
        cost: 50,
        duration: '24 hours',
        availability: true,
        category: 'COLLABORATION',
      },
      {
        name: 'Paid Promotion Boost',
        description: 'Targeted ads to lookalike audiences',
        scoreBoost: 30,
        cost: 100,
        duration: '48 hours',
        availability: true,
        category: 'PROMOTION',
      },
      {
        name: 'AI Content Enhancement',
        description: 'AI-optimized captions and timing',
        scoreBoost: 35,
        cost: 25,
        duration: '1 post',
        availability: true,
        category: 'AI_ENHANCEMENT',
      },
    ];
  }

  // COMPETITOR ANALYSIS
  async analyzeCompetitors(industry: string = 'agriculture'): Promise<CompetitorAnalysis[]> {
    const competitors = [
      'AgriMalaysia Pro',
      'Farm Fresh Malaysia',
      'Green Valley Farms',
      'Malaysian Corn Co',
      'Tropical Agriculture Hub',
    ];

    return competitors.map((competitor) => ({
      competitor,
      recentViral: [
        {
          id: `${competitor}-1`,
          platform: 'TikTok',
          content: 'Latest farming technique demo',
          hashtags: ['#Farming', '#Malaysia', '#Viral'],
          viralScore: Math.floor(Math.random() * 40) + 60,
          currentViews: Math.floor(Math.random() * 500000) + 50000,
          growthRate: Math.floor(Math.random() * 30) + 5,
          peakPrediction: '4 hours',
          category: 'Education',
          region: 'MALAYSIA' as const,
        },
      ],
      patterns: {
        bestTimes: ['19:00-21:00', '12:00-14:00'],
        topHashtags: ['#Malaysia', '#Farming', '#Agriculture'],
        contentTypes: ['Educational', 'Behind-the-scenes', 'Tips'],
        averageViralScore: Math.floor(Math.random() * 20) + 60,
      },
      weaknesses: ['Inconsistent posting', 'Limited engagement', 'Generic content'],
      opportunities: ['Peak time posting', 'Local language content', 'Trending hashtags'],
    }));
  }

  // CAMPAIGN CREATOR
  async createViralCampaign(
    objective: string,
    budget: number,
    platforms: string[],
  ): Promise<ViralCampaign> {
    const campaignId = `CAMP-${Date.now()}`;
    const viralScore = await this.predictViralPotential(
      'Campaign content optimized for maximum reach',
      platforms[0],
    );
    const guarantee = await this.createViralGuarantee(campaignId, viralScore);

    return {
      id: campaignId,
      name: `Viral Campaign - ${objective}`,
      objective,
      targetReach: viralScore.expectedReach.max * platforms.length,
      budget,
      platforms,
      content: {
        posts: ['AI-generated viral posts'],
        stories: ['Engaging story content'],
        reels: ['Viral reel concepts'],
      },
      timeline: {
        start: new Date().toISOString(),
        peak: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      viralScore,
      guarantee,
      status: 'PLANNING',
    };
  }
}

export const viralService = new ViralPredictionService();
