# Web Server

## Permit Password Login for Root User

1. Edit sshd_config

```bash
sudo passwd root
su root
vim /etc/ssh/sshd_config
```

2. Change `PermitRootLogin` property to `yes`
3. Change `PasswordAuthentication` property to `yes`
4. Restart SSH service:
    - Debian: `/etc/init.d/ssh restart`
    - CentOS: `service sshd restart`

## Windows Nginx + Node.JS + HTTPS + MySQL

### MySQL

1. Install MySQL
2. Connect to Database
3. Privilege Problem

```sql
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'password';
FLUSH PRIVILEGES;
```

### Certbot

1. Install CertBot from [https://dl.eff.org/certbot-beta-installer-win32.exe](https://dl.eff.org/certbot-beta-installer-win32.exe)
2. Make sure Web Server on :80 is not running, Run Terminal as administrator: `cmd > certbot certonly --standalone [--dry-run]`

### Node.JS

1. Install Node JS
2. Run Forever (For Production)

```powershell
cmd > cd <NodeJS Directory>
cmd > npm install --global forever
cmd > forever start src/app.js
```

    - Stop Forever: `forever stopall`
    - Restart Forever: `forever restartall`

3. Run Nodemon (For Development)

```powershell
cmd > cd <NodeJS Directory>
cmd > npm install --global nodemon
cmd > nodemon src/app.js
```

- Stop Nodemon: `ctrl + c`
- Reinstall Node Modules: delete `node_modules`, `package-lock.json`

```powershell
cmd > cd <NodeJS Directory>
cmd > npm install
```

### Nginx

Download Nginx

```powershell
cmd > cd <Nginx Directory>
cmd > start nginx
```

- Reload config: `cmd > nginx -s reload`
- Stop nginx: `cmd > nginx -s stop`

## Linux Nginx + HTTPS

1. Install Nginx: `apt-get install nginx`
    - Uninstall Nginx: `apt-get remove nginx nginx-common`, `apt-get purge nginx nginx-common`
    - Config Directory: `/etc/nginx` (Edit Server Config in `/etc/nginx/sites-available/default`)
    - Index Directory: `var/www/html`
    - Start Nginx: `service nginx start`
    - Reload Nginx: `service nginx reload`
    - Stop Nginx: `service nginx stop`
2. Certbot Certificates

```bash
apt install snapd
snap install core
snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot
certbot --nginx
```
