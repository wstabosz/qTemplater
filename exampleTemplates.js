
templates.example = {
    'SQL Insert': {
        name: 'SQL Insert',
        source: '{#rows}INSERT INTO People \n'
            + '({tags[0]},\n'
		    + '  {tags[1]},\n'
		    + '  {tags[2]},\n'
		    + '  {tags[3]}) \n'
	        + 'VALUES \n'
		    + " ( '{FirstName}',\n"
		    + "  '{LastName}',\n"
		    + "  {Age},\n"
		    + "  '{FavoriteColor}'){~n}{/rows}",
        data: [
	        ["FirstName", "LastName", "Age", "FavoriteColor"],
	        ["Arthur", "Dent", 42, "Yellow"],
	        ["Ford", "Prefect", 198, "Green"],
	        ["Zaphod", "Beeblebrox", 200, "Gold"]
	    ]
    }
    , "HTML Table": { "name": "HTML Table", "source": "<style type=\"text/css\">\n td , tr { \n   border: 1px solid #000;\n   padding: 5px;\n   background-color: #afa;\n }\n th {\n   background-color: #3c3;\n   border: 1px solid #000;\n }\n</style>\n\n<table>\n<tr>\n<th>First Name</th>\n<th>Last Name</th>\n<th>Age</th>\n<th>Favorite Color</th>\n</tr>\n{#rows}\n<tr>\n<td>{FirstName}</td>\n<td>{LastName}</td>\n<td>{Age}</td>\n<td>{FavoriteColor}</td>\n</tr>\n{/rows}\n</table>", "data": [["FirstName", "LastName", "Age", "FavoriteColor", ""], ["Arthur", "Dent", "42", "Yellow", ""], ["Ford", "Prefect", "198", "Green", ""], ["Zaphod", "Beeblebrox", "200", "Gold", ""], ["", "", "", "", ""]] }

};
