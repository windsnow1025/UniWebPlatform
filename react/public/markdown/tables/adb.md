# ADB

| Instructions | Code |
| --- | --- |
| Check Device Connection | `fastboot devices` |
| Connect to Device | `adb start server` |
| Disconnect to Device | `adb kill server` |
| Unlock Bootloader | `fastboot oem unlock` |
| Fastboot Flash | `fastboot flash boot(_a/b) <path>` |
| Restart Bootloader | `adb reboot bootloader` |
| View Partition | `fastboot getvar current-slot` |
| Active Partition | `fastboot --set-active=a/b` |
| Sideload | `adb sideload <path>` |
| Push | `adb push <PathFrom> <PathTo>` |
