# from GoogleNews import GoogleNews
from difflib import SequenceMatcher
from datetime import date, timedelta
import requests

API_KEY = "075b051cebfb4f528b6d18997f6274ab"


def scrape(pname):
        tags = ['+shooting', '+theft', '+murder']
        usedict = {}
        for elem in tags:
            usedict[elem] = []
        gnews = GoogleNews()

    # for elem in tags:
        gnews.clear()
        gnews.search(pname + tags[0])
        res = gnews.results()
        for i in range(3):
            if (res[i]['media'] != 'YouTube'):
                usedict[elem].append(res[i]['title'])
        print(len(res))
        arr = []
        for elem in tags:
            arr.append(usedict[elem][0])

        print(arr)








