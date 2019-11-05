from server.data import DataPot


x = DataPot()

# list of target questions
qs = x.questions()
gsG = {}
for each in qs:
    # access groups per questions
    print (each)

    gs = x.groups(question=each)
    for eachh, key in gs.items():
        print (eachh, key)
        if eachh not in gsG:
            gsG[each] =[]
            gsG[each].append(eachh)
        else:
            gsG[each].append(eachh)


# filter per group
print (x.fullDistribution())
print (x.filter())

fil = {}
fq = qs[1]

print (gsG)

fil[fq] = gsG[fq][0]
print (fil)
print ('\n\n')
print (x.filter(filters=fil))
