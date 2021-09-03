# Looker 'Sync Dashboard' Extension
This is an [extension](https://docs.looker.com/data-modeling/extension-framework/extension-framework-intro) for Looker. 

This allows you to create links between UDDs and LookML dashboards and then 'sync' them, pushing any changes from the LookML into the dashboards.

This is a good solution to the problem of maintaining centrally-controlled dashboards which also live in folders and have the same features as normal UDDs (numerical IDs, folder-based permissions, etc.)

This functionality is currently only possible through the API, hence this extension.

---

*Note: This is not officially supported by Looker or Google in any way. Use at your own risk*

---
### Demo
![](demo/sync.gif)


---

### Installation
* Copy the `manifest.lkml` and `dist/bundle.js` files into your looker environment.

### Development
* Clone this repo --> make changes --> raise a pull request!
* Development requires `yarn`, and installation of `React` and the other normal libraries to develop Looker components
* `yarn dev` runs a local development server where you can preview changes
  * Point the manifest file at `https://localhost:8080/bundle.js` to see this
* `yarn build` webpacks a single js file which you can drag and drop into looker

---

### Known issues
* Disable on mobile - show a message saying only sync functionality available on mobile
* Logging is double-showing messages
* Find better way to avoid race condition on info box state without resorting to setTimeout
* Need to scan dashboards living in root shared folder
* Send biz case + recording to Toshi with link to repo

### Upcoming Features
* Add a clear log button
* Allow syncing multiple LookML dashboards at once
* Link to successfully synced dashboards
* Colour code log messages
* Add declarative routing