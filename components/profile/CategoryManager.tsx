"use client";

import React, { useState } from 'react';
import { Plus, X, Tag } from 'lucide-react';

export const CategoryManager = () => {
  const [categories, setCategories] = useState(['Food', 'Rent', 'Zepto', 'Zomato', 'Bills']);
  const [isAdding, setIsAdding] = useState(false);
  const [newCat, setNewCat] = useState('');

  const addCategory = () => {
    if (newCat && !categories.includes(newCat)) {
      setCategories([...categories, newCat]);
      setNewCat('');
      setIsAdding(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Tag className="text-purple-400" size={20} />
          <h3 className="text-white font-semibold">Manage Categories</h3>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
          >
            + Add New
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <div
            key={cat}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-slate-300 group hover:border-purple-500/50 transition-all"
          >
            {cat}
            <button
              onClick={() => setCategories(categories.filter(c => c !== cat))}
              className="text-slate-600 hover:text-red-400 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {isAdding && (
          <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
            <input
              autoFocus
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCategory()}
              placeholder="Category name..."
              className="bg-slate-950 border border-purple-500/50 rounded-xl px-3 py-1.5 text-sm text-white outline-none w-32"
            />
            <button
              onClick={addCategory}
              className="p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-500"
            >
              <Plus size={16} />
            </button>
            <button onClick={() => setIsAdding(false)} className="text-slate-500">
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      <p className="text-[10px] text-slate-500 mt-4 italic">
        * These categories help the AI categorize your "Eg: spend 2000 on {categories[0]}" prompts.
      </p>
    </div>
  );
};