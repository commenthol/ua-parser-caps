Contributing Changes
--------------------

Contributing to the project, especially to the capability files `caps_*.yaml`, is both welcomed and encouraged. To do so just do the following:

1. Fork the project
2. Create a branch for your changes
3. Modify `caps_*.yaml` as appropriate
4. Add tests to the following files and follow their format:
    * `test/resources/test_caps_*.yaml`
5. Push your branch to GitHub and submit a pull request
6. Monitor the pull request to make sure the Travis build succeeds.
If it fails simply make the necessary changes to your branch and push it. Travis will re-test the changes.

That's it. If you don't feel comfortable forking the project or modifying the YAML you can also [submit an issue][issues] that includes the appropriate user agent string and the expected results of parsing.

In case that `ua-parser2` requires an update as well, please consider contributing to [ua-parser2][] as well.


Thanks!


[issues]: https://github.com/commenthol/ua-parser-caps/issues
[ua-parser2]: http://github.com/commenthol/ua-parser2
