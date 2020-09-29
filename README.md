Dashup Module Discord
&middot;
[![Latest Github release](https://img.shields.io/github/release/dashup/module-discord.svg)](https://github.com/dashup/module-discord/releases/latest)
=====

A connect interface for discord on [dashup](https://dashup.io).

## Contents
* [Get Started](#get-started)
* [Connect interface](#connect)

## Get Started

This discord connector uses a dashup connect interface to bridge messages between discord and dashup:

```json
{
  "url" : "https://dashup.io",
  "key" : "[dashup module key here]",

  
  "token"  : "[discord token]",
  "client" : "[discord bot id]",
  "secret" : "[discord secret]"
}
```

To start the connection to dashup:

`npm run start`

## Deployment

1. `docker build -t dashup/module-discord .`
2. `docker run -d -v /path/to/.dashup.json:/usr/src/module/.dashup.json dashup/module-discord`