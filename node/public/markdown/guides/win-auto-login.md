# Windows Auto Login

1. Accounts >> Sign-in options
    1. Turn off `For improved security, only allow Windows Hello sign-in for Microsoft accounts on this device`

2. Registry >> `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\PasswordLess\Device`
    1. Change the value of `DevicePasswordLessBuildVersion` from `2` to `0`

3. Windows + R >> `netplwiz`
    1. Uncheck `Users must enter a user name and password to use this computer` >> Apply
    2. Enter user name and password
