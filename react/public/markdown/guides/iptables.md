# IPTables

## Add forwarding rules

```bash
iptables -t nat -A PREROUTING -p tcp --dport <local_port_number> -j DNAT --to-destination <target_IP:target_port_number>
iptables -t nat -A PREROUTING -p udp --dport <local_port_number> -j DNAT --to-destination <target_IP:target_port_number>
iptables -t nat -A POSTROUTING -p tcp -d <target_IP> --dport <target_port_number> -j SNAT --to-source <local_server_IP>
iptables -t nat -A POSTROUTING -p udp -d <target_IP> --dport <target_port_number> -j SNAT --to-source <local_server_IP>
```

## Restart IPTables

```bash
service iptables save
service iptables restart
```

## Check IPTables

```bash
iptables -t nat -nL
```