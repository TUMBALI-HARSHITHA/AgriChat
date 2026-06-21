import React, { useState } from 'react';
import { Button, Input, Modal, Toast, Loader } from '../components/ui';
import { Mail, ShieldAlert, Sparkles } from 'lucide-react';

export default function Showcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [showFullLoader, setShowFullLoader] = useState(false);

  const triggerToast = (message, type) => {
    setToast({ message, type });
  };

  const handleTestLoader = () => {
    setShowFullLoader(true);
    setTimeout(() => {
      setShowFullLoader(false);
      triggerToast('Full-screen loader finished!', 'success');
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full page-enter flex flex-col items-center" style={{ paddingTop: '120px', paddingBottom: '96px' }}>
      <div className="max-w-5xl w-full px-6 sm:px-10 lg:px-16 flex flex-col items-center gap-y-14 md:gap-y-20">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center w-full gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center glow-green shrink-0">
            <Sparkles size={28} className="text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Component <span className="gradient-text">Showcase</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            A beautiful catalog documenting our shared UI design library. 
            All components are reusable, accessible, and responsive.
          </p>
        </div>

        {/* ─── 1. BUTTONS ─── */}
        <div className="w-full flex flex-col gap-5 text-left">
          <h2 className="text-xl font-bold text-white border-b border-green-950 pb-2">1. Buttons</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary" onClick={() => triggerToast('Primary button clicked!', 'success')}>Primary</Button>
            <Button variant="secondary" onClick={() => triggerToast('Secondary button clicked!', 'info')}>Secondary</Button>
            <Button variant="danger" onClick={() => triggerToast('Danger button clicked!', 'error')}>Danger</Button>
            <Button variant="ghost" onClick={() => triggerToast('Ghost button clicked!', 'warning')}>Ghost</Button>
          </div>
          <div className="flex flex-wrap gap-4 items-center mt-2">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="primary" isLoading={true}>Loading State</Button>
            <Button variant="primary" disabled={true}>Disabled</Button>
          </div>
        </div>

        {/* ─── 2. INPUTS ─── */}
        <div className="w-full flex flex-col gap-6 text-left">
          <h2 className="text-xl font-bold text-white border-b border-green-950 pb-2">2. Inputs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <Input 
              id="test-input-1"
              name="test1"
              label="Standard Input"
              placeholder="Type something..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input 
              id="test-input-2"
              name="test2"
              label="Input with Icon"
              placeholder="email@example.com"
              type="email"
              icon={<Mail size={16} />}
            />
            <Input 
              id="test-input-3"
              name="test3"
              label="Input with Error"
              placeholder="Error text..."
              error="This field is required and must contain a valid entry."
            />
          </div>
        </div>

        {/* ─── 3. MODALS ─── */}
        <div className="w-full flex flex-col gap-5 text-left">
          <h2 className="text-xl font-bold text-white border-b border-green-950 pb-2">3. Modals</h2>
          <div>
            <Button variant="secondary" onClick={() => setIsModalOpen(true)}>Open Demo Modal</Button>
          </div>
          
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Uttarakhand Agricultural Advisory Details"
            footer={
              <>
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={() => { setIsModalOpen(false); triggerToast('Advisory approved!', 'success'); }}>Approve</Button>
              </>
            }
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-900/10 border border-amber-800/20 text-amber-500">
                <ShieldAlert size={18} className="shrink-0" />
                <p className="text-xs">Always verify with a local extension officer before executing high-risk plans.</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Recommended Soil Treatment:</h4>
                <p className="text-gray-400">Apply organic mulch and compost to improve high-altitude soil quality before Rabi wheat sowing window.</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">Recommended Crops:</h4>
                <p className="text-gray-400">Wheat, Potato, Mustard, Pea, Garlic, Onion, and Oats are highly recommended.</p>
              </div>
            </div>
          </Modal>
        </div>

        {/* ─── 4. TOASTS ─── */}
        <div className="w-full flex flex-col gap-5 text-left">
          <h2 className="text-xl font-bold text-white border-b border-green-950 pb-2">4. Toasts</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="secondary" onClick={() => triggerToast('Successfully updated crop info!', 'success')}>Success Toast</Button>
            <Button variant="secondary" onClick={() => triggerToast('Error loading details. Try again.', 'error')}>Error Toast</Button>
            <Button variant="secondary" onClick={() => triggerToast('Vite HMR server compilation clean.', 'info')}>Info Toast</Button>
            <Button variant="secondary" onClick={() => triggerToast('Low memory space on host account.', 'warning')}>Warning Toast</Button>
          </div>
        </div>

        {/* ─── 5. LOADERS ─── */}
        <div className="w-full flex flex-col gap-5 text-left">
          <h2 className="text-xl font-bold text-white border-b border-green-950 pb-2">5. Loaders</h2>
          <div className="flex flex-wrap gap-12 items-center justify-start p-6 rounded-2xl bg-green-950/10 border border-green-900/10">
            <Loader size="sm" text="Checking DB" />
            <Loader size="md" text="Processing Advice" />
            <Loader size="lg" text="Consulting Gemini" />
            <Button variant="primary" onClick={handleTestLoader}>Test Full Screen Loader (2s)</Button>
          </div>
        </div>

      </div>

      {/* Render Toast if present */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Fullscreen Loader test */}
      {showFullLoader && (
        <Loader fullscreen={true} text="Initializing secure session..." />
      )}
    </div>
  );
}
