import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin, Calendar, Search, ArrowRight } from 'lucide-react';
import axios from 'axios';

const App = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // State untuk Filter
  const [selectedEvent, setSelectedEvent] = useState('All Events');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedDate, setSelectedDate] = useState('All Dates');

  // State untuk Data dari API
  const [achievements, setAchievements] = useState([]);
  const [news, setNews] = useState([]);
  const [schemes, setSchemes] = useState([]); 

  // Opsi Filter Statis
  const events = ['All Events', 'Certification', 'Training', 'Workshop', 'Seminar'];
  const cities = ['All Cities', 'Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Makassar'];
  const dates = ['All Dates', 'Today', 'This Week', 'This Month', 'Next Month'];

  // 1. Fetch Data Awal saat halaman dimuat
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Panggil API backend kita
        const resAch = await axios.get('https://webkampus-server.vercel.app/api/achievements');
        setAchievements(resAch.data);

        const resNews = await axios.get('https://webkampus-server.vercel.app/api/news');
        setNews(resNews.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    fetchInitialData();
  }, []);

  // 2. Handle Search
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = axios.get('https://webkampus-server.vercel.app/api/schemes', {
        params: {
          type: selectedEvent,
          city: selectedCity,
          date: selectedDate
        }
      });
      setSchemes(response.data);
      alert(`Ditemukan ${response.data.length} data! Lihat di bawah form pencarian.`);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Auth Bar */}
      <div className="bg-blue-600 text-white py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex justify-end space-x-6 text-sm">
          <button className="hover:text-blue-200 transition-colors">Login</button>
          <button className="hover:text-blue-200 transition-colors">Register</button>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-center h-16">
             <div className="flex-shrink-0">
               <div className="text-2xl font-bold text-blue-600">LSP Digital</div>
             </div>
             <nav className="hidden md:flex space-x-8">
               <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
               <div className="relative">
                 <button 
                   onMouseEnter={() => setIsDropdownOpen(true)}
                   onMouseLeave={() => setIsDropdownOpen(false)}
                   className="flex items-center text-gray-700 hover:text-blue-600 font-medium"
                 >
                   Dropdown <ChevronDown className="ml-1 h-4 w-4" />
                 </button>
                 {isDropdownOpen && (
                   <div 
                     onMouseEnter={() => setIsDropdownOpen(true)}
                     onMouseLeave={() => setIsDropdownOpen(false)}
                     className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                   >
                     <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Services</a>
                   </div>
                 )}
               </div>
             </nav>
           </div>
        </div>
      </header>

      {/* Banner */}
      <div className="relative w-full h-96 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Professional Certification & Training</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">Empowering professionals with industry-recognized credentials</p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
              <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                {events.map((evt, idx) => <option key={idx} value={evt}>{evt}</option>)}
              </select>
            </div>
            <div className="flex-1">
               <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
               <div className="relative">
                 <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                 <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2">
                   {cities.map((city, idx) => <option key={idx} value={city}>{city}</option>)}
                 </select>
               </div>
            </div>
            <div className="flex-1">
               <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
               <div className="relative">
                 <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                 <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2">
                   {dates.map((date, idx) => <option key={idx} value={date}>{date}</option>)}
                 </select>
               </div>
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md flex items-center justify-center">
                <Search className="mr-2 h-5 w-5" /> Search
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* HASIL PENCARIAN (Muncul setelah klik search) */}
      {schemes.length > 0 && (
         <div className="max-w-7xl mx-auto px-4 mt-8 pb-8">
             <h3 className="text-xl font-bold mb-4">Hasil Pencarian:</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {schemes.map(sch => (
                     <div key={sch.id} className="bg-white p-4 rounded shadow border hover:shadow-md transition">
                         <h4 className="font-bold text-blue-600 text-lg">{sch.title}</h4>
                         <div className="flex gap-2 text-sm text-gray-500 mt-1">
                             <span className="bg-gray-100 px-2 py-0.5 rounded">{sch.type}</span>
                             <span className="bg-gray-100 px-2 py-0.5 rounded">{sch.city}</span>
                         </div>
                         <p className="text-sm text-gray-600 mt-2">{sch.description}</p>
                         <p className="text-xs text-gray-400 mt-2">Mulai: {sch.start_date}</p>
                     </div>
                 ))}
             </div>
         </div>
      )}

      {/* Achievements Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Achievements</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.length === 0 ? <p className="text-center col-span-3">Loading achievements...</p> : 
             achievements.map((achievement) => (
              <div key={achievement.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{achievement.title}</h3>
                  <p className="text-gray-600 mb-4">{achievement.description}</p>
                  <a href={achievement.link || '#'} className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest News</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {news.length === 0 ? <p className="text-center col-span-3">Loading news...</p> : 
             news.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <div className="text-sm text-gray-500 mb-2">{item.published_date}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 line-clamp-3">{item.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
             <p>&copy; 2026 LSP Digital. All rights reserved.</p>
          </div>
      </footer>
    </div>
  );
};

export default App;