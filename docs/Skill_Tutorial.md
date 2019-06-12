# SUSI.AI Skill Development Tutorial

Do you want your own AI Skills for SUSI? It's surprisingly easy to add more Skills to SUSI.AI

## Getting Started

It's easy, DON'T PANIC. You don't need to be a software developer to enhance SUSI.AI

### What you have to do

We have a SUSI Skill CMS at https://skills.susi.ai. Here you can create public SUSI.AI skills in a simpled editor window or private skill bots. Both can be created in the same way except that one is public and can be edited by anyone and the other is private, which can be edited only by you. The private skill bot also provides a Javascript embeded code, which you can add to your website. You can configure colors and icons to suite your style.

### Preparation to start testing

To test the SUSI.AI Skills you are editing, you can use the public chat at:
https://chat.susi.ai

Once you create a public SUSI.AI skill you could also test it using the SUSI.AI Android Application at:
https://play.google.com/store/apps/details?id=ai.susi

### Skill Format

Within the SUSI.AI skills editor window you find fields for meta-information, that you need to complete:
```
::name <Skill_name>
::author <author_name>
::author_url <author_url>
::description <description>
::dynamic_content <Yes/No>
::developer_privacy_policy <link>
::image <image_url>
::term_of_use <link>

#Intent
User query1|query2|quer3....
Answer answer1|answer2|answer3...
```

### Schema to organize Skills
An expert is a set of SUSI.AI skills. That means if we edit one text file, that text file represents one expert as it may contain several skills which all belong together.

An 'expert' is stored within the following ontology:
```
* model
|-- * group
    |-- * language
         |-- * expert
             |-- skill
```
Therefore, we can access every expert with the 4-tuple
```
{model, group, language, expert}
```
### The SUSI.AI Skill Language: A Language of Thought
As you will see in the tutorial levels below, the language looks like an extremely simple pattern-matching Question-Answer declaration. But that is just the facade, it is easy for beginners but under the hood there is an expert system which is able to do planning and proving. The artificial intelligence in SUSI.AI is implemented as a theorem prover which can explore the domain of possible answers and gives one which is _true_ in SUSI's universe of knowledge.

However, we had to combine the complex world of declaration-based logic programming with natural language declarations.
We believe that the result is a easy-to-learn skill language with the ability to advance to true artificial intelligence when we reach a certain level of experience.

### Tutorial Level 0: Fixed Query-Answer Phrase Collections

In your editor window write:
```
# SUSI Skill tutorial playground
roses are red
SUSI is a hack
```
This defines one simple intent: to answer on "roses are red" the phrase "SUSI is a hack". The other lines mean:
* all lines starting with `#` are comment lines and are ignored.
* all other text lines define Skills. Skills are separated by empty lines. Comment and section declaration modifiers also count as empty lines and separate Skills.

Now you can test the new intent:
* send the following query to SUSI: "roses are red"
* SUSI.AI will answer with "SUSI is a hack".
The Skill file is just a text file where two lines which are not separated by an empty line represent a conversation pattern.
You can actually add a third line to your file:
```
# SUSI.AI tutorial playground
::prior
roses are red
susi is a hack
skynet is back
```
With that file, SUSI.AI would respond on "roses are red" the answer "SUSI is a hack" and on the query "SUSI is a hack" it would respond "skynet is back". Try it!

### Tutorial Level 1: Random Answers
Skills without a deterministic behavior will create less predictable results.
That can easily be defined with intents. Lets consider you want a intent where different answers
on "What is your favorite dish?" are "Potatoes", "Vegetables" or "Fish". That's easy: add an empty line
to the end of your test file and then:
```
What is your favorite dish
Potatoes|Vegetables|Fish
```

### Tutorial Level 2: Query Alternatives
Maybe you want that SUSI.AI responds to several different queries with the same answer. This can be
done very easy with Alternatives in the query line:
```
Bonjour|Buenos días|Ciao
Hello
```

### Tutorial Level 3: Patterns in Queries
In some cases, the query lines may be so similar, that you want to use a pattern to declare all possible queries for an answer instead of using fixed alternatives. Query patterns can be declared using the `*` wildcard character. A `*` matches any sentence token, but not a substring. That means a `*` replaces a word or a list of words.

```
May I * you?
Yes you may.
```

### Tutorial Level 4: Using Query-Patterns in Answers
It would be nice if we could use the content of the text which matched with the query patterns.
Every pattern that matched has a pattern number: the first pattern has the number 1 and if
we want to use that pattern in the result, we can denote that with the term `$1$`:
```
May I get a *?
Yes you may get a $1$!
```
It is, of course, possible to combine Query-Patterns with alternatives
in the query part and the response part.

### Tutorial Level 5: Multiple Patterns in Queries and Answers
You can have of course multiple wildcards in the query pattern.
There may be different reasons for that: either it is actually intended
that both wildcards are used in the response or one of the wildcard
is just there because you want to ignore everything where it matches.

The following example shows a case where both wildcards are used:
```
For * I can buy a *
Yeah, I believe $1$ is a good price for a $2$
```

Another case is, where you just want to ignore a whole part of the query:
```
* buy a *
Sure, you should buy a $2$!
```

Text patterns like `$1$`are called 'variable pattern'. There is also a special
variable pattern: `$0$` denotes the whole sentence, identical to what the user asked susi.


### Tutorial Level 6: Using Variables from Answer Terms
SUSI.AI has a memory! It is possible to store information inside SUSI's user session
and use that information later on. For example, you can tell SUSI your most favorite
beer brand:

```
I * like * beer
You then should have one $2$>_beerbrand!
```

Now SUSI.AI knows your most favorite beer brand, it is stored inside the variable `_beerbrand`. Note that the variable starts with a leading '\_'. That has a special meaning: variables without a leading '\_' are only valid while SUSI.AI is thinking about
a phrase, not after the response has computed. SUSI.AI will not remember a variable if
that variable was set in a past conversation and has not a leading '\_'.

You can now use that variable in another rule:
```
* beer * best?
I bet you like $_beerbrand$ beer!
```
Note that the `*` wildcards in the query are not used at all. They are just there
to make it easy that this rule matches. It will i.e. match on "What beer brand is the best?"

Variables are only visible within the same user session. Therefore we need
authenticated users and that is the main reason that you have to log on to use SUSI.AI


### Tutorial Level 7: Setting Status Variables

A status variable is exactly the same variable as in the previous tutorial level. The difference is that the value of the variable
does not come from a term that is visible in the answer. Instead, an invisible 'status' can be assigned to the variable.

```
I am so happy!
Good for you!^excited^>_mood

I am bored.
Make something!^inactive^>_mood

How do I feel?
You are $_mood$.
```

In this example, SUSI.AI remembers your mood and can tell you about it. The actual word which was used to describe the mood was never printed to the user before because using the `^^` symbols, it got quoted and became invisible.

### Tutorial Level 8: Conditions for Answers

Whenever you are using variables in answers which are not set in the same rule, you should test if these variables exist and had been set.
It is possible to add simple conditions to the answer lines:

```
How do I feel?
?$_mood$:You are $_mood$.:I don't know your mood.
```

This rule replaces the last rule from the latest Level. It makes a distinction between the case where no knowledge about the mood is there, or the mood is set.

```
Shall I *?
?$_mood$=excited:You will be happy, whatever I say!
```

### Tutorial Level 9: Rules used as Functions/Templates (Basic Self-Reflection)

SUSI.AI can call itself during an answer preparation. This can be used to create rules which are designed
to be called in such a self-call. For example:

```
function colour
red|green|blue|white|black|yellow|purple|brown
```

We would not expect that anybody asks "function colour". But we can use this to add the name of a colour in our answer:

```
What is your favorite color?
?$_mycolour$:My favorite colour is $_mycolour$!:I like `function colour`>_mycolour!
```

Here, the colour is randomly generated with the `function colour` call, but only if SUSI.AI has not done that yet. If SUSI.AI just generated a colour in the answer, that answer will be stored in the variable `_mycolour`. But if that variable already existed, it will be used to make the answer without the `function colour`.

### Tutorial Level 10: Embed Javascript into an intent

If you are able to compute whatever you want to inside a rule, there are billions of possibilities of what you can do with SUSI Skills.
Embedding Javascript is extremely easy, for example:

```
javascript hello
!javascript:$!$ from Nashorn
print('Hello world');
eol
```

What you see here is the bang-notion which always starts with a '!', followed by the script language name that is used, then followed
with a ':' and then follows the return statement. The value of the script is represented with the $!$ variable object.
This javascript intent catches everything up that the script produces: std-out, error-out a direct term computations, i.e.

```
compute * to the power of *
!javascript:$1$^$2$ = $!$
Math.pow($1$, $2$)
eol
```

### Tutorial Level 11: Call an external API

Important parts of an AI implementation is, to be able to access big data, many different data sources and to steer
services outside of the body of the AI. To do so, it must be possible to call an external API.
Such a service is called a 'console service' in SUSI:

```
tweet about *
!console:$text$
{
  "url":"http://api.loklak.org/api/search.json?q=$1$",
  "path":"$.statuses"
}
eol
```

This will call the loklak search API and gets back a big list of tweets from the given query in $1$. That list is somewhere inside the
answer json of the API call, and we must tell SUSI where it can find that list. This hint is given in the attribute 'path' which has
the syntax of a JSONPath. Here, the statuses object contains a list of objects, which contain always the same attribute keys.
One of these attributes has the name 'text' and that attribute is selected with the $text$ pattern.
Note that the bang definition part until the eol line must be given in JSON.

#### Test Cases for Values of "path"
1. JSON Format:-
```
{
  "test": {"text":"abc"}
}
```
Here **path:"$.test.text"** will put first element **"abc"** in $object$
To print the value **abc** , put $object$ in console:-
```
!console:$object$
```

2. JSON Format
```
{
  "test": { "text": ["abc", "def"] , "next": {"a":1, "b":2}}
}
```
Here **path: "$.test.next.a"** will put **1** in $object$


3. JSON Format
```
{
  "test": { "text": ["abc", "def"] , "next": {"a":1, "b":2}}
}
```
Here **path: "$.test.text.[1]"** will put **"def"** in $object$


4. JSON Format
```
{
  query: {
    text: [
      "a",
      "b",
      "c"
    ]
  }
}
```
Here **"path": "$.query.text[0]"** will put **"a"** in $object$


### Tutorial Level 12: More Action Types

SUSI.AI Skills may return different types of actions. So far, the only action type we used is the `answer` action.
The result of an `answer` action can be seen with
```
curl http://api.susi.ai/susi/chat.json?q=hello
```
and the result in something like
```
{
  "query": "hello",
  "answers": [{
    "data": [],
    "metadata": {"count": 0},
    "actions": [{
      "type": "answer",
      "expression": "Hello!"
    }]
  }],
}
```
Here check the "actions" object: it contains a list of action objects, each with a "type" attribute.
The "actions" array may contain more than one action and they may be of a different type than "answer".
This tutorial chapter is of the other different types.
Such non-answer actions my get their content using console rules.

The following action types are available:

* table
* piechart
* rss
* websearch
* map
* image
* video

Clients which render SUSI action results must render _all_ actions in the order as they are provided.

#### Table actions:

A table is defined by the names of the colums. The rows of the table are taken
from the "data" object. The following example shows a console rule which produces only one action, which
shall be rendered as table:

```
stock quotes
!console:
{
  "url":"https://www.live-rates.com/rates",
  "path":"$",
  "actions":[{
    "type":"table",
    "columns":{"currency":"Valuta","rate":"Quota"}
  }]
}
eol
```

This intent provides a table with the Spanish words "Valuta" and "Quota" for the table with the columns "currency" and "rate".
The table is defined with the type "table" and a columns object which provides a mapping from the column value names to the
visible descriptive names that shall be rendered in the client's output.

The client will see the following (similar!) JSON for a query like
`http://api.susi.ai/susi/chat.json?q=stock+quotes`:

```
{
  "query": "stock quotes",
  "answers": [{
    "data": [
      {"currency": "EUR/USD", "rate": "1.09302", "timestamp": "1494621900069"},
      {"currency": "USD/JPY", "rate": "113.326", "timestamp": "1494621900186"},
      {"currency": "GBP/USD", "rate": "1.28835", "timestamp": "1494621900129"},
      {"currency": "EUR/GBP", "rate": "0.84831", "timestamp": "1494621900103"},
      {"currency": "USD/CHF", "rate": "1.00133", "timestamp": "1494621899461"}
    ],
    "metadata": {"count": 59},
    "actions": [{
      "type": "table",
      "columns": {
        "currency": "Valuta",
        "rate": "Quota"
      }
    }]
  }]
}
```

The client then should create a table out of the data object where the column names are 'Valuta' and 'Quota', i.e. like this html table:

```
<table>
<tr><th>Valuta</th><th>Quota</th></tr>
<tr><td>EUR/USD</td><td>1.09302</td></tr>
<tr><td>USD/JPY</td><td>113.326</td></tr>
<tr><td>GBP/USD</td><td>1.28835</td></tr>
<tr><td>EUR/GBP</td><td>0.84831</td></tr>
<tr><td>USD/CHF</td><td>1.00133</td></tr>
</table>
```

Now let us say that if a skill developer wants only top 5 rows to be displayed at a time (as at times, APIs send large number JSONArray
encoded responses.). For that we have an attribute "length" in table action type. Now if you want only top n rows should be displayed,
then modify the skill accordingly:

```
...
  "actions":[{
    "type":"table",
    "columns":{"currency":"Valuta","rate":"Quota"},
    "length":"n"
  }]
}
eol

```
This will send first n elements of the JSONArray it is parsing.

Different clients may render tables in a different way.

#### Websearch actions:

Websearch provides results from external API. The search has to be done by the client side with the query returned by the server. The following example shows a console rule which produces only one action, which shall be rendered as websearch results:

```
search for cat
!console:Here is a websearch result:
{
    "url":"http://api.duckduckgo.com/?q=$1$&format=json&pretty=1",
    "path":"$",
    "actions":[{
    "type":"websearch",
    "query":$1$
    }]
}
eol
```

This action can be performed by doing a web search on the client side:

```
{
  "query": "Oh freddled gruntbuggly",
  "answers": [{
    "data": [],
    "metadata": {"count": 0},
    "actions": [
      {"type": "answer", "expression": "I found this on the web:"},
      {
      "type": "websearch",
      "query": "Oh freddled gruntbuggly",
      "count": 3
      }
    ]
  }],
}
```

A websearch action is usually combined with an answer action type which introduces the web search result as a headline. The query attribute for the web search can be found in the query object. Like in table actions, the count object denotes the maximum number of results. -1 means unlimited, meaning that all the results from the web search results are used. The API for the web search can be choosen by the client. A typical rendering of such a search results has three lines:

* a Headline
* a Snippet or Description line (showing the content of the found document where the searched word appears)
* a link.

A rendering would look like:

```
<ul>
  <li class="title">Vogon poetry | Hitchhikers | Fandom powered by Wikia</li>
  <li class="link">http://hitchhikers.wikia.com/wiki/Vogon_poetry</li>
  <li class="description">Oh freddled gruntbuggly,: Thy micturations are to me,: As plurdled gabbleblotchits,: On a lurgid bee,: That mordiously hath blurted out,: Its earted jurtles,: Into a ...</li>
</ul>

.
.
.
... (more search hits as <ul></ul> tags)
```

The actual presentation can differ from this, i.e. using anchor tags it should be possible to click on the title or description and link to the given link content.



Please be aware that a Susi answer may contain more than one action as answer.


### Tutorial Level 13: Problem-Solving Dialog with Counter-Questions

Using SUSI's variables and if rules can be used to create experts which are able to do a dialog to solve a problem.

(to be continued)

### Tutorial Level 14: Expert Systems with Backtracking

Backtracking is the ability of a program to revert a already made setting and take an alternative option. If we consider this behaviour at different states of a computation, then this produces a tree-like parameter graph, which is called a decision tree. SUSI's data structures are made in such a way, that result tables are an element of 'thinking'. Such result tables are 'bags' for backtracking options. We will learn how to use that principle to create loops which are useful for problem-solving.

(to be implemented)

### Tutorial Level 15: Intent Reflection

We are able to set variable content and read them in skills. But we must also be able to read skills in the same way as we read variables. We should be able to answer questions like 'we cannot solve this because there is no rule for that', or 'we have several rules, which one is preferred'.

(to be implemented)

### Tutorial Level 16: Skills which create Skills

It is a core principle of intelligent systems to be able to learn and enhance themselves. We want to create intents which are able to create new intents.

(to be implemented)

### Tutorial Level 17: Inter-SUSI Instance Dialog

SUSI.AI runs in user instances: every chat user of a SUSI.AI instance is an individual instance. Instances may be customized i.e. if the user calls SUSI.AI to dream with a test skill. Therefore different SUSI.AI instances behave differently. It should be possible that two different SUSI.AI instances have different 'opinions' and that two instances start a dialog with each other to find a consensus.
We will learn here how to connect those instances to each other so they can talk.

(to be implemented)

#### Adding Example to a Skill

Every skill can be given an example query using the bang-notion which always starts with a '!' followed by 'example:' and then the example query for the skill:

```
what is your name? | What's your name? | Who are you?| what should i call you? | do you have a name
!example:what is your name?
My name is SUSI.
```

Adding examples for each skill gives us an overview of what SUSI can do.
We can look at all example queries at http://api.susi.ai/cms/getExampleSkill.json
