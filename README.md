# Full Stack Web

## Introduction

A full stack web application for my personal website containing static blogs, a user system, an editable bookmark, a message transmitter and a private gpt.

## Tech Stack

Front End: Node.js: Express, Webpack, Axios, React

Back End: Node.js Express + Python Flask + MySQL + Nginx

## Live Demo

[https://www.windsnow1025.com](https://www.windsnow1025.com)

## Requirements

Logged in as the root user in Debian 11 with a minimum RAM of 2GB.

## Setup

### Nginx

#### Install

Edit `FullStack-Web/config/linux/nginx/default`, change `server_name` to your domain name.

```bash
apt update
apt install nginx
```

#### Configure

Copy `FullStack-Web/config/linux/nginx/default` to `/etc/nginx/sites-available/default`.

```bash
systemctl start nginx
```

### Certbot

```bash
apt install snapd
snap install core
snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot
certbot --nginx
```

### Docker

```bash
apt-get install ca-certificates curl gnupg
```

```bash
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
```

```bash
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

```bash
apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Front End - React.js

```bash
cd FullStack-Web/react
docker build -t react .
```

### Back End - Node.js

```bash
cd FullStack-Web/node
docker build -t node .
```

### Back End - Python Flask

```bash
cd FullStack-Web/flask
docker build -t flask .
```

### Back End - MySQL

```bash
cd FullStack-Web/mysql
docker build -t mysql .
```

### Docker Compose

Edit `FullStack-Web/config/docker-compose/docker-compose.yaml`, change `MYSQL_ROOT_PASSWORD`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, `JWT_SECRET`, `OPENAI_API_KEY` to your own.

Copy `FullStack-Web/config/docker-compose/docker-compose.yaml` to `/root/docker-compose.yaml`.

```bash
docker compose up
```

## Usage

### Test

```bash
curl localhost:80
```
