import json

def findLanguage(idString):
    thisLanguage = ""
    for k in idString:
        if k == '-':
            break
        else:
            thisLanguage = thisLanguage + k
    return thisLanguage

#print("Enter a first DFA json file: ")
#fileName = "data/" + input()
fileName = 'data/dfaExample1.json'

with open(fileName, "r") as read_file:
    data1 = json.load(read_file)

#print("Enter a second DFA json file: ")
#fileName = "data/" + input()
fileName = "data/dfaExample2.json"

with open(fileName, "r") as read_file:
    data2 = json.load(read_file)

combined = {}
combined['nodes'] = []
combined['edges'] = []
xCounter = 1

combined['nodes'].append({
    "id" : "start",
    "label" : "start",
    "x" : 0,
    "y" : 0,
    "size" : 1
})

for i in data1['nodes']:
    for j in data2['nodes']:
        if (str(i['id']) == "start") | (str(j['id']) == "start"):
            continue
        newState = str(i['id']) + str(j['id'])
        combined['nodes'].append({
            "id" : newState,
            "label" : newState,
            "x" : xCounter,
            "y" : 0,
            "size" : 5
        })
        xCounter = xCounter + 1


for i in data1['edges']:
    for j in data2['edges']:
        #come back to this... need to combine edges. think of looking for the same prefix, which ends up being the language of the DFA and then combining the
        #targets and sources to create new targets and sources. The new id should be 'language-source'
        iLanguage = findLanguage(i['id'])
        jLanguage = findLanguage(j['id'])

        if (iLanguage == "start") & (jLanguage == "start"):
            combined['edges'].append({
                "id" : "start",
                "source" : "start",
                "target" : i['target'] + j['target']
            })
            break

        if (iLanguage == jLanguage) & ((iLanguage != "start") | (jLanguage != "start")):
            combined['edges'].append({
                "id" : iLanguage + "-" + i['source'] + j['source'],
                "source" : i['source'] + j['source'],
                "target" : i['target'] + j['target']
            })

hasALink = False
for i in combined['nodes']:
    for j in combined['edges']:
        if (i['id'] == j['target']) | (i['id'] == "start"):
            hasALink = True
            break
    if hasALink == False:
        for k in combined['edges']:
            if k['source'] == i['id']:
                combined['edges'].remove(k)
        combined['nodes'].remove(i)
    else:
        hasALink = False
            



print(combined)

with open('data/combined.json', 'w') as outfile:
    json.dump(combined, outfile, indent=4)
