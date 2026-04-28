import React, { useState } from 'react';
import { Search, MapPin, Calendar, Phone, AlertCircle, Plus, Users, User, Image as ImageIcon } from 'lucide-react';

interface MissingPerson {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastSeenLocation: string;
  dateMissing: string;
  description: string;
  contactNumber: string;
  status: 'Missing' | 'Found';
  imageUrl: string;
}

const MOCK_DATA: MissingPerson[] = [
  {
    id: "1",
    name: "Sunil Perera",
    age: 45,
    gender: "Male",
    lastSeenLocation: "Kaduwela, Colombo",
    dateMissing: "2024-05-12",
    description: "Wearing a blue shirt and black trousers. Approximately 5'6\" tall.",
    contactNumber: "077-1234567",
    status: "Missing",
    imageUrl: "https://i.pravatar.cc/150?u=1"
  },
  {
    id: "2",
    name: "Amara Silva",
    age: 32,
    gender: "Female",
    lastSeenLocation: "Matara town near bus stand",
    dateMissing: "2024-05-14",
    description: "Wearing a red saree. Has a visible scar on the left cheek.",
    contactNumber: "071-9876543",
    status: "Missing",
    imageUrl: "https://i.pravatar.cc/150?u=2"
  },
  {
    id: "3",
    name: "Kamal Rathnayake",
    age: 60,
    gender: "Male",
    lastSeenLocation: "Galle Fort area",
    dateMissing: "2024-05-10",
    description: "Elderly man, wearing spectacles, white shirt and sarong. Memory issues.",
    contactNumber: "070-1122334",
    status: "Missing",
    imageUrl: "https://i.pravatar.cc/150?u=3"
  },
  {
    id: "4",
    name: "Nimali Fernando",
    age: 28,
    gender: "Female",
    lastSeenLocation: "Ratnapura town",
    dateMissing: "2024-05-15",
    description: "Last seen carrying a brown handbag, wearing a yellow dress.",
    contactNumber: "077-4455667",
    status: "Missing",
    imageUrl: "https://i.pravatar.cc/150?u=4"
  },
  {
    id: "5",
    name: "Kasun Jayawardena",
    age: 18,
    gender: "Male",
    lastSeenLocation: "Kandy lake round",
    dateMissing: "2024-05-16",
    description: "School unifrom (white shirt, blue shorts). Carrying a black backpack.",
    contactNumber: "071-2233445",
    status: "Missing",
    imageUrl: "https://i.pravatar.cc/150?u=5"
  },
  {
    id: "6",
    name: "Priyanka Fonseka",
    age: 50,
    gender: "Female",
    lastSeenLocation: "Chilaw beach road",
    dateMissing: "2024-05-11",
    description: "Wearing a white dress. Height 5'2\".",
    contactNumber: "072-5566778",
    status: "Missing",
    imageUrl: "https://i.pravatar.cc/150?u=6"
  },
  {
    id: "7",
    name: "Ruwan Bandara",
    age: 35,
    gender: "Male",
    lastSeenLocation: "Anuradhapura new town",
    dateMissing: "2024-05-13",
    description: "Wearing a green t-shirt and jeans. Short hair.",
    contactNumber: "078-9988776",
    status: "Missing",
    imageUrl: "https://i.pravatar.cc/150?u=7"
  },
  {
    id: "8",
    name: "Sanduni Perera",
    age: 22,
    gender: "Female",
    lastSeenLocation: "Negombo, near church",
    dateMissing: "2024-05-17",
    description: "Wearing a black top and blue jeans.",
    contactNumber: "077-6655443",
    status: "Found",
    imageUrl: "https://i.pravatar.cc/150?u=8"
  },
  {
    id: "9",
    name: "Jagath Kumara",
    age: 55,
    gender: "Male",
    lastSeenLocation: "Badulla market",
    dateMissing: "2024-05-09",
    description: "Wearing a checked shirt and brown trousers.",
    contactNumber: "070-8877665",
    status: "Missing",
    imageUrl: "https://i.pravatar.cc/150?u=9"
  },
  {
    id: "10",
    name: "Malkanthi Silva",
    age: 40,
    gender: "Female",
    lastSeenLocation: "Kurunegala bus stand",
    dateMissing: "2024-05-12",
    description: "Wearing a blue skirt and white blouse.",
    contactNumber: "071-3344556",
    status: "Missing",
    imageUrl: "https://i.pravatar.cc/150?u=10"
  }
];

export default function MissingPersons() {
  const [persons, setPersons] = useState<MissingPerson[]>(MOCK_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  // New person form state
  const [formData, setFormData] = useState({
    name: "", age: "", gender: "Male", lastSeenLocation: "", dateMissing: "", description: "", contactNumber: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPerson: MissingPerson = {
      id: Math.random().toString(),
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      lastSeenLocation: formData.lastSeenLocation,
      dateMissing: formData.dateMissing,
      description: formData.description,
      contactNumber: formData.contactNumber,
      status: 'Missing',
      imageUrl: `https://i.pravatar.cc/150?u=${Math.random()}` 
    };
    setPersons([newPerson, ...persons]);
    setFormData({ name: "", age: "", gender: "Male", lastSeenLocation: "", dateMissing: "", description: "", contactNumber: "" });
    setShowForm(false);
  };

  const filteredPersons = persons.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.lastSeenLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="text-pink-400" size={32} />
            Missing Persons Registry
          </h1>
          <p className="text-slate-400 mt-2">
            Help us reunite families. Browse reported missing persons or submit a new report.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-pink-900/20"
        >
          <Plus size={20} />
          {showForm ? 'Close Form' : 'Report Missing Person'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: List */}
        <div className={`space-y-4 transition-all duration-300 ${showForm ? 'col-span-1 lg:col-span-2' : 'col-span-1 lg:col-span-3'}`}>
          {/* Search */}
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative">
            <Search className="absolute left-7 top-7 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
            />
          </div>

          <div className={`grid grid-cols-1 ${showForm ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} gap-4`}>
            {filteredPersons.map((person) => (
              <div key={person.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-pink-500/30 transition-all group">
                <div className="relative">
                  <img src={person.imageUrl} alt={person.name} className="w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                    person.status === 'Missing' ? 'bg-red-500/90 text-white' : 'bg-green-500/90 text-white'
                  }`}>
                    {person.status}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {person.name}
                  </h3>

                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-slate-500" />
                      <span>{person.age} yrs • {person.gender}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-slate-500 mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{person.lastSeenLocation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-slate-500" />
                      <span>{person.dateMissing}</span>
                    </div>
                    <div className="flex items-center gap-2 text-pink-300 font-medium">
                      <Phone size={16} />
                      <span>{person.contactNumber}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-700 text-sm text-slate-400 line-clamp-2">
                    {person.description}
                  </div>
                </div>
              </div>
            ))}

            {filteredPersons.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
                <AlertCircle size={48} className="mx-auto mb-4 text-slate-600" />
                <p>No persons found matching your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Form (Sticky) */}
        {showForm && (
          <div className="col-span-1">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-700 pb-4">
                <AlertCircle className="text-pink-500" size={24} />
                Report Missing
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Full Name *</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-pink-500 transition-all" placeholder="e.g. Kasun Silva" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Age *</label>
                    <input required name="age" value={formData.age} onChange={handleInputChange} type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-pink-500 transition-all" placeholder="e.g. 30" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Gender *</label>
                    <div className="relative">
                      <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-pink-500 transition-all appearance-none">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Last Seen Location *</label>
                  <input required name="lastSeenLocation" value={formData.lastSeenLocation} onChange={handleInputChange} type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-pink-500 transition-all" placeholder="e.g. Colombo Fort" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Date Missing *</label>
                  <input required name="dateMissing" value={formData.dateMissing} onChange={handleInputChange} type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-pink-500 transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Detailed Description *</label>
                  <textarea required name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-pink-500 transition-all" placeholder="Clothing, physical traits, etc."></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Contact Number for Info *</label>
                  <input required name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-pink-500 transition-all" placeholder="e.g. 077-1234567" />
                </div>

                {/* Photo upload mock */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Upload Photo (Optional)</label>
                  <div className="w-full bg-slate-900 border border-slate-700 border-dashed rounded-lg px-4 py-6 text-center text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-all cursor-pointer flex flex-col items-center gap-2">
                    <ImageIcon size={24} />
                    <span className="text-sm">Click to upload image</span>
                  </div>
                </div>

                <button type="submit" className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-pink-900/20 mt-4">
                  Submit Report
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
