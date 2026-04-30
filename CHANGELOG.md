# Change history for ui-inventory-import

## [4.1.1](https://github.com/folio-org/ui-inventory-import/tree/v4.1.1) (IN PROGRESS)

* [UIINIMP-57](https://folio-org.atlassian.net/browse/UIINIMP-57) The number of files queued shows as `<NoValue>` rather than -1 when the channel is not commissioned.
* [UIINIMP-50](https://folio-org.atlassian.net/browse/UIINIMP-50) In the Jobs list, the ID column can no longer be hidden.

## [4.1.0](https://github.com/folio-org/ui-inventory-import/tree/v4.1.0) (2026-04-16)

* [UIINIMP-11](https://folio-org.atlassian.net/browse/UIINIMP-11) Align permissions names with Eureka conventions.
* [UIINIMP-25](https://folio-org.atlassian.net/browse/UIINIMP-25) Add translations for permission names.
* [UIINIMP-26](https://folio-org.atlassian.net/browse/UIINIMP-26) Factor out common code in src/search/*SearchPane.js components.
* [UIINIMP-21](https://folio-org.atlassian.net/browse/UIINIMP-21) Address SonarQube's complaints about code "quality".
* [UIINIMP-22](https://folio-org.atlassian.net/browse/UIINIMP-22) Write unit tests reaching the 80% coverage threshold.
* [UIINIMP-28](https://folio-org.atlassian.net/browse/UIINIMP-28) Add ability to upload data files directly in the UI.
* [UIINIMP-19](https://folio-org.atlassian.net/browse/UIINIMP-19) Enhance Channels settings display with new fields.
* [UIINIMP-31](https://folio-org.atlassian.net/browse/UIINIMP-31) Failed records detail view: Rename heading "Import job" to "Job ID".
* [UIINIMP-18](https://folio-org.atlassian.net/browse/UIINIMP-18) Tech Council module acceptance process.
* [UIINIMP-27](https://folio-org.atlassian.net/browse/UIINIMP-27) Get missing settings pages to appear in Eureka Snapshot.
* [UIINIMP-30](https://folio-org.atlassian.net/browse/UIINIMP-30) Add Job ID column to the Jobs list.
* [UIINIMP-33](https://folio-org.atlassian.net/browse/UIINIMP-33) Modify UI for enabled/commissioned/listening booleans.
* [UIINIMP-32](https://folio-org.atlassian.net/browse/UIINIMP-32) Make channels search/filter pane collapsible (default open in main app, closed in settings).
* [UIINIMP-35](https://folio-org.atlassian.net/browse/UIINIMP-35) Jobs > Duration is reported as "< 1s" for very short runs.
* [UIINIMP-36](https://folio-org.atlassian.net/browse/UIINIMP-36) Channels are sorted by channel name, ascending, by default.

## [4.0.0](https://github.com/folio-org/ui-inventory-import/tree/v4.0.0) (2026-03-03)

* First version of `ui-inventory-import`, initially derived from [`ui-harvester-admin` v3.0.0](https://github.com/indexdata/ui-harvester-admin/tree/v3.0.0).
* [UIINIMP-1](https://folio-org.atlassian.net/browse/UIINIMP-1) Build the basic structure of the ui-inventory-import app
* [UIINIMP-2](https://folio-org.atlassian.net/browse/UIINIMP-2) Design Icon for the new ui-inventory-import app.
* [UIINIMP-3](https://folio-org.atlassian.net/browse/UIINIMP-3) Align APIs for Settings > Inventory import > Transformation pipelines page.
* [UIINIMP-4](https://folio-org.atlassian.net/browse/UIINIMP-4) Align APIs for Settings > Inventory import > Transformation steps page.
* [UIINIMP-5](https://folio-org.atlassian.net/browse/UIINIMP-5) Align APIs for Settings > Inventory import admin > Logs page.
* [UIINIMP-6](https://folio-org.atlassian.net/browse/UIINIMP-6) Align APIs used for Inventory import admin, segment Channels.
* [UIINIMP-7](https://folio-org.atlassian.net/browse/UIINIMP-7) Align APIs used for Inventory import admin, segment Jobs.
* [UIINIMP-8](https://folio-org.atlassian.net/browse/UIINIMP-8) Align APIs for Inventory import admin, segment Failed records
* [UIINIMP-9](https://folio-org.atlassian.net/browse/UIINIMP-9) Remove Settings > Inventory import admin > Storages page
* [UIINIMP-10](https://folio-org.atlassian.net/browse/UIINIMP-10) Move Channels configuration to Settings > Inventory Import
* [UIINIMP-12](https://folio-org.atlassian.net/browse/UIINIMP-12) Move from GitHub's `indexdata` space to `folio-org`
* [UIINIMP-13](https://folio-org.atlassian.net/browse/UIINIMP-13) Fix up all permissions
* [UIINIMP-20](https://folio-org.atlassian.net/browse/UIINIMP-20) Failed Records list sometimes fails to load into the UI
* [UIINIMP-14](https://folio-org.atlassian.net/browse/UIINIMP-14) Fix up all translations
* [UIINIMP-15](https://folio-org.atlassian.net/browse/UIINIMP-15) Clean up old code
* [UIINIMP-16](https://folio-org.atlassian.net/browse/UIINIMP-16) Include global permissions in package.json base permissions
* [UIINIMP-23](https://folio-org.atlassian.net/browse/UIINIMP-23) Make initial release (v4.0.0)
* [#12](https://github.com/folio-org/ui-inventory-import/issues/12) Add links from failed-record list to full failed records
* [#13](https://github.com/folio-org/ui-inventory-import/issues/13) Use new WSAPI to fetch a single failed record
* [#16](https://github.com/folio-org/ui-inventory-import/issues/16) Date filter in failed records not working as expected
* [#17](https://github.com/folio-org/ui-inventory-import/issues/17) CSV export of failed record is failing
* [#20](https://github.com/folio-org/ui-inventory-import/issues/20) Clean up help texts in translation file
* [#21](https://github.com/folio-org/ui-inventory-import/issues/21) Remove uses of defaultProps
* [#24](https://github.com/folio-org/ui-inventory-import/issues/24) Implement "Last log" and "Jobs" links in Channels list, and "Pause" and "Restart" actions
* [#25](https://github.com/folio-org/ui-inventory-import/issues/25) Implement "Jobs" link from list of Channels
* [#26](https://github.com/folio-org/ui-inventory-import/issues/26) In the full Job display, add a context button to pause/resume jobs
* [#29](https://github.com/folio-org/ui-inventory-import/issues/29) Report job durations in a more human-readable form
* [#39](https://github.com/folio-org/ui-inventory-import/issues/39) Accessing the second - n channel detail view is broken

(See [the `ui-harvester-admin` change-log](https://github.com/indexdata/ui-harvester-admin/blob/v3.0.0/CHANGELOG.md) for changes prior to v3.0.0.)


