# CMD

| Instructions | Code |
| --- | --- |
| List Subfiles | dir |
| IP configuration | ipconfig (/all) |
| Refresh Local DNS | ipconfig /flushdns |
| Disable Temporary IPv6 Address | netsh interface ipv6 set privacy state=disable |
| Network Reset | netsh winsock reset |
| View Port Usage | netstat -ano\|findstr :[port] |
| Print Routing Table | route print |
| Delete Service | sc delete [service name] |
| System Scan | sfc /scannow |
