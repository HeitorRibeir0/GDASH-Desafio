import requests
import json
import pika
import time

# Base da Configuração
url = "https://api.open-meteo.com/v1/forecast"
params = {
    "latitude": -7.916250223682314,
    "longitude": -34.885702588527636,
    "current": "temperature_2m,relative_humidity_2m,wind_speed_10m,rain,showers,precipitation,weather_code",
    "timezone": "auto"
}

# Conexão RabbitMQ
credentials = pika.PlainCredentials("admin", "admin", erase_on_connect=False)
parameters = pika.ConnectionParameters('rabbitmq',
                                       5672,
                                       '/',
                                       credentials)
connection = pika.BlockingConnection(parameters)
channel = connection.channel()
channel.queue_declare(queue="Temp Data", durable=True)

print("Coletor iniciado.")

while True:
    try:
        response = requests.get(url, params=params)
        data = response.json()
        jsonconvertido = json.dumps(data)

        channel.basic_publish(exchange='',
                              routing_key="Temp Data",
                              body=jsonconvertido)

        print(f"Dados enviados. Status: {response.status_code}")

        time.sleep(30)

    except Exception as e:
        print(f"Erro: {e}")
        time.sleep(5)