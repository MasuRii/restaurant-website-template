import React, { useState } from 'react';

interface MenuItem {
  name: string;
  price: string;
  description: string;
  dietary?: string[];
}

interface MenuData {
  title: string;
  filters: {
    v: string;
    gf: string;
  };
  categories: {
    [key: string]: string;
  };
  items: {
    [key: string]: MenuItem[];
  };
}

interface MenuDisplayProps {
  data: MenuData;
}

export default function MenuDisplay({ data }: MenuDisplayProps) {
  const categoryKeys = Object.keys(data.categories);
  const [activeCategory, setActiveCategory] = useState(categoryKeys[0]);
  const [filters, setFilters] = useState<{ v: boolean; gf: boolean }>({ v: false, gf: false });

  const toggleFilter = (filter: 'v' | 'gf') => {
    setFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
  };

  const filteredItems = data.items[activeCategory]?.filter(item => {
    if (filters.v && !item.dietary?.includes('v')) return false;
    if (filters.gf && !item.dietary?.includes('gf')) return false;
    return true;
  }) || [];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
      {/* Filter Toggles */}
      <div className="flex justify-center md:justify-end gap-3 mb-12">
        <span className="text-sm font-medium text-charcoal/60 self-center mr-2 uppercase tracking-widest text-xs">Dietary</span>
        <button
          onClick={() => toggleFilter('v')}
          className={`px-4 py-1.5 text-xs uppercase tracking-wider font-medium rounded-full transition-all duration-300 border ${
            filters.v 
              ? 'bg-charcoal text-alabaster border-charcoal' 
              : 'bg-transparent text-charcoal/60 border-charcoal/20 hover:border-charcoal/60'
          }`}
          aria-pressed={filters.v}
        >
          {data.filters.v}
        </button>
        <button
          onClick={() => toggleFilter('gf')}
          className={`px-4 py-1.5 text-xs uppercase tracking-wider font-medium rounded-full transition-all duration-300 border ${
            filters.gf 
              ? 'bg-charcoal text-alabaster border-charcoal' 
              : 'bg-transparent text-charcoal/60 border-charcoal/20 hover:border-charcoal/60'
          }`}
          aria-pressed={filters.gf}
        >
          {data.filters.gf}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
        {/* Sidebar/Top Categories */}
        <nav className="flex md:flex-col overflow-x-auto md:overflow-visible gap-8 md:gap-6 md:w-48 border-b md:border-b-0 md:border-r border-charcoal/10 pb-4 md:pb-0 shrink-0 no-scrollbar" role="tablist">
          {categoryKeys.map(key => (
            <button
              key={key}
              role="tab"
              aria-selected={activeCategory === key}
              onClick={() => setActiveCategory(key)}
              className={`text-left whitespace-nowrap px-1 pb-3 md:pb-0 transition-all duration-300 text-lg md:text-xl font-serif ${
                activeCategory === key
                  ? 'text-charcoal border-b-2 md:border-b-0 md:border-r-2 border-charcoal -mb-[1px] md:-mr-[1px] md:mb-0 translate-x-0'
                  : 'text-charcoal/40 hover:text-charcoal/70 border-b-2 md:border-b-0 md:border-r-2 border-transparent'
              }`}
            >
              {data.categories[key]}
            </button>
          ))}
        </nav>

        {/* Items Grid */}
        <div className="flex-1 min-h-[400px]">
          <div key={activeCategory} className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <div 
                  key={index} 
                  className="group relative opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-baseline mb-3 border-b border-charcoal/10 pb-2 border-dashed">
                    <h3 className="text-xl font-serif text-charcoal group-hover:text-amber-900 transition-colors duration-300">
                      {item.name}
                    </h3>
                    <span className="text-lg font-medium text-charcoal/80 ml-6 shrink-0">{item.price}</span>
                  </div>
                  <p className="text-charcoal/60 leading-relaxed font-sans mb-3">{item.description}</p>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -right-2 top-0 translate-x-full md:static md:translate-x-0 md:opacity-100 md:mt-1">
                    {item.dietary?.map(tag => (
                      <span key={tag} className="text-[10px] uppercase tracking-widest text-charcoal/40 border border-charcoal/10 px-1.5 py-0.5 rounded-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-charcoal/40 text-lg font-serif italic">No items match your selected filters in this category.</p>
                <button 
                  onClick={() => setFilters({v: false, gf: false})}
                  className="mt-4 text-xs uppercase tracking-widest border-b border-charcoal/40 hover:border-charcoal text-charcoal/60 hover:text-charcoal transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
