// Phase 4 EXIT-GATE — dogfood route per ROADMAP §Phase 4 "Exit" + 04-CONTEXT §domain.
// Direct import of the registry block source (Phase 3 D-14 pattern) — proves the
// block composes without manual glue.

import { MiniAppHome } from '../../../../registry/miniapp-home/miniapp-home';

export const dynamic = 'error';

export default function MiniAppHomePage() {
  return <MiniAppHome />;
}
