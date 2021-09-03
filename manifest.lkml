application: lookml_syncer {
  label: "LookML dashboard Syncer"
  file: "bundle.js"
  entitlements: {
    local_storage: no
    navigation: yes
    new_window: yes
    use_form_submit: no
    use_embeds: no
    core_api_methods: ["all_dashboards", "update_dashboard", "sync_lookml_dashboard", "search_dashboards", "all_folders"]
  }
}
