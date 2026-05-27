#!/usr/bin/env node

// Without ECMA
// const { exec } = require('child_process');

// With ECMA
import { exec } from "child_process";
import open, { apps } from "open";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import fs from "fs";

// Import SDK functions for writing and drawing from db
import * as SDK from "./lib/sdk.js";

SDK.setBaseUrl("http://localhost:3000");

dotenv.config();

// Returns command line argument given in the terminal in an array
// console.log(process.argv);

// Removes "npm run start" and keeps an array of other command the user inputs
// useful for navigating/shortcuts
const args = process.argv.slice(2);
// console.log(args);

const command = args[0];
const favorite = args[1];
const url = args[2];

interface Favorite {
  id?: number;
  name: string;
  url: string;
}

// pull ALL favorites and manipulate depending on CLI command
const favorites: Favorite[] = await SDK.getFavorites();

function checkBrowser() {
  // Remember question mark means if any of these throw undefined, do not crash system, instead throw error
  const browser = process.env?.BROWSER?.toLocaleLowerCase();
  let appName: string | readonly string[] | undefined = browser;
  // console.log(appName);

  switch (browser) {
    case "chrome":
      appName = apps.chrome;
      break;
    case "firefox":
      appName = apps.firefox;
      break;
    case "edge":
      appName = apps.edge;
      break;
  }
  return appName;
}

function displayMenu() {
  console.log("ls                     : List all favorites");
  console.log("open <favorite>        : Open a saved favorite");
  console.log("add <favorite> <url>   : add a new favorite for some URL");
  console.log("rm <favorite>          : remove a saved favorite.");
}

async function openFavorite(name: string) {
  const favToOpen = favorites.find((fav) => fav.name === name);
  if (!favToOpen) {
    console.log(`Favorite ${name} does not exist`);
    process.exit(1);
  }

  const url = favToOpen.url;

  console.log("Opening", favorite);

  // let command;

  // Without using import open

  // switch (process.platform) {
  //   case 'darwin':
  //     command = `open -a "Google Chrome" ${url}`;
  //     break;

  //   case 'win32':
  //     command = `start chrome ${url}`;
  //     break;

  //   case 'linux':
  //     command = `google-chrome ${url}`;
  //     break;

  //   default:
  //     console.log('Unsupported platform.');

  // }

  console.log("opening", url);
  const appName = checkBrowser();

  // If user doesn't provide a browser, open with default browser
  if (appName) {
    // Without await keyword, will not open browser
    // wait: true prevents the code from continuting if not done
    await open(url, { wait: true, app: { name: appName } });
  } else {
    await open(url, { wait: true });
  }
}

const add = async (name: string, url: string) => {
  const id = await SDK.addFavorite(name, url);
  if (!id) {
    console.log(`Filed to add favorite ${name}.`);
    process.exit(1);
  }
  console.log("adding", name, url);
};

const rm = async (name: string) => {
  const favToDelete = favorites.find((fav) => fav.name === name);
  if (!favToDelete) {
    console.log(`Favorite ${name} does not exist`);
    process.exit(1);
  }

  await SDK.deleteFavorite(favToDelete.id);
  console.log("removing", name);
};

const ls = async () => {
  console.log("ALL favorites:");
  favorites.forEach((favorite) => {
    console.log(`${favorite.name}: ${favorite.url}`);
  });
};
// Environmental variables - grab environment variable I write in terminal after process.env.envVarName
// In this case, i wrote "BROWSER=chrome npm run start open social"
// This was moved to checkBrowser section

// const browser = process.env.BROWSER;
// console.log('Opening with', browser);

// Prints help menu
const argCount = args.length;

//One way to do it, lots of switch statements but good readability

/*if (argsCount === 0 || ['ls', 'open', 'rm', 'add'].includes(command)) {
  displayMenu();
} else {
  switch (command) {
    case 'open':
      openFavorite(favorite);
      break;
    case 'add':
      if (!url) {
        displayMenu();
        break;
      }
      add(favorite, url);
      break;
    case 'rm':
      rm(favorite);
  }
}

switch (command) {
  case 'ls':
    ls();
    break;
  case 'open':
    if (argCount < 2) {
      displayMenu();
      process.exit(1);
    }
    openFavorite(favorite);
    break;
  case 'add':
    if (argCount < 3) {
      displayMenu();
      process.exit(1);
    }
    add(favorite, url);
    break;
  case 'rm':
    if (argCount < 2) {
      displayMenu();
      process.exit(1);
    }
    rm(favorite);
    break;
}
*/

interface Command {
  f: Function;
  argCount: number;
}

interface Commands {
  [key: string]: Command;
}

// Less code, same outcome
const commands = {
  ls: { f: ls, argCount: 1 },
  open: { f: openFavorite, argCount: 2 },
  rm: { f: rm, argCount: 2 },
  add: { f: add, argCount: 3 },
} as Commands;

if (
  argCount === 0 ||
  !commands[command] ||
  argCount < commands[command].argCount
) {
  displayMenu();
  process.exit(1);
}

// Needs await because of the await involved in the commands
await commands[command].f(favorite, url);
