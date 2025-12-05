import { useEffect, useState } from 'react'
import './App.css'

interface WeatherLog {
  
    temperature_2m: number;
    relative_humidity_2m: number;
  
}

function App() {

  const [datas, setData] = useState<WeatherLog[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('http://localhost:3000/api/weather/logs');
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Erro ao buscar:", error)
      }
    })();
  }, []);
  
  if (datas === null) {
    return <p>Carregando...</p>;
}

  if (datas.length === 0) {
    return <p> Sem dados de clima no momento.</p>;
  }

  const currentData = datas[datas.length - 1];

  return (
<>
      <h1>Dashboard de Clima</h1>
      <div className="card">
        <h2>Temperatura Atual: {currentData.temperature_2m}°C</h2>
        <p>Umidade: {currentData.relative_humidity_2m}%</p>
      </div>
    </>
  )

}

export default App
