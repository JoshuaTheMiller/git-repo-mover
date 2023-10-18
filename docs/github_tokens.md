# GitHub Tokens

At this point in time, this tool only supports the usage of Personal Access Tokens. Please contribute if you'd like to see other mechanisms!

Note that if you are working for a company that uses SAML based authentication, you will need to [enable your token for SSO](https://docs.github.com/en/enterprise-cloud@latest/authentication/authenticating-with-saml-single-sign-on/authorizing-a-personal-access-token-for-use-with-saml-single-sign-on).

## Source System Token

* Name: GitRepoMover
* Expiration: 7 Days
* Scopes
    * repo (all)
    * delete_repo --> only check this if you intend for the tool to delete source repositories!

## Destination System Token

* Name: GitRepoMover
* Expiration: 7 Days
* Scopes
    * repo (all)    