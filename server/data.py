import pandas as pd

class DataPot:

    def __init__(self):
        # data acquisition
        self.data = pd.read_excel('data/data.xlsx')
        self.cols = self.data.columns

        # target questions
        self.qs = ['Q1.', 'Q3.', 'Q7.', 'Q8.', 'Q10.']
        self.bufferQsofinterest()

    def bufferQsofinterest(self):
        # buffer
        buf = []

        # column heads
        for each in self.qs:
            #get questions of interest in the distribution
            for eachh in self.cols:
                if each in eachh:
                    buf.append(eachh)

        # groups per question
        # get unique divisions per group
        dist = {}
        for each in buf:
            # discover groups per question
            if each not in dist.keys():
                dist[each] = {}
                tmp = self.data[each].unique().tolist()
                
                # pass tmp as keys
                for group in tmp:
                    dist[each][group] = self.data.loc[self.data[each] == group, each].count()
        
        # distribution dictionary
        self.distribution = dist

    def questions(self):
        return self.distribution.keys()

    def groups(self, question=None):
        if question is not None and question in self.distribution.keys():
            return self.distribution[question]
        else:
            return []

    def fullDistribution(self):
        return self.distribution


    # new disribution 
    def newFilteredDistribution(self, data=None):
        cols = self.cols

        if data is None:
            data = self.data

        # target questions
        qs = ['Q1.', 'Q3.', 'Q7.', 'Q8.', 'Q10.']

        # buffer question of interest
        buf = []

        # column heads
        for each in qs:
            #get questions of interest in the distribution
            for eachh in cols:
                if each in eachh:
                    buf.append(eachh)

        # get unique divisions per group
        dist = {}
        for each in buf:
            # discover groups per question
            if each not in dist.keys():
                dist[each] = {}
                tmp = data[each].unique().tolist()

                # pass tmp as keys
                for group in tmp:
                    dist[each][group] = float(data.loc[data[each] == group, each].count())

        return dist

    

    def filter(self, filters=None):
        newD = self.data
        if filters is not None and len(filters.keys()) > 0:
            for key, value in filters.items():
                newD = newD.loc[newD[key] == value]

            return self.newFilteredDistribution(data=newD)

        else:
            print ('Ensure Appropriate filters are provided')
            return self.newFilteredDistribution()
