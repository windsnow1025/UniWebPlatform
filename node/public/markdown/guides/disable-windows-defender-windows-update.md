# Permanently Disable Windows Defender and Windows Update on Windows 11

## Disable Windows Defender

1. `Windows Security` >> `Virus & threat protection` >> `Virus & threat protection settings`: `Manage settings` >> Turn Off All
2. Download [RunAsTI](https://github.com/jschicht/RunAsTI)
3. `RunAsTI64.exe` >> `regedit` >> `Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Defender`
    1. `Windows Defender`: `Permissions` >>
        1. `Advanced` >> `Owner: Change` >> Enter `[Username]` >> `Check Names` >> OK >> Tick `Replace owner on subcontainers and objects` >> OK
	    2. Group or user names: Remove `Full Control` for `SYSTEM` & `Administrator` & `WinDefend` & `Trusted Installer`
	    3. Add… >> Enter `[Username]` >> Check Names >> OK
	    4. Grant `[Username]` Account with Full Control >> OK (Restart Windows)
    2. Set `DisableAntiSpyware` (DWORD (32-bit)) Value to `1`
    3. Set `DisableAntiVirus` (DWORD (32-bit)) Value to `1`

## Permanently Disable Windows Update on Windows 11

`Group Policy Editor` >> `Administrative Templates / Windows Components / Windows Update` >> `Manage and user experience` >> `Configure Automatic Updates` >> `Disabled`
