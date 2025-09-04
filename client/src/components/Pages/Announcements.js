import React, { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import AOS from 'aos';
import Header from '../Common/Header';
import 'aos/dist/aos.css';
import { 
  Bell, 
  Calendar, 
  Clock, 
  ExternalLink, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Star,
  ArrowLeft,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { FaRocket, FaUsers, FaCode } from 'react-icons/fa';

// Utility functions
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return formatDate(dateString).split(',')[0];
};

// Announcement type configurations
const getAnnouncementConfig = (type) => {
  const configs = {
    urgent: {
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50/80 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800/50',
      textColor: 'text-red-700 dark:text-red-300',
      badgeColor: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200',
      label: 'Urgent'
    },
    important: {
      icon: AlertCircle,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50/80 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800/50',
      textColor: 'text-orange-700 dark:text-orange-300',
      badgeColor: 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200',
      label: 'Important'
    },
    info: {
      icon: Info,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50/80 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800/50',
      textColor: 'text-blue-700 dark:text-blue-300',
      badgeColor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200',
      label: 'Info'
    }
  };
  return configs[type] || configs.info;
};

// Components
const AnnouncementCard = memo(({ announcement, index }) => {
  const config = getAnnouncementConfig(announcement.type);
  const Icon = config.icon;

  return (
    <div 
      className={`relative group ${config.bgColor} backdrop-blur-xl rounded-2xl p-6 border ${config.borderColor} transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden`}
      data-aos="fade-up" 
      data-aos-delay={index * 100}
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${config.badgeColor} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className={`text-xs font-medium ${config.badgeColor} px-2 py-1 rounded-full w-fit`}>
              {config.label}
            </span>
          </div>
        </div>
        <div className="text-right text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1 mb-1">
            <Clock className="w-3 h-3" />
            <span>{getTimeAgo(announcement.date)}</span>
          </div>
          <span>{announcement.readTime}</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#6366f1] group-hover:to-[#a855f7] transition-all duration-300">
          {announcement.title}
        </h3>
        
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-sm md:text-base">
          {announcement.content}
        </p>

        {/* Links */}
        {announcement.links && announcement.links.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {announcement.links.map((link, linkIndex) => (
              <a
                key={linkIndex}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                  link.type === 'primary'
                    ? 'bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white hover:from-[#5855eb] hover:to-[#9333ea] shadow-lg hover:shadow-xl'
                    : 'bg-white/50 dark:bg-white/10 text-gray-900 dark:text-white border border-white/20 hover:bg-white/80 dark:hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                <span>{link.text}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] flex items-center justify-center">
              <span className="text-xs font-bold text-white">A</span>
            </div>
            <span>By {announcement.author}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(announcement.date).split(',')[0]}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

const LoadingCard = memo(() => (
  <div className="bg-white/10 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-white/10 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
      <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
    </div>
    <div className="space-y-3">
      <div className="w-3/4 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div className="w-full h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div className="w-5/6 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div className="flex gap-3 mt-4">
        <div className="w-20 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="w-24 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    </div>
  </div>
));

const Announcements = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      once: true,
      offset: 10,
    });
  }, []);

  // Load announcements from JSON file
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/announcements.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch announcements: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Sort announcements by date (newest first)
        const sortedAnnouncements = data.announcements.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        
        setAnnouncements(sortedAnnouncements);
        setIsLoaded(true);
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Mark announcements as seen when user visits this page
  useEffect(() => {
    if (!isLoading && announcements.length > 0) {
      const seenIds = JSON.parse(localStorage.getItem('seenAnnouncements') || '[]');
      const allIds = announcements.map(ann => ann.id);
      const updatedSeen = [...new Set([...seenIds, ...allIds])];
      
      localStorage.setItem('seenAnnouncements', JSON.stringify(updatedSeen));
    }
  }, [announcements, isLoading]);

  // Filter announcements
  const filteredAnnouncements = announcements.filter(announcement => 
    filter === 'all' || announcement.type === filter
  );

  // Stats
  const stats = {
    total: announcements.length,
    urgent: announcements.filter(a => a.type === 'urgent').length,
    important: announcements.filter(a => a.type === 'important').length,
    info: announcements.filter(a => a.type === 'info').length
  };

  return (
    <>
    <Header />
      <div className="min-h-screen bg-white dark:bg-[#030014]">
        <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
          
          {/* Header Section */}
          <section className="relative pt-20 pb-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#030014]">
            <div className="max-w-7xl mx-auto">
              
              {/* Page Title */}
              <div className="text-center mb-8 mt-4">
                <div className="inline-block animate-float mb-4" data-aos="zoom-in">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-30"></div>
                    <div className="relative px-6 py-3 rounded-full bg-blue-50/90 dark:bg-black/40 backdrop-blur-xl border border-blue-200 dark:border-white/10">
                      <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-transparent bg-clip-text text-sm font-medium flex items-center">
                        <Bell className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                        Latest Updates & News
                      </span>
                    </div>
                  </div>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight" data-aos="fade-up" data-aos-delay="200">
                  <span className="relative inline-block">
                    <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
                    <span className="relative bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                      Announcements
                    </span>
                  </span>
                </h1>

                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="400">
                  Stay updated with the latest news, features, and important information from Alpha Knowledge
                </p>
              </div>

              {/* Stats Cards */}
              {!isLoading && !error && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" data-aos="fade-up" data-aos-delay="600">
                  <div className="bg-white/10 dark:bg-black/40 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-white/10">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                    </div>
                  </div>
                  <div className="bg-white/10 dark:bg-black/40 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-white/10">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.urgent}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Urgent</div>
                    </div>
                  </div>
                  <div className="bg-white/10 dark:bg-black/40 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-white/10">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.important}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Important</div>
                    </div>
                  </div>
                  <div className="bg-white/10 dark:bg-black/40 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-white/10">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.info}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Info</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Filter Buttons */}
              {!isLoading && !error && (
                <div className="flex flex-wrap justify-center gap-3 mb-6" data-aos="fade-up" data-aos-delay="800">
                  {['all', 'urgent', 'important', 'info'].map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filter === filterType
                          ? 'bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white shadow-lg'
                          : 'bg-white/10 dark:bg-black/20 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-black/30 border border-white/20'
                      }`}
                    >
                      {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                      {filterType !== 'all' && (
                        <span className="ml-2 text-xs opacity-75">
                          ({stats[filterType]})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Announcements List */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#030014]">
            <div className="max-w-4xl mx-auto">
              
              {/* Loading State */}
              {isLoading && (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <LoadingCard key={index} />
                  ))}
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-16" data-aos="fade-up">
                  <AlertTriangle className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Failed to load announcements
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {error}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white rounded-lg hover:from-[#5855eb] hover:to-[#9333ea] transition-all duration-200"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Announcements Content */}
              {!isLoading && !error && (
                <>
                  {filteredAnnouncements.length > 0 ? (
                    <div className="space-y-4">
                      {filteredAnnouncements.map((announcement, index) => (
                        <AnnouncementCard 
                          key={announcement.id} 
                          announcement={announcement} 
                          index={index}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16" data-aos="fade-up">
                      <Bell className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No announcements found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {announcements.length === 0 
                          ? "No announcements available at this time."
                          : "No announcements match your current filter."
                        }
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </div>

        {/* Custom Styles */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
};

export default memo(Announcements);
