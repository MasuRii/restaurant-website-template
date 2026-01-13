import React, { useState, useEffect } from 'react';

interface OrderOnlineModalProps {
  strings: {
    title: string;
    delivery: string;
    pickup: string;
    deliveryPartners: string;
    pickupTime: string;
    asap: string;
    schedule: string;
    close: string;
    orderNow: string;
  };
}

export const OrderOnlineModal: React.FC<OrderOnlineModalProps> = ({ strings }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'delivery' | 'pickup'>('delivery');
  const [pickupTime, setPickupTime] = useState('');

  useEffect(() => {
    const handleOpen = () => setIsVisible(true);
    const handleClose = () => setIsVisible(false);

    document.addEventListener('open-order-online', handleOpen);
    document.addEventListener('close-order-online', handleClose);

    return () => {
      document.removeEventListener('open-order-online', handleOpen);
      document.removeEventListener('close-order-online', handleClose);
    };
  }, []);

  const closeModal = () => {
    setIsVisible(false);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-charcoal p-0 rounded-lg shadow-xl animate-in zoom-in-95 duration-300 border border-gray-100 dark:border-gray-800 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 id="order-modal-title" className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
            {strings.title}
          </h2>
          <button 
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
            aria-label={strings.close}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-800">
          <button
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'delivery'
                ? 'text-primary border-b-2 border-primary bg-primary/5 dark:bg-primary/10'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('delivery')}
          >
            {strings.delivery}
          </button>
          <button
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'pickup'
                ? 'text-primary border-b-2 border-primary bg-primary/5 dark:bg-primary/10'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('pickup')}
          >
            {strings.pickup}
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'delivery' ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {strings.deliveryPartners}
              </p>
              <div className="grid grid-cols-1 gap-3">
                {['UberEats', 'DoorDash', 'Grubhub'].map((partner) => (
                  <button
                    key={partner}
                    onClick={() => window.open(`https://www.${partner.toLowerCase()}.com`, '_blank')}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group w-full"
                  >
                    <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {partner}
                    </span>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {strings.pickupTime}
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <input
                      type="radio"
                      name="pickup-time"
                      value="asap"
                      defaultChecked
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      onChange={() => setPickupTime('asap')}
                    />
                    <span className="text-gray-900 dark:text-white font-medium">{strings.asap}</span>
                    <span className="text-xs text-gray-500 ml-auto">~20-30 mins</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <input
                      type="radio"
                      name="pickup-time"
                      value="schedule"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      onChange={() => setPickupTime('schedule')}
                    />
                    <span className="text-gray-900 dark:text-white font-medium">{strings.schedule}</span>
                  </label>

                  {pickupTime === 'schedule' && (
                    <input
                      type="datetime-local"
                      className="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-charcoal dark:text-white"
                    />
                  )}
                </div>
              </div>

              <button className="w-full btn-primary py-3 text-base">
                {strings.orderNow}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
