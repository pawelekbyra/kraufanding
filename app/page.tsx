import { Navbar } from "./components/Navbar";
import { CampaignHero } from "./components/CampaignHero";
import { ProjectTabs } from "./components/ProjectTabs";
import { Footer } from "./components/Footer";
import { SECRET_PROJECT } from "./data/mock-campaigns";

export default function Page() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30 selection:text-blue-200">
      <Navbar />
      <main>
        <CampaignHero campaign={SECRET_PROJECT} />
        <ProjectTabs campaign={SECRET_PROJECT} />
      </main>
      <Footer />
    </div>
  );
}
