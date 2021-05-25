
project_name: "looker-dashboard-sync"

application: looker-dashboard-sync {
  label: "looker-dashboard-sync"
  url: "http://localhost:8080/bundle.js"
  # file: "bundle.js
  entitlements: {
  core_api_methods: ["me"] #Add more entitlements here as you develop new functionality
}
}
