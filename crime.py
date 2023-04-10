from config import apiConfig
import requests, logging, traceback, json

logger = logging.getLogger()

class CrimeAPI:
    def getChicagoCrime(self):
        url = apiConfig.urls['chicagoCrime']
        try:
            response = requests.get(url)
            # byte_string = json.dumps(response.content).encode('utf-8')
            data = json.loads(response.content)
            # Write byte string to file
            with open('/static/crimedata/crimedata.json', 'w') as f:
                json.dump(data, f, indent=2)

        except Exception as e:
            print("Error in getChicagoCrime : " + str(e)+ traceback.format_exc())

    def parseNeighborhoods(self):
        with open('/static/crimedata/crimedata.json') as f:
            data = json.load(f)
        value_counts = {}

        for item in data:
            block = item['block']
            if block in value_counts:
                value_counts[block]['count'] += 1
                if 'latitude' in item:
                    if not value_counts[block]['latitude']: 
                        value_counts[block]['latitude'] = item['latitude']
                else:
                    if 'location' in item:
                        if not value_counts[block]['latitude']: 
                            value_counts[block]['latitude'] = item['location']['latitude']

                if 'longitude' in item:
                    if not value_counts[block]['longitude']: 
                        value_counts[block]['longitude'] = item['longitude']
                else:
                    if 'location' in item:
                        if not value_counts[block]['longitude']: 
                            value_counts[block]['longitude'] = item['location']['longitude']
                        
            else:
                value_counts[block] = {'count':1, 'latitude':None, 'longitude':None}
                if 'latitude' in item:
                    value_counts[block]['latitude'] = item['latitude']
                else:
                    if 'location' in item:
                        value_counts[block]['latitude'] = item['location']['latitude']

                if 'longitude' in item:
                    value_counts[block]['longitude'] = item['longitude']
                else:
                    if 'location' in item:
                        value_counts[block]['longitude'] = item['location']['longitude']
        
        print(value_counts)

        with open('/static/crimedata/parsedNeighborhoods.json', 'w') as f:
            json.dump(value_counts, f, indent=4)


if __name__ == "__main__":
    CrimeAPI.parseNeighborhoods(CrimeAPI)