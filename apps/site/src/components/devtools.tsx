"use client";

import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";

export default function Devtools() {
  return (
    <TanStackDevtools
      config={{
        defaultOpen: false,
        hideUntilHover: false,
        openHotkey: ["Control", "Q"],
        position: "bottom-left",
      }}
      plugins={[
        {
          name: "Tanstack Query",
          render: <ReactQueryDevtoolsPanel />,
        },
      ]}
    />
  );
}
