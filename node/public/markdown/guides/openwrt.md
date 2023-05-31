# OpenWRT

## Create Virtual Machines on Hyper-V

1. `Virtual Switch Manager` >> New `virtual network switch` >> `External` >> Create `virtual switch` >> `External Switch` >> Select Ethernet network
2. New >> `Virtual Machine`
    1. `Specify Generation` >> `Generation 2`
    2. `Configure Networking` >> `External Switch`
    3. `Connect Virtual Hard Disk` >> `Use an existing virtual hard disk` >> Select vhdx
3. Select Virtual Machine >> `Settings`
    1. `Security` >> Untick `Enable Secure Boot`
    2. `Processor` >> Change number of processors

Power On

## OpenWRT Installation

1. Download `https://downloads.openwrt.org/releases/<Version>/targets/x86/64/openwrt-<Version>-x86-64-generic-ext4-combined-efi.img`
2. Extract `openwrt-<Version>-x86-64-generic-ext4-combined-efi.img`
3. Open `StarWind V2V Converter` and Convert `openwrt-<Version>-x86-64-generic-ext4-combined-efi.img` to vhdx
4. Create Virtual Machines
5. In OpenWRT

```bash
> vi /etc/config/network
```

Type `i` to Edit

```
config interface 'lan'
    option device 'br-lan'
    option proto 'static'
    option ipaddr '<IP Address>'
    option netmask '255.255.255.0'
    option ip6assign '60'
```

Type `Esc` then `:wq` to save and quit

```bash
> /etc/init.d/network reload
```

6. Visit `<IP Address>` to goto OpenWRT Dashboard
    1. System >> Administration >> Change Password
    2. Network
        1. Interface >> LAN: Edit >> Change IPv4 Gateway, Custom DNS Server
        2. DHCP and DNS >> Hostnames >> Add Hostnames

Install `Tabby Terminal` from [https://github.com/Eugeny/tabby/releases/](https://github.com/Eugeny/tabby/releases/) and connect to `<IP Address>`

## OpenClash Installation

1. In OpenWRT

```bash
opkg update
opkg install coreutils
opkg install jsonfilter
opkg install ip6tables-mod-nat
opkg remove dnsmasq && opkg install dnsmasq-full # avoid dnsmasq conflicts
opkg upgrade libcurl # avoid curl conflicts
#iptables
opkg install coreutils-nohup bash iptables dnsmasq-full curl ca-certificates ipset ip-full iptables-mod-tproxy iptables-mod-extra libcap libcap-bin ruby ruby-yaml kmod-tun kmod-inet-diag unzip luci-compat luci luci-base
#nftables
opkg install coreutils-nohup bash dnsmasq-full curl ca-certificates ipset ip-full libcap libcap-bin ruby ruby-yaml kmod-tun kmod-inet-diag unzip kmod-nft-tproxy luci-compat luci luci-base
```

2. Download `<OpenClash>.ipk` from [https://github.com/vernesong/OpenClash/releases](https://github.com/vernesong/OpenClash/releases)
3. In OpenWRT

```bash
> opkg install openssh-sftp-server
```

4. SFTP > Upload OpenClash File to /tmp/tmp

```bash
> cd /tmp/tmp
> opkg install <OpenClash>.ipk
```

5. Relogin Dashboard to access Services: OpenClash
6. OpenClash >> Global Settings >> Version Update
7. Config Update >> Add >> Update Config
8. Overviews >> Running Mode >> TUN
9. Global Settings
    1. Operation Mode
        1. Switch page to Fake-IP mode
        2. Select Mode >> fake-ip(tun mode) >> Commit Settings
    2. General Settings
        1. Log Level: Info Mode

### Install Clash Core manually

1. GUI: OpenClash >> Global Settings >> Version Update >> Download Core
2. Download `<clash>.tar.gz` of `dev`, `meta`, `premium` from [https://github.com/vernesong/OpenClash/tree/core/master](https://github.com/vernesong/OpenClash/tree/core/master)
3. Extract and rename `clash` files to `clash`(`dev`), `clash_tun`(`premium`), `clash_meta`(`meta`)
4. Copy to `/etc/openclash/core`

### Possible solutions of network problems

1. Disable Private DNS;
2. Use Device MAC Address;
3. Avoid DNS Server conflicts;
4. Avoid IP Address conflicts;
5. Synchronize System Time;

## Shadowsocks Installation

1. In OpenWRT

```bash
opkg install shadowsocks-libev-ss-local shadowsocks-libev-ss-redir shadowsocks-libev-ss-rules shadowsocks-libev-ss-tunnel
opkg install shadowsocks-libev-ss-server
opkg install luci-app-shadowsocks-libev
```

2. Relogin Dashboard to access service: `Shadowsocks-libev`
3. `Shadowsocks-libev` >> `Local Instances` >> `ss_server`
4. `Network` >> `Firewall` >> `Port Forwards` >> `Forward SS Ports`
