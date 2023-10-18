# git-repo-mover

A simple tool to help with moving git repos around


## Notes

```yaml
sourceSystem: github
destinationSystem: github
repos:
- source: https://github.somecompany.com/owner/repo  
  destination: https://github.com/owner/repo
```

Initial Flow:

1. Read Config
2. Display what will be done (display list of repos to create)

Apply Flow

1. Create `.output.txt` file to track what has been done. This will be useful in cases where the command fails for some reason (i.e., network failures)
2. Create destination repo
3. Mirror clone, mirror push to destination repo

Delete Flow

1. Read config
2. Display what will be done (display list of source repos to delete)

Delete Apply Flow

1. Read config
2. Create `.delete_output.txt` file to track what has been done.
3. Delete repos