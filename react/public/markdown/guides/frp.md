# Frp

## On Remote Linux Server

Inbound port rules: Allow `2121,2222,6778,5443,6443` Port

Installation:

```bash
wget https://raw.githubusercontent.com/MvsCode/frps-onekey/master/install-frps.sh -O ./install-frps.sh
chmod 700 ./install-frps.sh
./install-frps.sh install
```

Config:

`bind_port`: `5443`

`dashboard_port`: `6443`

`dashboard_user`: `admin`

`dashboard_pwd`: `[Password]`

`token`: `[Token]`

`subdomain_host`: `[SubDomain_Host.com]`

Server management: `frps {start|stop|restart|status|config|version}`

## On Local Windows Client

Visit `[SubDomain_Host.com]:6443`

User: `admin`, Password: `[Password]`

Download `frp_[Version]_windows_amd64` from [https://github.com/fatedier/frp/releases/](https://github.com/fatedier/frp/releases/)

Edit `frpc.ini`:

```ini
[common]
server_addr = [SubDomain_Host.com]
server_port = 5443
token = [Token]

[ftp]
type = tcp
local_ip = 127.0.0.1
local_port = 21
remote_port = 2121

[ssh]
type = tcp
local_ip = 127.0.0.1
local_port = 22
remote_port = 2222

[rdp]
type = tcp
local_ip = 127.0.0.1
local_port = 3389
remote_port = 6778

[http]
type = http
local_ip = 127.0.0.1
local_port = 80
subdomain = [SubDomain] (Example: www)

[https]
type = https
local_ip = 127.0.0.1
local_port = 443
subdomain = [SubDomain] (Example: www)
```

```bash
cd [frp Folder]
frpc.exe -c frpc.ini
```

Web: Visit `[SubDomain].[SubDomain_Host.com]`
