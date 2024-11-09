package main

import "github.com/pusher/pusher-http-go/v5"

func Pusher(env *Env) *pusher.Client {
	return &pusher.Client{
		AppID:   env.PUSHER_APP_ID,
		Key:     env.PUSHER_KEY,
		Secret:  env.PUSHER_SECRET,
		Cluster: env.PUSHER_CLUSTER,
		Secure:  env.PUSHER_SECURE,
	}
}
