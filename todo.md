# TODO
Here is a list of features that must be realized in the future. Watch for
[updates history](https://github.com/wolframdeus/tw-irc/blob/master/updates-history.md) to
stay informed.

1. Add commands support. We have to make a lot of typings here. Follow docs
to know more - https://dev.twitch.tv/docs/irc/tags/: `MODE`, `CLEARCHAT`, 
`CLEARMSG`, `HOSTTARGET`, `NOTICE`, `RECONNECT`, `ROOMSTATE`, `USERNOTICE`,
`USERSTATE`, `GLOBALUSERSTATE`

2. Fix `JOIN` event. User can join not channel, but chatroom. We are not
currently sending info about chatrooms.

3. Workaround with PRIVMSG (chat rooms). A lot of changes should come in
the feature.

4. Add message parse support via msg-id for NOTICE

5. Add return parameter `self`, which is responsible for detecting if
event is connected with current client.

6. Add warning, that we will not support NAMES command due to it is not 
working as expected (as said Twitch - 
https://dev.twitch.tv/docs/irc/membership/#names-twitch-membership).
Expected behaviour is to get real list of chatters, but there are cases
we get only mods. Or try to realize?

7. Add typings for all metas from events

8. Try to do something with meta value like `moderator/5`. Maybe, parse it like
`{ name: 'moderator', value: 5 }`
