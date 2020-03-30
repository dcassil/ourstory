User
id
username
password
role
displayName
votes: {
up: [<userId>],
down: [<userId>]
},
abuseMarks: [{userId: <id>, comment: <string>, storyId: <id>, fragmentId: <id>}]

Story
title: <String>
authors: [{id: user.id, userName: user.displayName}]
author: {id: <user.Id>, name: user.displayName}
seed: <String> first sentece of story
teaser: <string> // first 1000 characters.
lastContent: {
id: <number>
createdDate: <date mills>
fragment: <string>
author: {id: user.id, userName: user.displayName}
upVotes: [<userId>]
downVotes: [<userId>]
}

StoryContent
id: <number>
storyId: <number>
position: <number>
topFragment: <StoryContentFragment>
lastFragment: <StoryContentFragment>

StoryContentFragment
id: <number>
storyContentId: <number>
text: <String>
author: {id: user.id, userName: user.displayName}
upVotes: [<userId>]
downVotes: [<userId>]
createdDate: <Date mills>
