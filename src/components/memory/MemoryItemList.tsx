import React from 'react';
import { ChevronRight, File, MessageSquare, Clock } from 'lucide-react';

const MemoryItemList: React.FC = () => {
  // Example memory items
  const memoryItems = [
    {
      id: 'item-1',
      title: 'Project Requirements Document',
      type: 'document',
      source: 'Project Documentation',
      createdAt: '2 days ago',
      size: '4.2 KB',
      icon: <File size={16} className="text-indigo-600" />,
    },
    {
      id: 'item-2',
      title: 'Weekly Team Meeting Notes',
      type: 'conversation',
      source: 'Session Memory',
      createdAt: '5 hours ago',
      size: '2.8 KB',
      icon: <MessageSquare size={16} className="text-teal-600" />,
    },
    {
      id: 'item-3',
      title: 'Project Timeline Discussion',
      type: 'conversation',
      source: 'Session Memory',
      createdAt: '1 day ago',
      size: '3.5 KB',
      icon: <MessageSquare size={16} className="text-teal-600" />,
    },
    {
      id: 'item-4',
      title: 'Technical Specification',
      type: 'document',
      source: 'Project Qdrant Instance',
      createdAt: '3 days ago',
      size: '8.7 KB',
      icon: <File size={16} className="text-indigo-600" />,
    },
    {
      id: 'item-5',
      title: 'Client Feedback Session',
      type: 'conversation',
      source: 'Session Memory',
      createdAt: '2 hours ago',
      size: '1.9 KB',
      icon: <MessageSquare size={16} className="text-teal-600" />,
    },
  ];
  
  return (
    <div className="overflow-hidden">
      <ul className="divide-y divide-slate-200">
        {memoryItems.map((item) => (
          <li key={item.id} className="hover:bg-slate-50 transition-colors">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center min-w-0">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-md bg-slate-100 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-slate-900 truncate">{item.title}</h4>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-slate-500">{item.source}</span>
                    <span className="mx-2 text-slate-300">•</span>
                    <span className="text-xs text-slate-500">{item.type}</span>
                    <span className="mx-2 text-slate-300">•</span>
                    <span className="text-xs text-slate-500 flex items-center">
                      <Clock size={12} className="mr-1" />
                      {item.createdAt}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="ml-4 flex items-center space-x-4">
                <span className="text-sm text-slate-500">{item.size}</span>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemoryItemList;