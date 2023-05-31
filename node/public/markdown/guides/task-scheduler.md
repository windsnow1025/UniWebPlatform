# Windows Task Scheduler

Task Scheduler >> Create Task

1. General
    1. Run in Foreground: `Run only when user is logged on`
    2. Run in Background: `Run whether user is logged on or not`
    3. Tick `Run with highest privileges` if it needs to run as Administrator
    4. Configure for: Windows 10
2. Triggers >> New
    1. Begin the task: At startup
    2. Advanced settings
        1. Delay task for: 30 seconds
        2. Repeat task every: 5 minutes, for a duration of Indefinitely
        3. Enabled
3. Action >> New >> Start a program
4. Settings >>Enable: `Allow task to be run on demand`, `If the task fail, restart every 1 minute`