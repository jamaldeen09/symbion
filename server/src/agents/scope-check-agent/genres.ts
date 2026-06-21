export interface GenreDefinition {
    id: string;
    label: string;
    description: string;
    scopeGuidance: string;
    scaffoldReady: boolean;
}

export const SYMBION_GENRES: GenreDefinition[] = [
    // ---- Games ----
    {
        id: "board-game",
        label: "Board Game",
        description: "Turn-based games on a grid or board — chess, checkers, go, or fully custom rule sets.",
        scopeGuidance:
            "New mechanics, win conditions, special pieces/powers, AI opponents, and local hot-seat play — not just visual reskins.",
        scaffoldReady: true,
    },
    {
        id: "party-trivia",
        label: "Party Trivia",
        description: "Quiz games with multiple-choice questions, scoring, and rounds.",
        scopeGuidance:
            "New question categories, round formats, scoring twists (streak bonuses, timed challenges), and solo or pass‑the‑device play.",
        scaffoldReady: true,
    },
    {
        id: "card-game",
        label: "Card Game",
        description: "Turn-based card games — trick-taking, matching, or custom decks.",
        scopeGuidance:
            "New deck designs, rule variants, scoring systems, and single‑player vs AI or local hot‑seat play.",
        scaffoldReady: true,
    },
    {
        id: "arcade-reflex",
        label: "Arcade / Reflex",
        description: "Fast-paced reaction games — simple platformers, dodge games, timing challenges.",
        scopeGuidance:
            "New levels, obstacles, power-ups, increasing difficulty curves, and high‑score chasing for solo mastery.",
        scaffoldReady: true,
    },
    {
        id: "puzzle",
        label: "Puzzle",
        description: "Solo puzzle games — sliding puzzles, word puzzles, logic grids.",
        scopeGuidance:
            "New puzzle types, difficulty curves, hint systems, move counters, and timers for single‑player brain teasers.",
        scaffoldReady: true,
    },



    {
        id: "poll-decision",
        label: "Poll & Decision Tool",
        description: "Create and visualize polls with multiple voting formats — single-choice, ranked, or bracket.",
        scopeGuidance:
            "New voting formats (ranked-choice, bracket, scoring), interactive result visualizations (charts, bars), and decision-narrowing flows for solo or hot‑seat use.",
        scaffoldReady: false,
    },
    {
        id: "notes-board",
        label: "Notes Board",
        description: "A personal sticky‑notes or markdown board for organizing thoughts, lists, or ideas.",
        scopeGuidance:
            "New organization schemes (columns, tags, colors), rich text editing, markdown support, and localStorage persistence for saving notes between sessions.",
        scaffoldReady: false,
    },
];