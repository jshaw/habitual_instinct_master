# habitual_instinct_master
web gui + node.js master controls for slave arduino boards for habitual instinct thesis

Note: 
In the git repo I updated the git working tree for `pubnub_config.json` + `pubnub_config.txt`  so i can store local enviroment vars in the file locally but still have the file apart of the the repo... http://stackoverflow.com/questions/4348590/how-can-i-make-git-ignore-future-revisions-to-a-file 

add file to skip working tree
`git update-index --skip-worktree pubnub_config.json pubnub_config.txt`

add files back to not skip from working tree
`git update-index --no-skip-worktree pubnub_config.json pubnub_config.txt`

Thesis grad show / GradEx channels

 habitual_instinct_control => channel to send web controls between Pi and web app
 habitual_instinct_app => data channel for df grad show + gradex exhibits 
 hi_vector_2017 => data channel for vector 2017 data