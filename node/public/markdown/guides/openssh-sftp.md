# Build SFTP Server Using OpenSSH

`Add Optional Feature` >> `OpenSSH`

`Service` >> `OpenSSH SSH Server`: `Start`, `Automatic`

`C:\ProgramData\ssh\sshd_config` >>

Single User:

```
ChrootDirectory "[Root Directory]"
```

(Login SFTP with Local Administrator Account)

Multiple Users:

```
Match User User1
    ForceCommand internal-sftp
    ChrootDirectory "[Root Directory 1]"

Match User User1
    ForceCommand internal-sftp
    ChrootDirectory "[Root Directory 1]"
```

`Service` >> `OpenSSH SSH Server`: `Restart`
