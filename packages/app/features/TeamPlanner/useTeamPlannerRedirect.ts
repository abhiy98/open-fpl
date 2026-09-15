import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSettings } from "@open-fpl/app/features/Settings/Settings";

const useTeamPlannerRedirect = () => {
  const { profile, isInitialised } = useSettings();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialised) return;

    if (profile) {
      // Team Planner is served through a Cloudflare Pages rewrite, so use a
      // full navigation instead of Next.js client routing for this dynamic URL.
      if (window.location.pathname !== `/teams/${profile}`) {
        window.location.assign(`/teams/${profile}`);
      }
    } else if (window.location.pathname !== "/teams") {
      router.push("/teams");
    }
  }, [profile, isInitialised, router]);

  return { profile, isInitialised };
};

export default useTeamPlannerRedirect;
