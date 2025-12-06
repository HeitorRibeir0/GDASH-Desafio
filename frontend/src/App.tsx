import { useEffect, useState } from 'react'
import './App.css';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface WeatherLog {
  temperature_2m: number;
  relative_humidity_2m: number;
  createdAt: string;
  _id: string;
}

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [datas, setData] = useState<WeatherLog[] | null>(null);
  const [insight, setInsight] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      if (!response.ok) throw new Error('Login falhou');

      const data = await response.json();
      const newToken = data.access_token;

      localStorage.setItem('token', newToken);
      setToken(newToken);
      setError("");
    } catch (err) {
      setError("Email ou senha inválidos!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setData(null);
  };

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const response = await fetch('http://localhost:3000/api/weather/logs', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setData(data);
        }
      } catch (error) {
        console.error("Erro ao buscar logs:", error);
      }
    })();

    (async () => {
      try {
        const response = await fetch('http://localhost:3000/api/weather/insights', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.text();
          setInsight(data);
        }
      } catch (error) {
        console.error("Erro ao buscar insights:", error);
      }
    })();
  }, [token]);

  const formatDate = (createdAt: string) => {
    const a = new Date(createdAt);
    return a.toLocaleString('pt-BR');
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Acesso Restrito 🔒</CardTitle>
            <CardDescription>Entre para ver o clima em tempo real.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="senha">Senha</Label>
                <Input id="senha" type="password" placeholder="******" value={senha} onChange={e => setSenha(e.target.value)} />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleLogin} className="w-full">Entrar</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (datas === null) {
    return <p className="text-center mt-10">Carregando dados seguros...</p>;
  }

  if (datas.length === 0) {
    return <p className="text-center mt-10">Sem dados de clima no momento.</p>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard de Clima 🌦️</h1>
        <Button variant="outline" onClick={handleLogout}>Sair</Button>
      </div>

      {insight && (
        <Card className='mb-8 border-l-4 border-l-blue-500 shadow-sm'>
          <CardHeader>
            <CardTitle className="text-blue-700">Insight de IA 🧠</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{insight}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Temperatura</TableHead>
              <TableHead>Humidade</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datas.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium text-lg">{item.temperature_2m}°C</TableCell>
                <TableCell>{item.relative_humidity_2m}%</TableCell>
                <TableCell className="text-gray-500">{formatDate(item.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="p-4 border-t flex justify-end">
          <a href="http://localhost:3000/api/weather/export/csv" download>
            <Button variant="secondary">📥 Baixar Histórico (CSV)</Button>
          </a>
        </div>
      </Card>
    </div>
  )
}

export default App
