# Demus Converter
A fully broswer based Demus .playlist file parser and converter to YouTube playlists.

![page screenshot](/assets/img1.png)

## Hosting
This repo contains a [Dockerfile](/Dockerfile), which uses [SWS](https://static-web-server.net) for static file hosting. The entire project is completely static, so you can choose any static file hoster you see fit.

Example (assumes you have docker installed and running):

```sh
git clone https://github.com/hydrogenmacro/demus-converter 
cd demus-converter

# This launches SWS on port 80; consider using docker compose to change it
docker build -t demus-converter .
docker run demus-converter
```
