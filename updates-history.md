# Updates history
#### Release 1.1.5
- Added huge amount of docs
- Added implementation interfaces for classes
- Added warning if password is incorrect (starting not with `oauth:`)
- Reworked `prepareIRCMessage`. It checks if the last letter was `\n`, method 
removes it and split by `\n`.
- Socket is now responsible for keeping a connection alive via responding 
with `PONG` message in server's `PING`.
