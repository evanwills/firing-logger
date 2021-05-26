# Program edit workflow

Because kiln programs have significant effect, changing them without conscious thought can have disastrous effects.

A program object has two types of state

* `used` - whether or not, the given version of the program has ever been used or selected for use
* `superseded` - whether or not a given version of the program has been superseded. (i.e. update after it's been used)

## Program `used`

A program's `used` state is `FALSE` if it has never been used or selected for use. In this state, all aspects of the program can be updated without a new version bring created.

If a program's `used` state is `TRUE`, that version can never be altered. Instead when a change is required:

* the program is cloned, 
* the clone's version number is incremented
* any changes are applied to the clone
* The original program object's `superseded` state changes to `TRUE`

## Program `superseded`

A program's `superseeded` state is `FALSE` by default. It becomes `TRUE` when a new version of the program is created.

Once a program's `superseded` state is true, it can no longer be selected for use.

If the program was selected for use before it was superseded but the firing hasn't started, at start time, the user is notified that there has been a change and asked if they want to their version of the program to be updated to the latest version.

## New programs

When creating a new program, copying an existing program or modifying an existing, used program the program object is stored in a `tmp` program until the program is `saved`