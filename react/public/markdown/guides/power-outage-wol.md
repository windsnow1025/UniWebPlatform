# Power Outage & Wake on LAN

## Power on After Power Outage

1. Asus: Advanced >> APM Configuration >> Restore AC Power Loss: Power On
2. Power Options
    1. Choose what the power buttons do >> Untick `Turn on fast startup`
    2. Edit Plan Settings >> Change advanced power settings >> PCI Express: Link State Power Management: Setting Off

## Wake on LAN

1. Asus: Advanced
    1. APM Configuration >> Power On By PCI-E: Enabled
    2. Onboard Devices Configuration >> USB power deliver in Soft Off state: Disabled
2. Network Connections >> Ethernet >> Properties
    1. Networking >> Configure >>
        1. Advanced >>
            1. Wake on Magic Packet >> Enabled
            2. Wake on Pattern Match >> Enabled
        1. Power Management >> Allow All
3. Power Options >> Choose what the power buttons do >> Untick `Turn on fast startup`
4. Router >> Port Forwarding >> Port: 9; Protocol: UDP
