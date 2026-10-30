import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  PlusCircle, MapPin, Camera, Sparkles, AlertTriangle, 
  CheckCircle2, RefreshCw, Upload, Image as ImageIcon, 
  HelpCircle, Shield, ArrowLeft, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCityData } from '../context/CityDataContext';
import { CityMap } from '../components/CityMap';
import { api } from '../services/api';

const COMPLAINT_CATEGORIES = [
  { id: 'roads', label: '1. Roads and Potholes', dept: 'dept-roads' },
  { id: 'traffic', label: '2. Traffic and Transportation', dept: 'dept-traffic' },
  { id: 'water', label: '3. Water Leakage and Water Supply', dept: 'dept-water' },
  { id: 'waste', label: '4. Garbage and Waste Management', dept: 'dept-waste' },
  { id: 'drainage', label: '5. Drainage and Sewage Blockage', dept: 'dept-water' },
  { id: 'flooding', label: '6. Flooding and Waterlogging', dept: 'dept-safety' },
  { id: 'streetlights', label: '7. Streetlights and Illumination', dept: 'dept-energy' },
  { id: 'electricity', label: '8. Electricity Infrastructure', dept: 'dept-energy' },
  { id: 'pollution', label: '9. Air and Noise Pollution', dept: 'dept-env' },
  { id: 'infrastructure', label: '10. Public Infrastructure', dept: 'dept-roads' },
  { id: 'cleanliness', label: '11. Public Cleanliness', dept: 'dept-waste' },
  { id: 'parks', label: '12. Parks and Public Spaces', dept: 'dept-env' },
  { id: 'transport', label: '13. Public Transport Facilities', dept: 'dept-traffic' },
  { id: 'safety', label: '14. Public Safety Hazards', dept: 'dept-safety' },
  { id: 'other', label: '15. Other Civic Issues', dept: 'dept-roads' },
];

const PRESET_EVIDENCE_IMAGES = [
  {
    name: 'Road Pothole',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800'
  },
  {
    name: 'Water Main Leak',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800'
  },
  {
    name: 'Overflowing Bin',
    url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=800'
  },
  {
    name: 'Dark Streetlight',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800'
  }
];

export const ReportProblemPage: React.FC = () => {
  const { user } = useAuth();
  const { createComplaint, departments } = useCityData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(searchParams.get('cat') || 'roads');
  const [description, setDescription] = useState('');
  const [ward, setWard] = useState('Ward 4 - Downtown Central');
  const [addressText, setAddressText] = useState('Central Avenue & 4th Cross');
  const [landmark, setLandmark] = useState('Near Metro Station Exit 2');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 40.7128,
    lng: -74.0060,
  });
  const [selectedImages, setSelectedImages] = useState<string[]>([
    PRESET_EVIDENCE_IMAGES[0].url
  ]);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');

  // AI Assistance State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    suggestedCategory?: string;
    suggestedPriority?: string;
    severityScore?: number;
    reasoning?: string;
  } | null>(null);

  // Submitting State & Success Modal
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleMapClick = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoordinates({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          alert('GPS location permission was denied. You can click on the map or enter address manually.');
        }
      );
    }
  };

  const runAiAnalysis = async () => {
    if (!title.trim() && !description.trim()) {
      alert('Please enter a complaint title or description first for CityAssist AI to analyze.');
      return;
    }
    setAiLoading(true);
    try {
      const result = await api.classifyComplaintAI(title, description);
      setAiSuggestions({
        suggestedCategory: result.category,
        suggestedPriority: result.priority,
        severityScore: result.severity_score,
        reasoning: result.ai_reasoning,
      });

      if (result.category) {
        setCategory(result.category);
      }
      if (result.priority) {
        setPriority(result.priority);
      }
    } catch (err) {
      console.error('AI analysis error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Title and description are required.');
      return;
    }

    setSubmitting(true);
    try {
      const selectedCategoryObj = COMPLAINT_CATEGORIES.find(c => c.id === category);
      const assignedDeptId = selectedCategoryObj?.dept || 'dept-roads';
      const assignedDeptObj = departments.find(d => d.id === assignedDeptId);

      const created = await createComplaint({
        title,
        description,
        category,
        priority,
        severity_score: aiSuggestions?.severityScore || 50,
        ward,
        address_text: `${addressText}${landmark ? ` (Landmark: ${landmark})` : ''}`,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        image_urls: selectedImages,
        assigned_department_id: assignedDeptId,
        assigned_department_name: assignedDeptObj?.name || 'Roads & Infrastructure',
        citizen_id: user?.id || 'user-citizen',
        citizen_name: user?.full_name || 'Aarav Mehta',
        citizen_email: user?.email || 'citizen@smartcity360.gov',
      });

      setSubmittedRef(created.reference_number);
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          Universal Municipal Grievance Redressal
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Report a Civic Problem
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Provide problem details, photographic evidence, and location coordinates. CityAssist AI will assist with classification and immediate dispatch.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Title & Category */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              1. Issue Details
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Complaint Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Severe Pothole with Exposed Rebar on Main Ring Road"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Civic Category (15 Standards) *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium"
              >
                {COMPLAINT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Detailed Description *
                </label>
                <button
                  type="button"
                  onClick={runAiAnalysis}
                  disabled={aiLoading}
                  className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {aiLoading ? 'Analyzing...' : 'AI Auto-Triage'}
                </button>
              </div>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the severity, duration of the issue, and immediate safety impact on motorists or pedestrians..."
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all leading-relaxed"
              />
            </div>

            {/* AI Suggestion Box */}
            {aiSuggestions && (
              <div className="bg-brand-50/70 border border-brand-200 rounded-2xl p-4 text-xs space-y-1.5 animate-scale-in">
                <div className="flex items-center gap-2 font-bold text-brand-900">
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  CityAssist AI Analysis Recommendation
                </div>
                <p className="text-brand-800 leading-relaxed">
                  {aiSuggestions.reasoning}
                </p>
                <div className="flex flex-wrap gap-2 pt-1 font-semibold text-slate-700">
                  <span className="bg-white px-2 py-0.5 rounded border border-brand-200">
                    Category: {aiSuggestions.suggestedCategory?.toUpperCase()}
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-brand-200">
                    Severity: {aiSuggestions.severityScore}/100
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-brand-200 text-rose-600">
                    Suggested Priority: {aiSuggestions.suggestedPriority?.toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Photo Evidence */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              2. Photographic Evidence
            </h2>
            <p className="text-xs text-slate-500">
              Select demonstration proof photos or upload evidence from your device.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESET_EVIDENCE_IMAGES.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImages([img.url])}
                  className={`cursor-pointer rounded-2xl overflow-hidden border-2 relative transition-all group ${
                    selectedImages.includes(img.url)
                      ? 'border-brand-600 ring-2 ring-brand-500/20 shadow-md'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.name} className="w-full h-20 object-cover" />
                  <div className="p-1.5 bg-white text-center">
                    <span className="text-[10px] font-bold text-slate-700 block truncate">
                      {img.name}
                    </span>
                  </div>
                  {selectedImages.includes(img.url) && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-brand-600 text-white rounded-full flex items-center justify-center text-[10px] shadow">
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Location Fields */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                3. Problem Location
              </h2>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                Use GPS Coordinate
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Municipal Ward *
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none"
                >
                  <option value="Ward 1 - North Riverside">Ward 1 - North Riverside</option>
                  <option value="Ward 2 - East Harbor">Ward 2 - East Harbor</option>
                  <option value="Ward 3 - West End District">Ward 3 - West End District</option>
                  <option value="Ward 4 - Downtown Central">Ward 4 - Downtown Central</option>
                  <option value="Ward 5 - South Metropolis">Ward 5 - South Metropolis</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Street / Address Text *
                </label>
                <input
                  type="text"
                  required
                  value={addressText}
                  onChange={(e) => setAddressText(e.target.value)}
                  placeholder="Street name, junction, or avenue"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Landmark (Optional)
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="Opposite city hospital, near traffic signal, etc."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-brand-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Registering Grievance in Municipal Database...
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                Submit Official Civic Report
              </>
            )}
          </button>
        </form>

        {/* Map Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 sticky top-24">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-600" />
                Click Map to Place Pin
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Pinpoint the exact location of the issue. Field squads use these GPS coordinates for dispatch.
            </p>

            <CityMap
              height="360px"
              selectedLocation={coordinates}
              onSelectLocation={handleMapClick}
              interactiveSelect
            />

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800">
                Privacy Assurance
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Your personal identity is masked. Only the issue coordinates, category, and evidence photographs are shared with municipal field crews.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Success Modal */}
      {submittedRef && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-center border border-slate-200 animate-scale-in space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Grievance Officially Registered
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                Report Submitted Successfully
              </h3>
              <p className="text-xs text-slate-500 mt-1.5">
                Your report has been received by Municipal Dispatch and auto-routed for verification.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-400 block font-semibold uppercase tracking-wider">
                Unique Tracking Reference
              </span>
              <span className="text-lg font-mono font-extrabold text-brand-600 mt-0.5 block">
                #{submittedRef}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => navigate('/citizen')}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Track in Citizen Dashboard →
              </button>
              <button
                onClick={() => {
                  setSubmittedRef(null);
                  setTitle('');
                  setDescription('');
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all"
              >
                Report Another Problem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
