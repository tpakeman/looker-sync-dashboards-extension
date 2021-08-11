application: lookml_syncer {
  label: "LookML dashboard Syncer"
  file: "sync_lookml.js"
  entitlements: {
    local_storage: no
    navigation: no
    new_window: no
    use_form_submit: no
    use_embeds: no
    core_api_methods: ["all_dashboards", "update_dashboard", "sync_lookml_dashboard"]
  }
}
