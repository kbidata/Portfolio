import json
import urllib3
import csv

# Make sure to ask about Arapahoe County

http = urllib3.PoolManager()
zip = ['73019', '36568', '72701', '80520', '81501', '88201', '88220', '98061', '82601']
locationkey = ['178220_PC', '15880_PC', '31537_PC', '35242_PC', '35602_PC', '37421_PC', '37427_PC', '41313_PC', '35750_PC']
location = ['Norman', 'Mobile', 'Fayetteville', 'Firestone', 'Grand Junction', 'Roswell', 'Carlsbad', 'Bainbridge Island', 'Casper']
state = ['OK', 'AL', 'AR', 'CO', 'CO', 'NM', 'NM', 'WA', 'WY']
header = ['City', 'State', 'LocationKey', 'Date', 'Description', 'hiTempF', 'lowTempF', 'precipitationProbability', 'snowProbability', 'iceProbability', 'totalPrecipitationIn', 'windSpeed']

# do this for each day, get daily forecast separately

with open('test.csv', 'w') as csvfile:
    filewriter = csv.writer(csvfile, delimiter=',', quotechar = '|', quoting=csv.QUOTE_MINIMAL)
    filewriter.writerow(header)
    for y in range(len(locationkey)):
        locationkey1 = locationkey[y]
        r = http.request('GET', 'http://dataservice.accuweather.com/forecasts/v1/daily/5day/' + locationkey1 + '?apikey=myapikey&language=en-us&details=true&metric=false')
        result = json.loads(r.data.decode('utf-8'))
        dailyforecasts = result.get('DailyForecasts')
        x = 0
        while x < 5:
            city = location[y]
            state1 = state[y]
            locationkey1 = locationkey[y]
            date = dailyforecasts[x].get('Date')
            description = dailyforecasts.[x].get('Day').get('LongPhrase')
            hitemp = dailyforecasts.[x].get('Temperature').get('Maximum').get('Value')
            lowtemp = dailyforecasts.[x].get('Temperature').get('Minimum').get('Value')
            pprob = dailyforecasts.[x].get('Day').get('PrecipitationProbability')
            snowprob = dailyforecasts.[x].get('Day').get('SnowProbability')
            iceprob = dailyforecasts.[x].get('Day').get('IceProbability')
            totalliquid = dailyforecasts.[x].get('Day').get('TotalLiquid').get('Value')
            windspeed = dailyforecasts.[x].get('Day').get('Wind').get('Speed').get('Value')
            filewriter.writerow([city, state1, locationkey1, date, description, hitemp, lowtemp, pprob, snowprob, iceprob, totalliquid, windspeed])
            x = x + 1
