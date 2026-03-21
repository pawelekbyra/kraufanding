'use client';

import React, { useState } from 'react';

export default function Home() {
  const [raised, setRaised] = useState(6500);
  const goal = 10000;
  const [activeTab, setActiveTab] = useState(0);
  const [comments, setComments] = useState<string[]>([]);
  const [commentText, setCommentText] = useState('');

  const updateRaised = (amount: number) => {
    setRaised(prev => prev + amount);
  };

  const donate = () => {
    const val = prompt("Amount:");
    if (!val || isNaN(Number(val))) return;
    updateRaised(parseInt(val));
  };

  const donateFixed = (v: number) => {
    updateRaised(v);
  };

  const addComment = () => {
    if (!commentText) return;
    setComments(prev => [...prev, commentText]);
    setCommentText('');
  };

  const progressPercent = Math.min((raised / goal) * 100, 100);

  return (
    <div className="min-h-screen bg-[#f4f6f9] font-sans text-[#222]">
      <header className="bg-[#111] text-white py-6 px-4 text-center">
        <h1 className="text-3xl font-bold">I raise money for my secret projekt</h1>
      </header>

      <main className="max-w-[1200px] mx-auto p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Left Column */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-xl p-5 shadow-[0_5px_20px_rgba(0,0,0,0.08)]">
              <img
                src="https://picsum.photos/1000/400"
                alt="Project"
                className="w-full rounded-xl mb-4"
              />
              <h2 className="text-2xl font-bold mb-4">About Project</h2>
              <p className="leading-relaxed">
                This is a secret project. Full details will be revealed later.
                Support now to be part of something big.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-[0_5px_20px_rgba(0,0,0,0.08)]">
              <div className="flex gap-2.5 mt-5">
                {['Story', 'Updates', 'Comments'].map((tab, idx) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(idx)}
                    className={`px-4 py-2.5 rounded-md cursor-pointer transition-colors ${
                      activeTab === idx ? 'bg-[#28a745] text-white' : 'bg-[#ddd]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                {activeTab === 0 && (
                  <div className="block">
                    <p>Long story about the project. Vision, mission, roadmap, etc.</p>
                  </div>
                )}
                {activeTab === 1 && (
                  <div className="block">
                    <p>No updates yet.</p>
                  </div>
                )}
                {activeTab === 2 && (
                  <div className="block">
                    <div id="comments">
                      {comments.map((c, i) => (
                        <div key={i} className="border-b border-[#eee] py-2.5">
                          {c}
                        </div>
                      ))}
                    </div>
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write comment"
                      className="w-full p-2.5 mt-2.5 rounded-md border border-[#ccc] outline-none"
                    />
                    <button
                      onClick={addComment}
                      className="mt-2 bg-[#28a745] text-white px-4 py-2 rounded-md hover:bg-[#218838] transition-colors"
                    >
                      Add comment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-5 shadow-[0_5px_20px_rgba(0,0,0,0.08)]">
              <h3 className="text-xl font-bold mb-2">Funding</h3>
              <div className="h-3 bg-[#eee] rounded-full overflow-hidden my-2.5">
                <div
                  className="h-full bg-[#28a745] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <p className="mb-1">
                <b className="text-lg">€{raised}</b> raised of €10000
              </p>
              <p className="text-sm text-gray-600">32 backers • 12 days left</p>
              <button
                onClick={donate}
                className="block w-full text-center py-3.5 bg-[#28a745] text-white rounded-lg mt-4 font-bold hover:bg-[#218838] transition-colors"
              >
                Back this project
              </button>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-[0_5px_20px_rgba(0,0,0,0.08)]">
              <h3 className="text-xl font-bold mb-4">Rewards</h3>

              {[
                { amount: 10, title: 'Thank you email' },
                { amount: 50, title: 'Early access' },
                { amount: 100, title: 'VIP supporter' },
              ].map((reward) => (
                <div key={reward.amount} className="border border-[#eee] p-4 rounded-xl mb-2.5">
                  <h4 className="font-bold text-lg">€{reward.amount}</h4>
                  <p className="text-gray-600 mb-2">{reward.title}</p>
                  <button
                    onClick={() => donateFixed(reward.amount)}
                    className="bg-[#28a745] text-white px-4 py-1.5 rounded-md hover:bg-[#218838] transition-colors text-sm"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
