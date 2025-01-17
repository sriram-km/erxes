module.exports = {
    name: "dashboard",
    port: 3007,
    exposes: {
      "./routes": "./src/routes.tsx"
    },
    routes: {
      url: "http://localhost:3007/remoteEntry.js",
      scope: "dashboard",
      module: "./routes",
    },
    menus: [
      {
        text: "Reports",
        url: "/dashboard",
        icon: "icon-dashboard",
        location: "mainNavigation",
        permission: "showDashboards",
      },
    ],
  };
  