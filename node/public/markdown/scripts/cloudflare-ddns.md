# Cloudflare DDNS

## Introduction

In Windows, periodically check the external IPv4 and IPv6 address of the local machine from [whatismyip.akamai.com](whatismyip.akamai.com) and [6.ipw.cn](6.ipw.cn). Update the corresponding Cloudflare DNS record on change.

## Instructions

Visit [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) and login.

Save your account email as `<Email Address>`.

Click "View" after `Global API Key`, save this key as `<Globle API Key>`.

Input in CMD:

```powershell
curl -X GET "https://api.cloudflare.com/client/v4/zones" ^
     -H "X-Auth-Email: <Email Address>" ^
     -H "X-Auth-Key: <Global API Key>" ^
     -H "Content-Type: application/json"
```

Format Json output in VS Code (`Alt + Shift + F`), find the `id` corresponding to the `name`(yyy.zzz), save this id as `<Domain Name ID>`.

Input in CMD:

```powershell
curl -X GET "https://api.cloudflare.com/client/v4/zones/<Domain Name ID>/dns_records?page=1&per_page=20&order=type&direction=asc" ^
     -H "X-Auth-Email: <Email Address>" ^
     -H "X-Auth-Key: <Global API Key>" ^
     -H "Content-Type: application/json"
```

Format Json output in VS Code (`Alt + Shift + F`), find the `id` corresponding to the `name`(xxx.yyy.zzz), save this id as `<DNS Record ID>`.

Create a Batch file, input:

For IPv4:

```powershell
@echo off

set ip1=ip
set ip2=ip
set tmp=ip

:loop
    for /F %%i in ('curl -s whatismyip.akamai.com') do (set tmp=%%i)
    set ip2=%tmp%
    if "%ip1%"=="%ip2%" (PING -n 30 127.0.0.1>nul) else (echo %ip2%&set ip1=%ip2%&goto cloudflare)
goto loop

:cloudflare
curl -X PUT "https://api.cloudflare.com/client/v4/zones/<Domain Name ID>/dns_records/<DNS Record ID>" ^
     -H "X-Auth-Email: <Email Address>" ^
     -H "X-Auth-Key: <Global API Key>" ^
     -H "Content-Type: application/json" ^
     --data "{\"type\":\"A\",\"name\":\"<xxx.yyy.zzz>\",\"content\":\"%ip2%\",\"ttl\":1,\"proxied\":false}"
echo.
echo %date% %time%
echo.
goto loop


Pause
```

For IPv6:

```powershell
@echo off

set ip1=ip
set ip2=ip
set tmp=ip

:loop
    for /F %%i in ('curl -s 6.ipw.cn') do (set tmp=%%i)
    set ip2=%tmp%
    if "%ip1%"=="%ip2%" (PING -n 30 127.0.0.1>nul) else (echo %ip2%&set ip1=%ip2%&goto cloudflare)
goto loop

:cloudflare
curl -X PUT "https://api.cloudflare.com/client/v4/zones/<Domain Name ID>/dns_records/<DNS Record ID>" ^
     -H "X-Auth-Email: <Email Address>" ^
     -H "X-Auth-Key: <Global API Key>" ^
     -H "Content-Type: application/json" ^
     --data "{\"type\":\"AAAA\",\"name\":\"<xxx.yyy.zzz>\",\"content\":\"%ip2%\",\"ttl\":1,\"proxied\":false}"
echo.
echo %date% %time%
echo.
goto loop


Pause
```
