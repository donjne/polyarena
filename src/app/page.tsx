"use client"
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { 
  Trophy, Users, Sparkles, TrendingUp, Gamepad2, Brain, Crown, 
  Sword, Users2, Target, Star, Medal, Calendar, Shield, Zap,
  Award, Clock, ChevronDown, ChevronUp, Gift, Flame
} from "lucide-react";
import Header from '@/components/Header';
interface Ability {
  name: string;
  description: string;
  cooldown: string;
}

interface NFT {
  name: string;
  rarity: string;
  price: string;
  stats: {
    accuracy: number;
    power: number;
    survival: number;
  };
  abilities: Ability[];
}

interface Player {
  rank: number;
  name: string;
  points: number;
  tier: string;
  rewards: string;
}

interface SeasonalRankings {
  current: Player[];
  previous: Player[];
}

interface Tournament {
  name: string;
  date: string;
  prizePool: string;
  type: string;
  status: string;
  players: string;
}

interface Achievement {
  icon: React.ReactNode;
  title: string;
  description: string;
  rarity: string;
  holders: number;
}

export default function Home() {
  const [expandedNFT, setExpandedNFT] = useState<number | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<'current' | 'previous'>('current');
  const [showAllAchievements, setShowAllAchievements] = useState<boolean>(false);

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stats = [
    { icon: <Users />, value: "10K+", label: "Active Players" },
    { icon: <Trophy />, value: "$500K+", label: "Rewards Distributed" },
    { icon: <Sparkles />, value: "1M+", label: "Predictions Made" },
    { icon: <TrendingUp />, value: "95%", label: "Accuracy Rate" }
  ];

  const features = [
    {
      icon: <Gamepad2 className="w-8 h-8 text-purple-600" />,
      title: "NFT Characters",
      description: "Collect unique NFT avatars with special abilities and traits that give you advantages in prediction markets."
    },
    {
      icon: <Trophy className="w-8 h-8 text-purple-600" />,
      title: "Competitive Arenas",
      description: "Join daily tournaments and compete against other players for high-stakes rewards and leaderboard positions."
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      title: "Skill-Based Rewards",
      description: "Earn points and rewards based on your prediction accuracy and strategic gameplay decisions."
    }
  ];

  const howToPlaySteps = [
    {
      icon: <Users2 className="w-8 h-8 text-purple-600" />,
      title: "Form Your Squad",
      description: "Brave the arena solo or Join forces with other predictors - the choice is yours."
    },
    {
      icon: <Target className="w-8 h-8 text-purple-600" />,
      title: "Make Your Predictions",
      description: "Use your NFT character's unique abilities to make strategic market predictions."
    },
    {
      icon: <Sword className="w-8 h-8 text-purple-600" />,
      title: "Advance Through Rounds",
      description: "Survive each round by maintaining high prediction accuracy. Only the best move forward."
    },
    {
      icon: <Crown className="w-8 h-8 text-purple-600" />,
      title: "Become the Champion",
      description: "Be the last predictor standing to claim massive rewards and eternal glory."
    }
  ];

  const topNFTs = [
    {
      name: "Prophet Mage",
      rarity: "Legendary",
      price: "2.5 SOL",
      stats: { accuracy: 95, power: 88, survival: 92 },
      abilities: [
        {
          name: "Time Vision",
          description: "See market predictions 30 seconds before others",
          cooldown: "5 minutes"
        },
        {
          name: "Probability Shield",
          description: "Reduce impact of one wrong prediction by 50%",
          cooldown: "15 minutes"
        },
        {
          name: "Market Mastery",
          description: "Boost accuracy by 20% for next 3 predictions",
          cooldown: "30 minutes"
        }
      ]
    },
    {
      name: "Time Warrior",
      rarity: "Epic",
      price: "1.8 SOL",
      stats: { accuracy: 90, power: 94, survival: 85 },
      abilities: [
        {
          name: "Quick Strike",
          description: "Lock in predictions 2x faster",
          cooldown: "3 minutes"
        },
        {
          name: "Battle Focus",
          description: "Next prediction has 100% accuracy",
          cooldown: "20 minutes"
        },
        {
          name: "Rally Cry",
          description: "Boost team prediction speed by 30%",
          cooldown: "25 minutes"
        }
      ]
    },
    {
      name: "Oracle Knight",
      rarity: "Rare",
      price: "1.2 SOL",
      stats: { accuracy: 88, power: 82, survival: 89 },
      abilities: [
        {
          name: "Market Shield",
          description: "Block one negative market impact",
          cooldown: "10 minutes"
        },
        {
          name: "Tactical Insight",
          description: "See success probability of next prediction",
          cooldown: "15 minutes"
        },
        {
          name: "Survivalist",
          description: "Gain extra life in elimination rounds",
          cooldown: "45 minutes"
        }
      ]
    }
  ];

  const seasonalRankings: SeasonalRankings = {
    current: [
      { rank: 1, name: "CryptoSage", points: 15000, tier: "Grandmaster", rewards: "50 SOL" },
      { rank: 2, name: "PredictionKing", points: 14200, tier: "Master", rewards: "30 SOL" },
      { rank: 3, name: "OracleHunter", points: 13800, tier: "Diamond", rewards: "20 SOL" },
      { rank: 4, name: "TimeWizard", points: 13200, tier: "Diamond", rewards: "10 SOL" },
      { rank: 5, name: "FutureSeeker", points: 12900, tier: "Platinum", rewards: "5 SOL" }
    ],
    previous: [
      { rank: 1, name: "MarketOracle", points: 16500, tier: "Grandmaster", rewards: "60 SOL" },
      { rank: 2, name: "ChainMaster", points: 15800, tier: "Master", rewards: "35 SOL" },
      { rank: 3, name: "CryptoWizard", points: 15200, tier: "Diamond", rewards: "25 SOL" },
      { rank: 4, name: "BlockSeeker", points: 14500, tier: "Diamond", rewards: "12 SOL" },
      { rank: 5, name: "TokenHunter", points: 14100, tier: "Platinum", rewards: "6 SOL" }
    ]
  };

  const achievements = [
    {
      icon: <Crown className="w-6 h-6" />,
      title: "Prediction Prodigy",
      description: "Win 100 consecutive predictions",
      rarity: "Legendary",
      holders: 12
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Arena Champion",
      description: "Win 10 tournament finals",
      rarity: "Epic",
      holders: 89
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Unbreakable",
      description: "Survive 50 elimination rounds",
      rarity: "Rare",
      holders: 245
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Oracle",
      description: "Make 1000 predictions under 5 seconds",
      rarity: "Epic",
      holders: 156
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Squad Leader",
      description: "Lead team to 25 victories",
      rarity: "Rare",
      holders: 423
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: "NFT Collector",
      description: "Own 10 Legendary NFTs",
      rarity: "Epic",
      holders: 67
    }
  ];

  const tournaments = [
    {
      name: "Grand Champion Arena",
      date: "Dec 20, 2024",
      prizePool: "100 SOL",
      type: "Solo Battle Royale",
      status: "Registration Open",
      players: "128/128"
    },
    {
      name: "Squad Warfare",
      date: "Dec 22, 2024",
      prizePool: "75 SOL",
      type: "Team Tournament",
      status: "Registration Open",
      players: "45/64"
    },
    {
      name: "Lightning Round Challenge",
      date: "Dec 23, 2024",
      prizePool: "50 SOL",
      type: "Speed Prediction",
      status: "Coming Soon",
      players: "0/32"
    },
    {
      name: "Survival Series Finals",
      date: "Dec 25, 2024",
      prizePool: "100 SOL",
      type: "Elimination Battle",
      status: "Invitation Only",
      players: "16/16"
    }
  ];

  return (
    <>
    <Header />
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-purple-600/20" />
        
        {/* Animated background particles */}
        <motion.div 
          className="absolute inset-0 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center relative">
            <motion.h1 
              className="text-4xl md:text-6xl font-['Russo_One'] bg-gradient-to-r from-purple-600 to-blue-600 
                         text-transparent bg-clip-text mb-6"
              {...fadeInUp}
            >
              Gamified Prediction Markets
            </motion.h1>

            <motion.p 
              className="text-xl text-purple-900 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Compete in prediction arenas with NFT avatars and win rewards
            </motion.p>

            <motion.div 
              className="flex items-center justify-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Link
                  href="/marketplace"
                  className="inline-block px-8 py-3 rounded-lg bg-purple-600 text-white font-medium 
                           hover:bg-purple-700 transform transition-all duration-200"
                >
                  Browse Marketplace
                </Link>
              </motion.div>

              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Link
                  href="/arenas"
                  className="inline-block px-8 py-3 rounded-lg border-2 border-purple-600 text-purple-600 
                           font-medium hover:bg-purple-50 transform transition-all duration-200"
                >
                  Enter Arena
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-center mb-2 text-purple-600">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-purple-900 mb-1">{stat.value}</div>
                <div className="text-sm text-purple-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-purple-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Game-Changing Features
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-purple-900">{feature.title}</h3>
                <p className="text-purple-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Play Guide */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-purple-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Path to Victory
          </motion.h2>
          <div className="grid md:grid-cols-4 gap-8">
            {howToPlaySteps.map((step, index) => (
              <motion.div
                key={index}
                className="relative bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-purple-600 rounded-full text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-purple-900">{step.title}</h3>
                <p className="text-purple-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NFT Marketplace Preview */}
      <section className="py-16 bg-purple-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-purple-900">Featured Warriors</h2>
            <p className="text-purple-600 mt-2">Exclusive NFT Characters with Unique Abilities</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {topNFTs.map((nft, index) => (
              <motion.div
                key={index}
                className="bg-white/90 rounded-xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="h-48 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <img 
                    src={`/api/placeholder/200/200`} 
                    alt={nft.name}
                    className="w-32 h-32 object-cover rounded-lg shadow-lg"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-purple-900">{nft.name}</h3>
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                      {nft.rarity}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-purple-600">Accuracy</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 rounded-full h-2" 
                          style={{ width: `${nft.stats.accuracy}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-600">Power</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 rounded-full h-2" 
                          style={{ width: `${nft.stats.power}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-600">Survival</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 rounded-full h-2" 
                          style={{ width: `${nft.stats.survival}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expandable Abilities Section */}
                  <div className="mt-4 border-t border-purple-100 pt-4">
                    <button
                      onClick={() => setExpandedNFT(expandedNFT === index ? null : index)}
                      className="flex items-center justify-between w-full text-purple-600 hover:text-purple-700"
                    >
                      <span className="font-semibold">Special Abilities</span>
                      {expandedNFT === index ? <ChevronUp /> : <ChevronDown />}
                    </button>
                    
                    {expandedNFT === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 space-y-4"
                      >
                        {nft.abilities.map((ability, abilityIndex) => (
                          <div key={abilityIndex} className="bg-purple-50 p-3 rounded-lg">
                            <div className="font-semibold text-purple-900">{ability.name}</div>
                            <div className="text-sm text-purple-600">{ability.description}</div>
                            <div className="text-xs text-purple-500 mt-1">
                              Cooldown: {ability.cooldown}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-purple-900">{nft.price}</span>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Rankings */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-purple-900">Seasonal Rankings</h2>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={() => setSelectedSeason('current')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedSeason === 'current' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                }`}
              >
                Current Season
              </button>
              <button
                onClick={() => setSelectedSeason('previous')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedSeason === 'previous' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                }`}
              >
                Previous Season
              </button>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/90 rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {seasonalRankings[selectedSeason].map((player: Player, index: number) => (
              <motion.div
                key={index}
                className="flex items-center p-6 border-b border-purple-100 hover:bg-purple-50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="text-2xl font-bold text-purple-900">#{player.rank}</div>
                  <div className="flex-1">
                    <div className="font-bold text-purple-900">{player.name}</div>
                    <div className="text-sm text-purple-600">{player.tier}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-purple-900">{player.points.toLocaleString()} pts</div>
                  <div className="text-sm text-purple-600">{player.rewards} earned</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-purple-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-purple-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Epic Achievements
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {achievements.slice(0, showAllAchievements ? undefined : 3).map((achievement, index) => (
              <motion.div
                key={index}
                className="bg-white/90 rounded-xl shadow-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                    {achievement.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-900">{achievement.title}</h3>
                    <span className="text-sm text-purple-600">{achievement.rarity}</span>
                  </div>
                </div>
                <p className="text-purple-600 mb-4">{achievement.description}</p>
                <div className="text-sm text-purple-500">
                  {achievement.holders} players have earned this
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => setShowAllAchievements(!showAllAchievements)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {showAllAchievements ? 'Show Less' : 'View All Achievements'}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Tournament Schedule */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-purple-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Upcoming Tournaments
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-6">
            {tournaments.map((tournament, index) => (
              <motion.div
                key={index}
                className="bg-white/90 rounded-xl shadow-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-purple-900">{tournament.name}</h3>
                    <div className="text-purple-600">{tournament.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-purple-600">{tournament.date}</div>
                    <div className="font-bold text-purple-900">{tournament.prizePool}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    tournament.status === 'Registration Open' 
                      ? 'bg-green-100 text-green-600' 
                      : tournament.status === 'Coming Soon'
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    {tournament.status}
                  </span>
                  <span className="text-sm text-purple-600">{tournament.players} Players</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Start Predicting?</h2>
            <p className="text-purple-200 mb-8">Join thousands of players already earning rewards</p>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Link
                href="/signup"
                className="inline-block px-8 py-3 rounded-lg bg-white text-purple-900 font-medium 
                         hover:bg-purple-50 transform transition-all duration-200"
              >
                Start Playing Now
              </Link>
            </motion.div>
          </motion.div>

          {/* Live Stats Ticker */}
          <motion.div 
            className="bg-purple-800/50 p-4 rounded-lg backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-purple-300">Active Predictions</div>
                <div className="text-2xl font-bold">1,234</div>
              </div>
              <div>
                <div className="text-sm text-purple-300">Total Prize Pool</div>
                <div className="text-2xl font-bold">$25,000</div>
              </div>
              <div>
                <div className="text-sm text-purple-300">Online Players</div>
                <div className="text-2xl font-bold">789</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
    </>
  );
}
