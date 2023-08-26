import { SidebarComponentType, SidebarConfigType } from "@src/types";
import chattingSideBar from "./chattingSideBar";
import ProfileSideBar from "./profileSideBar";

export const sidebarConfig: SidebarConfigType = {
  // '/channel-list': <ChannelSidebar />,
  // '/game-list': <GameSidebar />,
  // '/ranking': <RankingSidebar />,
  // ...
  "/": { component: chattingSideBar },
  "/profile/": {
    component: ProfileSideBar,
    matcher: /^\/profile\/(42-|G-)\d+$/, // '42-' 혹은 'G-'로 시작하고 그 뒤에 숫자로만 이루어진 문자열이 나오는 경우만 매치합니다.
  },
};

export const profileRouteMatch = (
  currentRoute: string,
): SidebarComponentType | null => {
  for (const key in sidebarConfig) {
    const config = sidebarConfig[key];

    // 만약 matcher가 있고 currentRoute와 일치한다면
    if (config.matcher?.test(currentRoute)) {
      return config.component;
    }

    // 만약 key와 currentRoute가 정확히 일치한다면
    if (key === currentRoute && key !== "/profile/") {
      return config.component;
    }
  }

  return null; // 일치하는 라우트가 없을 때
};
