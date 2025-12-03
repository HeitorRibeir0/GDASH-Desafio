import requests
import json
import pika

#Base da Configuração
url = "https://api.open-meteo.com/v1/forecast"
params = {
    "latitude": -7.916250223682314,
    "longitude": -34.885702588527636,
    "current": "temperature_2m,relative_humidity_2m,wind_speed_10m,rain,showers,precipitation,weather_code",
    "timezone": "auto"
}

#Recebe os dados e converte para json
response = requests.get(url, params=params)
data = response.json()

jsonconvertido = json.dumps(data)

print("Status Code:", response.status_code)
print(json.dumps(data, indent=4))

credentials = pika.PlainCredentials("admin", "admin", erase_on_connect=False)
parameters = pika.ConnectionParameters('localhost',
                                       5672,
                                       '/',
                                       credentials)
connection = pika.BlockingConnection(parameters)
channel = connection.channel()

channel.queue_declare(queue="Temp Data", durable = True)
channel.basic_publish(exchange='',
                      routing_key="Temp Data",
                      body= jsonconvertido)
