# Program edit workflow

Because kiln programs have significant effect, changing them without conscious thought can have disastrous effects.

A program object has two types of state

* `used` - whether the program has been used or selected for use
* `superseded` - whether or not a given version of the program has been superseded. 

## Program `used`

A program's `used` state is `FALSE` if it has never been selected for use. In this state,  aspects of the program can be updated.

If a program's `used` state is `TRUE`, that version can never be altered. Instead when a change is required:

* the program is cloned, 
* the clone's version number is incremented
* any changes are applied to the clone
* The original program object's `superseded` state changes to `TRUE`

## Program `superseded`

If the program has been selected for use but the firing hadn't started, at start time, the user is notified that there has been a change and asked if the want to their version of the program updated to the latest version.