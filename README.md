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

[tokens]: ./docs/tokens.md