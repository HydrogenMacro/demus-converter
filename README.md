# Demus Converter

A fully broswer based Demus .playlist file parser and converter to YouTube playlists.

![page screenshot](/assets/img1.png)

More information can be found on [the website.](https://demus-converter.256.lol)

## Locally Hosting

This repo contains a [Dockerfile](/Dockerfile), which uses [SWS](https://static-web-server.net) for static file hosting. The entire project is completely static, so you can choose any static file hoster you see fit.

Example (assumes you have docker installed and running):

```sh
git clone https://github.com/hydrogenmacro/demus-converter 
cd demus-converter

docker build -t demus-converter .

# Launch the website on port 8000
docker run -p 8000:80 demus-converter
```
