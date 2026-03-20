import { Campaign } from "../data/types/campaign";

interface ProgressBarProps {
  raised: number;
  goal: number;
}

export const ProgressBar = ({ raised, goal }: ProgressBarProps) => {
  const percentage = Math.min(Math.round((raised / goal) * 100), 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-zinc-400">Progress</span>
        <span className="text-sm font-bold text-white">{percentage}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-1000 ease-out relative group"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export const CampaignHero = ({ campaign }: { campaign: Campaign }) => {
  return (
    <section className="relative py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-400 uppercase">
              Featured Campaign
            </div>
            <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl leading-[1.1]">
              {campaign.title}
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed max-w-xl">
              {campaign.tagline}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center overflow-hidden">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="backer" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-zinc-400">
                Joined by <span className="text-white">+{campaign.backers} backers</span>
              </p>
            </div>
          </div>

          <div className="relative group">
             <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 blur-2xl group-hover:opacity-30 transition duration-1000"></div>
             <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 space-y-6 bg-zinc-900/40 backdrop-blur-md border-t border-white/5">
                   <div className="grid grid-cols-3 gap-8">
                      <div>
                         <p className="text-2xl font-bold text-white">${campaign.raised.toLocaleString()}</p>
                         <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Raised</p>
                      </div>
                      <div>
                         <p className="text-2xl font-bold text-white">{campaign.daysRemaining}</p>
                         <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Days Left</p>
                      </div>
                      <div>
                         <p className="text-2xl font-bold text-white">{campaign.category}</p>
                         <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Category</p>
                      </div>
                   </div>
                   <ProgressBar raised={campaign.raised} goal={campaign.goal} />
                   <button className="w-full rounded-xl bg-white py-4 text-center font-bold text-black transition-all hover:bg-zinc-200 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                      Back this project
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
