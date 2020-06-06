# Tutorial 2 - Part 11: Create an account on Selfless Heroes API

Before publishing a level on Selfless Heroes API, we need a user account.

Create a user account by executing this command:

```shell
shutils register
```

Fill in your username, email address and password. Then a confirmation email
will be sent to your email address. Copy the code from this email into the
terminal and you should get the message `User account activated successfully`.

    √ username ... tutorial_user
    √ email ... tutorialemail@example.com
    √ password ... *****************
    User registration success

    √ activation code received by email ... SICFGP
    User account activated successfully

If you didn't get the email, you can ask for a new email to be sent with the
following command:

```shell
shutils register --send-email
```

    √ email ... tutorialemail@example.com
    Activation code email sent successfully

You can activate your account with the activation code by executing the
following command:

```shell
shutils register --activate
```

    √ email ... tutorialemail@example.com
    √ activation code received by email ... SICFGP
    User account activated successfully

Next: [:arrow_forward: Part 12: Publish a level on the API](tutorial2_12.md)
