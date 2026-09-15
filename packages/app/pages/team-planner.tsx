import { Spinner } from "@chakra-ui/react";
import { useIsLocalStorageSupported } from "@open-fpl/app/features/Common/useLocalStorage";
import getDataUrl from "@open-fpl/app/features/Data/getDataUrl";
import FullScreenMessageWithAppDrawer from "@open-fpl/app/features/Layout/FullScreenMessageWithAppDrawer";
import AppLayout from "@open-fpl/app/features/Layout/AppLayout";
import { origin } from "@open-fpl/app/features/Navigation/internalUrls";
import getOgImage from "@open-fpl/app/features/OpenGraphImages/getOgImage";
import TeamPlanner from "@open-fpl/app/features/TeamPlanner/TeamPlanner";
import UnhandledError from "@open-fpl/common/features/Error/UnhandledError";
import { TeamFixtures } from "@open-fpl/data/features/AppData/fixtureDataTypes";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import { Team } from "@open-fpl/data/features/AppData/teamDataTypes";
import {
  EntryEvent,
  EntryHistory,
  Transfer,
  Event,
} from "@open-fpl/data/features/RemoteData/fplTypes";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";

const json = async <T,>(url: string): Promise<T> => {
  const response = await fetch(url);
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      typeof body?.error === "string"
        ? body.error
        : `Request failed (${response.status})`
    );
  }

  return body as T;
};

type PlannerData = {
  picks: EntryEvent["picks"];
  entryHistory: EntryEvent["entry_history"];
  transfers: Transfer[];
  chips: EntryHistory["chips"];
  teams: Team[];
  teamFixtures: TeamFixtures[];
  players: Player[];
  nextGameweekId: number;
};

const getEntryId = () => {
  if (typeof window === "undefined") return null;
  const match = window.location.pathname.match(/^\/teams\/(\d+)\/?$/);
  return match?.[1] ?? null;
};

const TeamPlannerPage = () => {
  const [data, setData] = useState<PlannerData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isLocalStorageSupported = useIsLocalStorageSupported();

  useEffect(() => {
    let cancelled = false;
    const entryId = getEntryId();

    if (!entryId) {
      setError(
        "Invalid FPL ID: Please check the help page for the instruction to find a valid FPL ID."
      );
      return;
    }

    const load = async () => {
      try {
        const [players, teamFixtures, teams, gameweeks] = await Promise.all([
          json<Player[]>(getDataUrl("/app-data/players.json")),
          json<TeamFixtures[]>(getDataUrl("/app-data/fixtures.json")),
          json<Team[]>(getDataUrl("/app-data/teams.json")),
          json<Event[]>(getDataUrl("/remote-data/fpl_gameweeks/data.json")),
        ]);

        const nextGameweekId = gameweeks.find((g) => g.is_next)?.id ?? 38;
        const picksGameweekId =
          nextGameweekId === 38 || nextGameweekId === 1
            ? nextGameweekId
            : nextGameweekId - 1;

        const [picksResponse, transfers, history] = await Promise.all([
          json<EntryEvent>(
            `/api/entries/${entryId}/picks/${picksGameweekId}`
          ),
          json<Transfer[]>(`/api/entries/${entryId}/transfers`),
          json<EntryHistory>(`/api/entries/${entryId}/history`),
        ]);

        if (cancelled) return;

        setData({
          picks: picksResponse.picks ?? [],
          entryHistory: picksResponse.entry_history,
          transfers,
          chips: history.chips ?? [],
          teams,
          teamFixtures,
          players,
          nextGameweekId,
        });
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Unable to load Team Planner data."
          );
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  let mainContent = null;

  if (!isLocalStorageSupported) {
    mainContent = (
      <UnhandledError
        Wrapper={FullScreenMessageWithAppDrawer}
        as="main"
        additionalInfo="Local storage is required for Team Planner."
      />
    );
  } else if (error) {
    mainContent = (
      <UnhandledError
        Wrapper={FullScreenMessageWithAppDrawer}
        as="main"
        additionalInfo={error}
      />
    );
  } else if (data) {
    mainContent = (
      <TeamPlanner
        as="main"
        initialPicks={data.picks}
        entryHistory={data.entryHistory}
        players={data.players}
        nextGameweekId={data.nextGameweekId}
        transfers={data.transfers}
        chips={data.chips}
        teams={data.teams}
        teamFixtures={data.teamFixtures}
      />
    );
  } else {
    mainContent = (
      <FullScreenMessageWithAppDrawer
        as="main"
        symbol={<Spinner size="xl" />}
        heading="Almost there..."
        text="Please wait while we are preparing your Team Planner page."
      />
    );
  }

  return (
    <>
      <NextSeo
        title="Team Planner – Open FPL"
        description="Plan your team lineup, transfers, starting lineup and your bench ahead of upcoming Fantasy Premier League gameweeks."
        noindex={true}
        canonical={`${origin}/teams`}
        openGraph={{
          url: `${origin}/teams`,
          title: "Team Planner – Open FPL",
          description:
            "Plan your team lineup, transfers, captain and chip usage ahead of upcoming Fantasy Premier League gameweeks.",
          images: [
            {
              url: getOgImage("Team Planner.png?width=100,height=100"),
              width: 800,
              height: 600,
              alt: "Team Planner – Open FPL",
            },
          ],
          site_name: "Open FPL",
        }}
        twitter={{
          handle: "@openfpl",
          site: "@openfpl",
          cardType: "summary_large_image",
        }}
      />
      <AppLayout>{mainContent}</AppLayout>
    </>
  );
};

export default TeamPlannerPage;
