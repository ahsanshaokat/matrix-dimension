# Scalar API (matrix.org)

Scalar has a server-side component to assist in managing integrations. The known endpoints are documented below. All of them require a `scalar_token` provided from the vector.im scalar (`https://scalar.vector.im`).

None of these are officially documented, and are subject to change.

## POST `/api/integrations?scalar_token=...`

**Body**:
```
{
  "RoomID": "!JmvocvDuPTYUfuvKgs:t2l.io"
}
```
*Note*: Case difference appears to be intentional.

**Response**:
```
{
  "integrations": [{
    "type": "rssbot",
    "user_id": "@travis:t2l.io",
    "config": {
      "feeds": {
        "https://ci.t2l.io/view/all/rssAll": {
          "poll_interval_mins": 0,
          "is_failing": false,
          "last_updated_ts_secs": 1495995601,
          "rooms": ["!JmvocvDuPTYUfuvKgs:t2l.io"]
        }
      }
    },
    "self": false
  },{
    "type": "rssbot",
    "user_id": "@travis:tang.ents.ca",
    "config": {
      "feeds": {
        "https://ci.t2l.io/job/java-simple-eventemitter/rssAll": {
          "poll_interval_mins": 0,
          "is_failing": false,
          "last_updated_ts_secs": 1495995618,
          "rooms": ["!JmvocvDuPTYUfuvKgs:t2l.io"]
        }
      }
    },
    "self": true
  },{
    "type": "travis-ci",
    "user_id": "@travis:t2l.io",
    "config": {
      "webhook_url": "https://scalar.vector.im/api/neb/services/hooks/some_long_string",
      "rooms": {
        "!JmvocvDuPTYUfuvKgs:t2l.io": {
          "repos": {
            "turt2live/matrix-dimension": {
              "template": "%{repository}#%{build_number} (%{branch} - %{commit} : %{author}): %{message}\n    Change view : %{compare_url}\n    Build details : %{build_url}\n"
            }
          }
        }
      }
    },
    "self": false
  }]
}
```

## POST `/api/integrations/{type}?scalar_token=...`

**Params**:
`type` appears to be one of the following:
* github
* giphy
* google
* wikipedia
* guggy
* imgur
* rssbot
* travis-ci

**Body**:
```
{
  "room_id": "!RtMvcvtjkfHeFbjzWM:t2l.io"
}
```

**Response**:
```
{
  "bot_user_id": "@neb_giphy:matrix.org",
  "integrations": []
}
```
*Note*: `integrations` appears to only be present when there are settings needed for the integration.

**RSS Bot Response**:
```
{
  "bot_user_id": "@_neb_rssbot_=40travis=3at2l.io:matrix.org",
  "integrations": [{
    "type": "rssbot",
    "user_id": "@travis:t2l.io",
    "config": {
      "feeds": {
        "https://ci.t2l.io/view/all/rssAll": {
          "poll_interval_mins": 0,
          "is_failing": false,
          "last_updated_ts_secs": 1495957242,
          "rooms": ["!JmvocvDuPTYUfuvKgs:t2l.io"]
        }
      }
    },
    "self": false
  }]
}
```

**Travis-CI Bot Response**:
```
{
  "bot_user_id": "@_neb_travisci_=40travis=3at2l.io:matrix.org",
  "integrations": [{
    "type": "travis-ci",
    "user_id": "@travis:t2l.io",
    "config": {
      "webhook_url": "https://scalar.vector.im/api/neb/services/hooks/some_long_string",
      "rooms": {
        "!JmvocvDuPTYUfuvKgs:t2l.io": {
          "repos": {
            "turt2live/matrix-dimension": {
              "template": "%{repository}#%{build_number} (%{branch} - %{commit} : %{author}): %{message}\n    Change view : %{compare_url}\n    Build details : %{build_url}\n"
            }
          }
        }
      }
    },
    "self": true
  }]
}
```


## POST `/api/removeIntegration?scalar_token=...`

**Body**:
```
{
  "type": "giphy",
  "room_id": "!RtMvcvtjkfHeFbjzWM:t2l.io"
}
```

## POST `/api/integrations/rssbot/configureService?scalar_token=...`

**Body**:
```
{
  "room_id": "!JmvocvDuPTYUfuvKgs:t2l.io",
  "feeds": {
    "https://ci.t2l.io/view/all/rssAll": {}
  }
}
```

## POST `/api/integrations/travis-ci/configureService?scalar_token=...`

**Body**:
```
{
  "rooms": {
    "!JmvocvDuPTYUfuvKgs:t2l.io": {
      "repos": {
        "turt2live/matrix-dimension": {
          "template": "%{repository}#%{build_number} (%{branch} - %{commit} : %{author}): %{message}\n    Change view : %{compare_url}\n    Build details : %{build_url}\n"
        }
      }
    }
  }
}
```

## GET `/api/bridges/irc/_matrix/provision/querynetworks?scalar_token=...`

**Response**
```
{
  "replies": [
    {
      "rid": "...",
      "response": {
        "servers": [
          {
            "bot_user_id": "@appservice-irc:matrix.org",
            "desc": "Freenode",
            "fields": {
              "domain": "chat.freenode.net"
            },
            "icon": "https:\/\/matrix.org\/_matrix\/media\/v1\/download\/matrix.org\/DHLHpDDgWNNejFmrewvwEAHX",
            "network_id": "freenode"
          }
        ]
      }
    },
    {
      "rid": "...",
      "response": {
        "servers": [
          {
            "bot_user_id": "@mozilla-irc:matrix.org",
            "desc": "Moznet",
            "fields": {
              "domain": "irc.mozilla.org"
            },
            "icon": "https:\/\/matrix.org\/_matrix\/media\/v1\/download\/matrix.org\/DHLHpDDgWNNejFmrewvwEAHX",
            "network_id": "mozilla"
          }
        ]
      }
    }
  ]
}
```

## POST `/api/bridges/irc/_matrix/provision/querylink?rid=...&scalar_token=...`

**Body**
```
{
  "remote_room_channel": "#dimensiontesting",
  "remote_room_server": "chat.freenode.net"
}
```

**Response**
```
{
  "replies": [{
    "rid": "...",
    "response": {
      "operators": ["travis-test"]
    }
  }]
}
```

## POST `/api/bridges/irc/_matrix/provision/link?rid=...&scalar_token=...`

**Body**
```
{
  "matrix_room_id": "!JmvocvDuPTYUfuvKgs:t2l.io",
  "remote_room_channel": "#dimensiontesting",
  "remote_room_server": "chat.freenode.net",
  "op_nick": "travis-test",
  "key": ""
}
```

**Response**
```
{
  "replies": [{
    "rid": "...",
    "response":{}
  }]
}
```

*Note*: This returns 200 OK after sending the request to link. If the link succeeds, `listlinks` will show as such.

## GET `/api/bridges/irc/_matrix/provision/listlinks/{roomId}?scalar_token=...`

**Params**
* `{roomId}` - the matrix room id (ie: `!JmvocvDuPTYUfuvKgs:t2l.io`)

**Response**
```
{
  "replies": [
    {
      "rid": "...",
      "response": [
        {
          "matrix_room_id": "!JmvocvDuPTYUfuvKgs:t2l.io",
          "remote_room_channel": "#dimensiontesting",
          "remote_room_server": "chat.freenode.net"
        }
      ]
    },
    {
      "rid": "...",
      "response": []
    }
  ]
}
```

*Note*: This is called on a timer in Scalar to show when a user has approved a link. Called every few seconds.

## POST `/api/bridges/irc/_matrix/provision/unlink?rid=...&scalar_token=...`

**Body**
```
{
  "matrix_room_id": "!JmvocvDuPTYUfuvKgs:t2l.io",
  "remote_room_channel": "#dimensiontest",
  "remote_room_server": "chat.freenode.net",
  "rid": "..."
}
```

**Response**
```
{
  "replies": [
    {
      "rid": "..",
      "response": {}
    }
  ]
}
```

## POST `/api/integrations/github-webhook?scalar_token=...`

**Body**
```
{
  "room_id": "!JmvocvDuPTYUfuvKgs:t2l.io"
}
```

**Response**
```
{
  "bot_user_id": "@_neb_github_=40travis=3atang.ents.ca:matrix.org",
  "authenticated": false,
  "session": null,
  "integrations": []
}
```

**Response (if authed)**
```
{
  "bot_user_id": "@_neb_github_=40travis=3at2l.io:matrix.org",
  "authenticated": true,
  "session": {
    "Repos": [
      {
        "name": "riot-welcome-page",
        "description": "A welcome page specific for tang.ents.ca (built for Riot)",
        "private": false,
        "html_url": "https:\/\/github.com\/ENTS-Source\/riot-welcome-page",
        "created_at": "2017-06-10T16:54:37Z",
        "updated_at": "2017-06-10T19:10:21Z",
        "pushed_at": "2017-06-10T18:15:07Z",
        "fork": false,
        "full_name": "ENTS-Source\/riot-welcome-page",
        "permissions": {
          "admin": true,
          "pull": true,
          "push": true
        }
      },
      {
        "name": "matrix-dimension",
        "description": "An alternative integrations manager for Riot",
        "private": false,
        "html_url": "https:\/\/github.com\/turt2live\/matrix-dimension",
        "created_at": "2017-05-25T21:41:55Z",
        "updated_at": "2017-05-28T18:33:57Z",
        "pushed_at": "2017-06-11T01:41:02Z",
        "fork": false,
        "full_name": "turt2live\/matrix-dimension",
        "permissions": {
          "admin": true,
          "pull": true,
          "push": true
        }
      },
    ]
  },
  "integrations": []
}
```

*Note*: For organization avatars: `https://github.com/turt2live.png`

## POST `/api/integrations/github/requestAuthSession?scalar_token=...`

**Body**
```
{
  "RedirectURL": "https://scalar.vector.im/?scalar_token=...&room_id=!JmvocvDuPTYUfuvKgs%3At2l.io&github_auth_complete=1"
}
```

**Response**
```
{
  "URL": "https://github.com/login/oauth/authorize?client_id=...&client_secret=...&redirect_uri=https%3A%2F%2Fscalar.vector.im%2Fapi%2Fneb%2Frealms%2Fredirects%2F...&scope=admin%3Arepo_hook%2Cadmin%3Aorg_hook%2Crepo&state=..."
}
```

## POST `/api/integrations/github/removeAuthSession?scalar_token=...`

**Body**
```
{}
```

**Response**
```
{}
```

## POST `/api/integrations/github-webhook/configureService?scalar_token=...`

**Body**
```
{
  "RoomID": "!JmvocvDuPTYUfuvKgs:t2l.io",
  "Config": {
    "Repos":  {
      "ENTS-Source/amember-google-groups": {
        "Events": ["push", "pull_request", "issues", "issue_comment", "pull_request_review_comment", "labels", "milestones", "assignments"]
      },
      "ENTS-Source/amember-mastercontrol": {
        "Events": ["push", "pull_request"]
      }
    }
  }
}
```

**Response**
```
{}
```

*Note*: Invite person-specific bot on first repository