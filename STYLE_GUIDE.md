Naming Conventions:
  HTML: dash-case (hyphenated)
  JS: camelCase

Colours:
- background-color: rgb(232, 229, 229) - darker grey
- form: white

Font
- font-family: Arial, Helvetica, sans-serif;

Nav:
- no bullets
- in a row

ul {
    list-style: none;
    display: flex;
    padding: 0;
}

li {
    padding: 1rem;
}


Form:
inputs, select, fieldsets{
  border: 1px solid lightgray;
  padding: 0.3rem;
}


Buttons:
Same button style, different colours for different functions (submit, delete)

button {
    color: white;
    border: 0rem;
    border-radius: 0.25rem;
    cursor: pointer;
    padding: 0.5rem 1rem;
}

#submit-button{
    background-color:  rgb(40, 89, 224);
}

#submit-button:hover{
    background-color: rgb(100, 100, 199)
}

#delete-button{
    background-color: #ff0000;
}

#delete-button:hover{
    background-color: #e50000;
}


Tables:

table{
    border-collapse: collapse;
    width: 100%;
}

td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }
  
tr:nth-child(even) {
background-color: #dddddd;
}

