
- match text: **===START===
1st inline text.
===END===**
- captures: **[]**
- startIndex: **0**
- endIndex: **38**

```
**===START===
1st inline text.
===END===**

2 test

===START===
2nd inline text.
===END===

3 test

===START===
3rd text.
multi line text.
===END===

```



- match text: **===START===
2nd inline text.
===END===**
- captures: **[]**
- startIndex: **48**
- endIndex: **86**

```
===START===
1st inline text.
===END===

2 test

**===START===
2nd inline text.
===END===**

3 test

===START===
3rd text.
multi line text.
===END===

```



- match text: **===START===
3rd text.
multi line text.
===END===**
- captures: **[]**
- startIndex: **96**
- endIndex: **144**

```
===START===
1st inline text.
===END===

2 test

===START===
2nd inline text.
===END===

3 test

**===START===
3rd text.
multi line text.
===END===**

```

