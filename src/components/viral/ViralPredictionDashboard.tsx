import React, { useState, useEffect } from 'react';
import {
  ViralPredictionScore,
  ViralGuarantee,
  TrendingContent,
  ViralBooster,
  CompetitorAnalysis,
  ViralCampaign,
} from '../../types/viral';
import { viralService } from '../../services/viralService';

const ViralPredictionDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('predictor');
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('tiktok');
  const [prediction, setPrediction] = useState<ViralPredictionScore | null>(null);
  const [guarantee, setGuarantee] = useState<ViralGuarantee | null>(null);
  const [trending, setTrending] = useState<TrendingContent[]>([]);
  const [boosters, setBoosters] = useState<ViralBooster[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorAnalysis[]>([]);
  const [campaigns, setCampaigns] = useState<ViralCampaign[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const [trendingData, boostersData, competitorData] = await Promise.all([
      viralService.getCurrentTrending(),
      viralService.getViralBoosters(),
      viralService.analyzeCompetitors(),
    ]);

    setTrending(trendingData);
    setBoosters(boostersData);
    setCompetitors(competitorData);
  };

  const handlePredict = async () => {
    if (!content) return;

    setLoading(true);
    try {
      const predictionResult = await viralService.predictViralPotential(content, platform);
      setPrediction(predictionResult);

      if (
        predictionResult.guaranteeLevel === 'CONFIRM_VIRAL' ||
        predictionResult.guaranteeLevel === 'HIGH_POTENTIAL'
      ) {
        const guaranteeResult = await viralService.createViralGuarantee(
          `content-${Date.now()}`,
          predictionResult,
        );
        setGuarantee(guaranteeResult);
      }
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    const campaign = await viralService.createViralCampaign('Maximize brand awareness', 1000, [
      'tiktok',
      'instagram',
      'facebook',
    ]);
    setCampaigns([...campaigns, campaign]);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-red-600 bg-red-100';
    if (score >= 70) return 'text-orange-600 bg-orange-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getGuaranteeColor = (level: string) => {
    switch (level) {
      case 'CONFIRM_VIRAL':
        return 'bg-red-500 text-white animate-pulse';
      case 'HIGH_POTENTIAL':
        return 'bg-orange-500 text-white';
      case 'MEDIUM_POTENTIAL':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">🚀 VIRAL PREDICTION HQ</h1>
        <p className="text-lg text-gray-600">
          Revolutionary AI system yang GUARANTEE viral content untuk Malaysia!
          <span className="font-bold text-red-600"> WORLD'S FIRST VIRAL GUARANTEE SYSTEM! 🔥</span>
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6">
        {[
          { id: 'predictor', label: '🎯 Viral Predictor', badge: 'HOT' },
          { id: 'trending', label: '📈 Live Trending', badge: 'LIVE' },
          { id: 'boosters', label: '⚡ Viral Boosters', badge: 'NEW' },
          { id: 'competitors', label: '🕵️ Spy Mode', badge: 'SECRET' },
          { id: 'campaigns', label: '🚀 Campaign Lab', badge: 'PRO' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-all relative ${
              activeTab === tab.id
                ? 'bg-red-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-red-50'
            }`}
          >
            {tab.label}
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold">
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Viral Predictor Tab */}
      {activeTab === 'predictor' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">✨ Content Analyzer</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform Target
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="tiktok">🎵 TikTok (Best for viral!)</option>
                  <option value="instagram">📸 Instagram</option>
                  <option value="facebook">👥 Facebook</option>
                  <option value="twitter">🐦 Twitter (X)</option>
                  <option value="youtube">📺 YouTube</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tulis content yang nak viral ni! Contoh: 'Cara buat jagung goreng yang viral dekat Malaysia! Petani local share secret recipe yang confirm sedap! 🌽🔥 #JagungMalaysia #ViralRecipe'"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                />
              </div>

              <button
                onClick={handlePredict}
                disabled={!content || loading}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold py-4 px-6 rounded-lg hover:from-red-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                {loading ? '🤖 AI Analyzing...' : '🚀 PREDICT VIRAL POTENTIAL!'}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {prediction && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  📊 Viral Prediction Results
                </h2>

                {/* Main Score */}
                <div className="text-center mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-32 h-32 rounded-full text-4xl font-bold ${getScoreColor(prediction.overallScore)}`}
                  >
                    {prediction.overallScore}
                  </div>
                  <div
                    className={`mt-2 px-4 py-2 rounded-full font-bold text-sm ${getGuaranteeColor(prediction.guaranteeLevel)}`}
                  >
                    {prediction.guaranteeLevel === 'CONFIRM_VIRAL' && '🔥 CONFIRM VIRAL! 🔥'}
                    {prediction.guaranteeLevel === 'HIGH_POTENTIAL' && '⚡ HIGH POTENTIAL ⚡'}
                    {prediction.guaranteeLevel === 'MEDIUM_POTENTIAL' && '📈 MEDIUM POTENTIAL'}
                    {prediction.guaranteeLevel === 'LOW_RISK' && '📊 LOW RISK'}
                  </div>
                </div>

                {/* Prediction Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Confidence Level</div>
                    <div className="text-xl font-bold text-blue-800">{prediction.confidence}%</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">Time to Viral</div>
                    <div className="text-xl font-bold text-green-800">{prediction.timeToViral}</div>
                  </div>
                </div>

                {/* Expected Reach */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-800 mb-2">Expected Reach</h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-sm text-purple-600">Minimum</div>
                      <div className="font-bold text-purple-800">
                        {formatNumber(prediction.expectedReach.min)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-purple-600">Maximum</div>
                      <div className="font-bold text-purple-800">
                        {formatNumber(prediction.expectedReach.max)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-purple-600">Guaranteed</div>
                      <div className="font-bold text-red-600">
                        {formatNumber(prediction.expectedReach.guaranteed)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Guarantee Section */}
            {guarantee && (
              <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  🛡️ VIRAL GUARANTEE ACTIVATED!
                </h2>

                <div className="space-y-3">
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <div className="text-sm opacity-90">Guarantee ID</div>
                    <div className="font-mono font-bold">{guarantee.id}</div>
                  </div>

                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <div className="text-sm opacity-90">Minimum Reach Guaranteed</div>
                    <div className="text-2xl font-bold">
                      {formatNumber(guarantee.minimumReach)} views
                    </div>
                  </div>

                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <div className="text-sm opacity-90">Refund Policy</div>
                    <div className="font-medium">{guarantee.refundPolicy}</div>
                  </div>

                  <div className="text-xs opacity-75 mt-4">
                    * Terms & conditions apply. Guarantee valid for 24-48 hours from posting.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trending Tab */}
      {activeTab === 'trending' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">📈 Live Trending Content Malaysia</h2>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Updates</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                    {item.platform}
                  </span>
                  <span
                    className={`text-sm font-bold ${getScoreColor(item.viralScore).split(' ')[0]}`}
                  >
                    {item.viralScore}% viral
                  </span>
                </div>

                <h4 className="font-medium text-gray-900 mb-2">{item.content}</h4>

                <div className="flex flex-wrap gap-1 mb-2">
                  {item.hashtags.map((tag) => (
                    <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>{formatNumber(item.currentViews)} views</span>
                  <span>+{item.growthRate}% growth</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Boosters Tab */}
      {activeTab === 'boosters' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ⚡ Viral Boosters - Guaranteed Results!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boosters.map((booster, index) => (
              <div
                key={index}
                className="border-2 border-yellow-200 rounded-lg p-6 hover:border-yellow-400 transition-all hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">{booster.name}</h3>
                  <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold">
                    +{booster.scoreBoost}%
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4">{booster.description}</p>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-green-600">RM{booster.cost}</span>
                  <span className="text-sm text-gray-500">{booster.duration}</span>
                </div>

                <button
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                    booster.availability
                      ? 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!booster.availability}
                >
                  {booster.availability ? '🚀 Activate Booster' : '⏰ Coming Soon'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitors Tab */}
      {activeTab === 'competitors' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🕵️ Competitor Intelligence - SECRET MODE!
          </h2>

          <div className="space-y-6">
            {competitors.map((comp, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{comp.competitor}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-blue-600">Avg Viral Score</div>
                    <div className="text-xl font-bold text-blue-800">
                      {comp.patterns.averageViralScore}%
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-green-600">Best Time</div>
                    <div className="font-bold text-green-800">{comp.patterns.bestTimes[0]}</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-sm text-purple-600">Top Content</div>
                    <div className="font-bold text-purple-800">{comp.patterns.contentTypes[0]}</div>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="text-sm text-orange-600">Weakness</div>
                    <div className="font-bold text-orange-800">{comp.weaknesses[0]}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {comp.patterns.topHashtags.map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🚀 Viral Campaign Lab</h2>
            <button
              onClick={handleCreateCampaign}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
            >
              ✨ Create New Campaign
            </button>
          </div>

          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
              <p className="text-gray-600">
                Create your first viral campaign to dominate social media!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">{campaign.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        campaign.status === 'VIRAL'
                          ? 'bg-red-100 text-red-800'
                          : campaign.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Target Reach</div>
                      <div className="font-bold">{formatNumber(campaign.targetReach)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Budget</div>
                      <div className="font-bold">RM{campaign.budget}</div>
                    </div>
                  </div>

                  <div className="flex space-x-2 mb-4">
                    {campaign.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>

                  <div
                    className={`p-3 rounded-lg ${getGuaranteeColor(campaign.guarantee.guaranteeLevel)} text-center`}
                  >
                    <div className="font-bold">
                      Viral Score: {campaign.viralScore.overallScore}%
                    </div>
                    <div className="text-sm opacity-90">{campaign.guarantee.refundPolicy}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViralPredictionDashboard;
