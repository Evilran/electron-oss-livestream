const electron = require("electron");

const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;

let mainWindow;
let screen;
let template = [
  {
    label: "Edit",
    submenu: [
      {
        label: "Copy",
        accelerator: "CmdOrCtrl+C",
        role: "copy",
      },
      {
        label: "Paste",
        accelerator: "CmdOrCtrl+V",
        role: "paste",
      },
      {
        label: "Reload",
        accelerator: "CmdOrCtrl+R",
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            // on reload, start fresh and close any old
            // open secondary windows
            if (focusedWindow.id === 1) {
              BrowserWindow.getAllWindows().forEach(function (win) {
                if (win.id > 1) {
                  win.close();
                }
              });
            }
            focusedWindow.reload();
          }
        },
      },
    ],
  },
  {
    label: "Window",
    role: "window",
    submenu: [
      {
        label: "Minimize",
        role: "minimize",
      },
      {
        label: "Close",
        role: "close",
      },
      {
        label: "Full Screen",
        role: "togglefullscreen",
      },
      {
        label: "Developer Tool",
        accelerator: (function () {
          if (process.platform === "darwin") {
            return "Alt+Command+I";
          } else {
            return "Ctrl+Shift+I";
          }
        })(),
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        },
      },
      {
        type: "separator",
      },
    ],
  },
  {
    label: "Help",
    role: "help",
    submenu: [
      {
        label: "FeedBack",
        click: function () {},
      },
    ],
  },
];

function addUpdateMenuItems(items, position) {
  if (process.mas) return;

  const version = electron.app.getVersion();
  let updateItems = [
    {
      label: `Version ${version}`,
      enabled: false,
    },
    {
      label: "Checking for Update",
      enabled: false,
      key: "checkingForUpdate",
    },
    {
      label: "Check for Update",
      visible: false,
      key: "checkForUpdate",
      click: function () {
        require("electron").autoUpdater.checkForUpdates();
      },
    },
    {
      label: "Restart and Install Update",
      enabled: true,
      visible: false,
      key: "restartToUpdate",
      click: function () {
        require("electron").autoUpdater.quitAndInstall();
      },
    },
  ];

  items.splice.apply(items, [position, 0].concat(updateItems));
}

function findReopenMenuItem() {
  const menu = Menu.getApplicationMenu();
  if (!menu) return;

  let reopenMenuItem;
  menu.items.forEach(function (item) {
    if (item.submenu) {
      item.submenu.items.forEach(function (item) {
        if (item.key === "reopenMenuItem") {
          reopenMenuItem = item;
        }
      });
    }
  });
  return reopenMenuItem;
}

// Mac
if (process.platform === "darwin") {
  const name = electron.app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: function () {
          app.quit();
        },
      },
    ],
  });

  // Window menu.
  template[3].submenu.push(
    {
      type: "separator",
    },
    {
      label: "Bring All to Front",
      role: "front",
    }
  );

  addUpdateMenuItems(template[0].submenu, 1);
}

// Windows
if (process.platform === "win32") {
  const helpMenu = template[template.length - 1].submenu;
  addUpdateMenuItems(helpMenu, 0);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: screen.getPrimaryDisplay().workAreaSize.width,
    height: screen.getPrimaryDisplay().workAreaSize.height,
    minWidth: 300,
    minHeight: 300,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  // mainWindow.openDevTools();
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", function () {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  screen = electron.screen;
  createWindow();
  globalShortcut.register("ESC", function () {
    if (mainWindow.isFullScreen()) mainWindow.setFullScreen(false);
  });
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("browser-window-created", function () {
  let reopenMenuItem = findReopenMenuItem();
  if (reopenMenuItem) reopenMenuItem.enabled = false;
});

app.on("window-all-closed", function () {
  let reopenMenuItem = findReopenMenuItem();
  if (reopenMenuItem) reopenMenuItem.enabled = true;
  app.quit();
});
