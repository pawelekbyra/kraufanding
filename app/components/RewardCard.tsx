import { Reward } from "../data/types/campaign";

export const RewardCard = ({ reward }: { reward: Reward }) => {
  return (
    <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-6 transition-all hover:bg-zinc-800/80 hover:shadow-2xl">
      <div className="absolute top-0 right-0 p-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400">
           {reward.backers} Backers
        </span>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
            {reward.title}
          </h3>
          <p className="mt-2 text-2xl font-black text-white">
            ${reward.amount} <span className="text-sm font-normal text-zinc-500">or more</span>
          </p>
        </div>
        <p className="text-sm leading-relaxed text-zinc-400">
          {reward.description}
        </p>
        <div className="space-y-3">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Includes</p>
          <ul className="space-y-2">
            {reward.items.map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-zinc-300">
                 <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                 {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
           <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Estimated Delivery</p>
              <p className="text-sm font-semibold text-white mt-1">{reward.estimatedDelivery}</p>
           </div>
           <button className="rounded-lg bg-zinc-800 px-6 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-600 active:scale-95">
              Select
           </button>
        </div>
      </div>
    </div>
  );
};
