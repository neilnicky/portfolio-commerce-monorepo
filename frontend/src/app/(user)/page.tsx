import { getHomeContent } from "@/content/home.content";
import { SiteShell } from "@presentation/layouts/SiteShell";
import { HomeView } from "@presentation/features/home/components/HomeView";

/** Home route — composition only: resolve content → hand the ViewModel to the view. */
export default function HomePage() {
  const vm = getHomeContent();
  return (
    <SiteShell active="home">
      <HomeView vm={vm} />
    </SiteShell>
  );
}
