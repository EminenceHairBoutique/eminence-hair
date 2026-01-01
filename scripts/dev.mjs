import { spawn } from "child_process";

// Cross-platform dev runner.
// Starts:
//  - API dev server (port 3000)
//  - Vite dev server (port 5173)
//
// Windows note:
// Node v24+ + PowerShell can throw `spawn EINVAL` when spawning npm directly.
// Running via cmd.exe is the most reliable approach.

const isWin = process.platform === "win32";
const procs = [];

function start(label, command, args) {
  const p = spawn(command, args, {
    stdio: "inherit",
    env: { ...process.env, FORCE_COLOR: "1" },
    windowsHide: false,
  });

  p.on("error", (err) => {
    console.error(`\n[${label}] failed to start:`, err);
    shutdown();
  });

  p.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`\n[${label}] exited with code ${code}`);
    }
    shutdown();
  });

  procs.push(p);
  return p;
}

function runNpmScript(label, scriptName) {
  if (isWin) {
    // cmd.exe /c ensures npm scripts run reliably across shells.
    return start(label, "cmd.exe", ["/d", "/s", "/c", `npm run ${scriptName}`]);
  }
  return start(label, "npm", ["run", scriptName]);
}

let shuttingDown = false;
function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const p of procs) {
    try {
      // SIGINT is ignored on some Windows child trees; killing the parent cmd.exe still stops the chain.
      p.kill("SIGINT");
    } catch {
      try {
        p.kill();
      } catch {
        // ignore
      }
    }
  }

  // Give children a beat to exit cleanly, then hard-exit.
  setTimeout(() => process.exit(0), 400);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Start API first (port 3000), then Vite (5173)
runNpmScript("api", "dev:api");
runNpmScript("vite", "dev:vite");
