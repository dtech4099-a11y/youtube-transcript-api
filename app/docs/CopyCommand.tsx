"use client";

import { useState } from "react";

type CopyCommandProps = {
  command: string;
  label: string;
};

export function CopyCommand({ command, label }: CopyCommandProps) {
  const [copied, setCopied] = useState(false);

  async function copyCommand() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="command-block">
      <div className="command-header">
        <span>{label}</span>
      </div>
      <div className="command-row">
        <code className="command">{command}</code>
        <button
          type="button"
          onClick={copyCommand}
          aria-label={`Copy ${label} command`}
          title={copied ? "Copied" : "Copy"}
        >
          {copied ? (
            <span className="copy-feedback">Copied</span>
          ) : (
            <svg
              aria-hidden="true"
              className="copy-icon"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="8"
                y="7"
                width="11"
                height="11"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M5 15V5a2 2 0 0 1 2-2h10"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
