ua-parser-caps specification
============================

This specification shall provide information to understand how `ua-parser-caps` works and allow the reader to create their own capability files or extend existing ones.

### Table of Contents

* [Specifying capabilities](#specifying-capabilities) 
* [Discovering capabilities](#discovering-capabilities) 
  * [Regular Expressions](#regular-expressions) 
  * [Overwrites](#overwrites)
  * [Extends](#extends)
  * [Order of capabilities application](#order-of-capabilities-application)
* [Merging Capability Files](#merging-capability-files)


<a id="specifying-capabilities" href="#">^Top</a>
## Specifying capabilities

All capabilities are added to a capabilities tree as "leaves" using the keyword `capabilities` .

The branches of the capabilities-tree are formed by using the attributes provided by the result of the *ua-parser* which are based on a given user-agent string. This object is considered by *ua-parser-caps* as input:

````json
{
  string: "", // user-agent string
  os: {
    family: "",
    major: "",
    minor: ""
  },
  ua: {
    family: "",
    major: "",
    minor: ""
  },
  device: {
    family: "",
    brand: "",
    model: ""
  }
}
````

The basic structure of all capability trees needs to follow:

````yaml
# Defaults
default:
# OS specifics
os:
  family:
    "os.family":
      major:
        "os.major":
          minor:
            "os.minor":
# User-Agent specifics
ua:
  family:
    "ua.family":
      major:
        "ua.major":
          minor:
            "ua.minor":
# Device specifics
device:
  family:
    "device.family":
  brand:
    "device.brand":
      model:
        "device.model":
````

Based on this, the capabilities are added to the capabilities tree. For example:

````yaml
# defaults
default:
  capabilities:
    device:
      type: 'phone'
# os specifics
os:
  family:
    "Android":   # os.family name
      capabilities: # "Android" capabilities
        device:
          type: 'smartphone'
      major:
        "3":     # os.major number/name 
          capabilities: # "Android 3" capabilities
            device:     # capability group
              type: 'tablet'
          minor:
            "1": # os.minor number/name
              capabilities: # "Android 3.1" capabilities
# user agent specifics
ua:
  family:
    "Chrome Mobile": # ua.family name
      capabilities: # "Chrome Mobile" capabilities
        ...
      major:
        "18":       # ua.major number/name 
          capabilities: ...
          minor:
            "0":    # ua.minor number/name
              capabilities: ...
# device specifics
device:
  family:
    "HbbTV":        # device.family name
      capabilities: ...
  brand:
    "Gumsang":      # device.brand name
      capabilities: ...
      model:
        "GU-L9000": # device.model name
          capabilities: ...
````

On each leaf of the tree, capabilities can be added. The `capabilities` keyword defines the structure for the to be applied capabilities on that specific leaf. It is defined as:

````yaml
capabilities:
  groupname_1:
    attrname_1: "attribute_1"
    ...
    attrname_N: "attribute_N"
  groupname_2:
    attrname_1: "attribute_1"
    ...
    subgroup_1:
      attrname_S1: "attribute_S1"
      ...
````

Under capabilities groups of attributes follow. You are free to specify any type of group names or subgroups depending of what you intend to attribute. Processing of these groups, subgroups and attributes is out of scope of this project.

For example you could add capabilities for a tablet:

````yaml
capabilities:
  device:
    type: 'tablet'
  screen:
    size: 7.0
    height: 600
    width: 800
  markup:
    wml: '1.2'
    html: '4'
````

<a id="discovering-capabilities" href="#">^Top</a>
## Discovering capabilities

````
   (*) 
    |
    V
  [default]  
    |
    V
  [os]
    |
    V
  [ua]
    |
    V
  [device]
    |
    V
   (X)
````

Capabilities are gathered from the tree by starting with the capabilities named under `default`.
These default capability-set then gets extended by `os.family`, `os.major` and `os.major` specific caps if present.
On the next stage capabilities are extended by `ua.family`, `ua.major` and `ua.minor`.
The last stage extends the collected capabilities by `device.family` or `device.brand` and `device.model`.
Any stage is optional, i.e. if any of the keys `default`, `os`, `ua` or `device` are missing, the next branch is choosen.


<a id="regular-expressions" href="#">^Top</a>
### Regular Expressions

Capabilities can also be added depended of regular expressions which are applied to the full user-agent string. 
`regex` defines the regular expression matching the user-agent-string. If the regex matches then the capabilities are applied after applying the general capabilities.
`regex_not` is the opposite of `regex`. Capabilities are applied here when the regex pattern is not found.
Multiple expressions can follow `regexes`. They are executed from first to last. The first match breaks the execution.

Regular Expressions which are placed under the branches `family`, `major`, `minor`, `brand`, `model` evaluate over the provided value by the *ua-parser*.

All regular expressions are case insensitive!

````yaml
device:
  brand:
    'Gumsang':
      regexes:
        - regex_not: 'Mobile Safari'
          capabilities: 
            device: 
              type: 'tablet'
        - regex: 'Mobile'
          capabilities: 
            device: 
              type: 'smartphone'
      capabilities:
        device:
          bearer: '3G'
          type: 'unknown'
      model:
        regexes:
          - regex: 'cool'
            capabilities:
              device:
                type: 'cool_smartphone'
````

In the above example the capability "device.bearer" is applied to all "Gumsang" devices. If the user-agent-string does not contain "Mobile Safari" then "device.type" equals to "tablet". In case it is not, but the user-agent-string contains "Mobile" then "device.type" will be "smartphone".

If the value of `device.model` contains "cool" then the "device.type" gets replaced by "cool_smartphone".

Note: `regex` or `regex_not` applied to `device.brand` or `device.brand` shall **NOT** contain the character "\_" but instead use " ". In order to obtain better matching results for devices, all nodes for "device.brand" and "device.brand.model" get extended by a lower-case version of the values and all "\_" chars get replaced by " ".


<a id="overwrites" href="#">^Top</a>
### Overwrites

`ua` capabilities can have overwrites per `os` or `device`. This is useful if for example a user-agent behaves strange on a specific `os` or `device`.
On `device` you can apply `ua` or `os` overwrites respectively.

````
   (*) 
    |
    V
  [default]
    |
    V
  [os]
    |
    V
  [ua]-->(overwrite)-->[os|device]--+
    |                               |
    |   +---------------------------+
    |   |
    V   V
  [device]-->(overwrite)-->[ua|os]-->(X)
    |
    V
   (X)
````


````yaml
ua:
  family:
    "Android":
      major:
        "4":
          capabilities: #No1
            css:
              style_input_fields: true
          overwrites:
            - device:
                brand:
                  "Gamsung":
                    capabilities: #No2
                      css:
                        style_input_fields: false
                    model:
                      "Cooler":
                        capabilities: #No3
                          css:
                            style_input_fields: true
````

E.g. you experience styling problems on legacy "Gamsung" Android 4 devices, but you only want to restrict this to this User-Agent on those devices. Cap #No1 gets here overwritten by Cap #No2
In the later you discover that on the model "Cooler" the problem observed was fixed. Revert Cap #No3 then for the model "Cooler".


<a id="extends" href="#">^Top</a>
### Extends

In order of not repeating always the same capability-sets, "extends" can be used to reference to an already given set of capabilities. Extends can be traversed over various capability sets. Extends are always applied before "regexes" any "capabilities".

````yaml
device:
  brand:
    "Gumsang":
      model:
        "Phone"
          capabilities:
            communication:
              telefone: true
        "CoolPhone"
          extends:
            - device:
                brand: "Gumsang"
                model: "Phone"
          capabilities:
            communication:
              conferencing: true 
        "Communicator"
          extends:
            - device:
                brand: "Gumsang"
                model: "CoolPhone"
          capabilities:
            communication:
              video: true 
````

In the example above the "Gumsang Communicator" devices capabilities get extended by "CoolPhone" and "Phone" leading to the capability set:

````json
{
  communication: {
    telefone: true,
    conferencing: true,
    video: true
  }
}
````


<a id="order-of-capabilities-application" href="#">^Top</a>
### Order of capabilities application

1. extends
   from last to first in tree traversal
2. capabilities
3. regexes
   from first to last in Array
4. overwrites
   from first to last in Array

Please try to underline this processing order while writing your capabilities. This will help on debuging issues.

For example:

````yaml
os:
  family:
    "os.family":
      extends:
        ...
      capabilities:
        ...
      regexes:
        ...
      overwrites:
        ...
````


<a id="merging-capability-files" href="#">^Top</a>
## Merging Capability Files

Various capability-files can be named to get loaded. All files are then merged into the other, starting from first to last.
This will allow to use capabilities from different sources. For example you can maintain the capabilities you need for your purposes alongside with public available capabilities.

The configuration of the files to be used is done within the file `js/config.js` for the "js" implementation.

Assume the following files:

`file1`
````yaml
os:
  family:
    "Windows CE"
      capabilities:
        device:
          type: "smartphone"
```` 

`file2`
````yaml
os:
  family:
    "Windows CE"
      capabilities:
        image:
          png: false
````

will result in:
````yaml
os:
  family:
    "Windows CE"
      capabilities:
        device:
          type: "smartphone"
        image:
          png: false
````

This mechanism can also be choosen to apply patches on a given capability-file. In case of choosing a public capability file please consider contribution to provide your findings back into the community. Thanks.

