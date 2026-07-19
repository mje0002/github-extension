import React from "react";
import { createRoot } from "react-dom/client";

// Options page — not yet implemented.
// Placeholder required by manifest.json options_ui entry.
const Options = () => <></>;

const root = createRoot(document.getElementById("root")!);
root.render(<React.StrictMode><Options /></React.StrictMode>);
