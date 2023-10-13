# IPTables

## Add forwarding rules

```bash
iptables -t nat -A PREROUTING -p tcp --dport <本机端口号> -j DNAT --to-destination <目标IP:目标端口号>
iptables -t nat -A PREROUTING -p udp --dport <本机端口号> -j DNAT --to-destination <目标IP:目标端口号>
iptables -t nat -A POSTROUTING -p tcp -d <目标IP> --dport <目标端口号> -j SNAT --to-source <本地服务器IP>
iptables -t nat -A POSTROUTING -p udp -d <目标IP> --dport <目标端口号> -j SNAT --to-source <本地服务器IP>
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