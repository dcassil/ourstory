User
id
username
password
role
displayName

Story
title: <String>
authors: [{id: user.id, userName: user.displayName}]
creator: {id: <user.Id>, name: user.displayName}
seed: <String> first sentece of story
lastContent: <StoryContent>
content: [StoryContent]

StoryContent
id: <number>
position: <number>
topFragment: <StoryContentFragment>
lastFragment: <StoryContentFragment>
fragments: [StoryContentFragment.id]

StoryContentFragment
id: <number>
text: <String>
author: {id: user.id, userName: user.displayName}
upVotes: <number>
downVotes: <number>
