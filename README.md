# git-repo-mover

A simple tool to help with moving git repos around

## Definitions

* `SourceSystem` - the location from where the repositories are being cloned/deleted.
* `DestinationSystem` - the location where the repositories are being created/pushed-to.

## Usage

While this tool was made to streamline the transfer of many repos from one system to another, some basic setup is still necessary. This section details such setup and covers how to then utilize this tool for one case: transferring from GitHub Enterprise Server to GitHub.

### Setup

1. Install [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
2. Authenticate git with the credentials of your Source System (i.e., login to GitHub via git)
3. Authenticate git with the credentials of your Destination System (i.e., login to GitHub via git)
4. Create a `.env` file in the location where this tool will be ran.
   * Create a Token (see [tokens][tokens]) for your Source System, and add it to the `.env` file (e.g., `SourceToken=token`)
   * Add SourceApiHost to the `.env` file (e.g., `SourceHost=https://github.somecompany.com/api/v3`)
   * Create a Token (see [tokens][tokens]) for your Destination System, and add it to the `.env` file (e.g., `DestinationToken=token`)
   * Add DestinationApiHost to the `.env` file (e.g., `SourceHost=https://api.github.com`)

You are now done with the setup of this tool! At this point, you should have a `.env` file that looks something like the following:

```.env
SourceToken=token
SourceApiHost=https://github.somecompany.com/api/v3
DestinationToken=token
DestinationApiHost=https://api.github.com
```

### Generate a Config

The configuration file can be a pain to create by hand when you have many repositories you want to transfer! As such, a command has been added to this tool to assist. To use, simply run the following command:

```sh
sourceAccount="JoshuaTheMiller"
destinationAccountUrl="https://github.com/SomeOtherAccount"
git-repo-mover generate-configuration -a $sourceAccount -d $destinationAccountUrl --source-type github --destination-type github
```

After successfully running the command shown above, you should find a file named `config.yaml` in the same directory from which this command was run.

📝 you do **not** need to split the values out into variables, though I did for clarity in the example above.

### Transfer Repositories

As this tool does a lot of work for you, I recommend running it in two steps: 

1. Dry Run
2. Accept Apply

By default, this tool runs the `apply` command in dry-run mode:

```sh
# Dry Run first to see what the tool will do
git-repo-mover apply
```

After you are comfortable with the dry run, accept what the tool is planning to do:

```sh
git-repo-mover apply --accept
```

### Help

Sometimes repositories transfers may fail. This can happen for a variety of reasons (i.e., network failures). Regardless, this tool contains helper commands to assist with that.

```sh
git-repo-mover apply output
```

See the [FAQs](#faqs) for common issues.

## FAQs

Commonly asked questions, with answers!

### Output Files Issues

If you were received the following message this section is for you: `Run the following command for more help: "git-repo-mover help output"`.

To resolve this, first check the generated `.output.json` file for any errors. When you find an error (denoted by the presence of a `"status": "failed"` property), read the `message` property to determine what you must do to resolve the issue.

Once the issue is resolved, you must remove that entry from the `.output.json` file. The following snippets demonstrates what the file may look like before and after such activities. In this example, `https://github.com/what/foo2` had an issue where the Destination repository already existed. To solve the problem, the repository was deleted, and the associated SourceEntry was deleted from the `.output.json` file:

**Before**
```json
[
  {
    "repo": "https://github.com/what/foo1",
    "status": "failed",
    "message": "Repository creation failed.: {\"resource\":\"Repository\",\"code\":\"custom\",\"field\":\"name\",\"message\":\"name already exists on this account\"}"
  },
  {
    "repo": "https://github.com/what/foo2",
    "status": "failed",
    "message": "Repository creation failed.: {\"resource\":\"Repository\",\"code\":\"custom\",\"field\":\"name\",\"message\":\"name already exists on this account\"}"
  },
  {
    "repo": "https://github.com/what/foo3",
    "status": "transferred"
  }
]
```

**After**
```json
[
  {
    "repo": "https://github.com/what/foo1",
    "status": "failed",
    "message": "Repository creation failed.: {\"resource\":\"Repository\",\"code\":\"custom\",\"field\":\"name\",\"message\":\"name already exists on this account\"}"
  },
  {
    "repo": "https://github.com/what/foo3",
    "status": "transferred"
  }
]
```

[tokens]: ./docs/tokens.md