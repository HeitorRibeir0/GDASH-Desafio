import { useEffect, useState } from 'react'
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
  const [pokemons, setPokemons] = useState<any[]>([]);
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

    const fetchData = async () => {
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
    };

    fetchData();

    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);

  }, [token]); 

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('http://localhost:3000/pokemon?limit=151');
        if (response.ok) {
          const data = await response.json();
          setPokemons(data.results);
        }
      } catch (error) {
        console.error("Erro ao buscar pokémons:", error);
      }
    })();
  }, []);

  const formatDate = (createdAt: string) => {
    const a = new Date(createdAt);
    return a.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  const getPokemonImage = (index: number) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`;
  }

  // --- Tela de Login ---
  if (!token) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-950 selection:bg-indigo-500 selection:text-white overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px]" />
            <div className="absolute top-[40%] -right-[10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
        </div>

        <Card className="w-full max-w-md mx-4 p-2 bg-slate-900/60 border-slate-800 backdrop-blur-xl shadow-2xl rounded-2xl relative z-10">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold tracking-tighter text-white">Bem-vindo 👋</CardTitle>
            <CardDescription className="text-slate-400">Entre com suas credenciais para acessar o painel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input 
                id="email" 
                placeholder="nome@exemplo.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="bg-slate-950/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus-visible:ring-indigo-500 h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha" className="text-slate-300">Senha</Label>
              <Input 
                id="senha" 
                type="password" 
                placeholder="••••••••" 
                value={senha} 
                onChange={e => setSenha(e.target.value)} 
                className="bg-slate-950/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus-visible:ring-indigo-500 h-11 rounded-xl"
              />
            </div>
            {error && <div className="p-3 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg text-center">{error}</div>}
          </CardContent>
          <CardFooter className="pt-2">
            <Button onClick={handleLogin} className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-all">
              Acessar Sistema
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // --- Loading ---
  if (datas === null) {
    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-slate-950">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                <p className="text-slate-400 font-medium">Carregando dados seguros...</p>
            </div>
        </div>
    );
  }

  // --- Dashboard ---
  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-200 pb-20 selection:bg-indigo-500 selection:text-white">
      
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">Weather<span className="text-indigo-400">Dash</span></h1>
          </div>
          
          <Button variant="ghost" onClick={handleLogout} className="text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition-colors">
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 space-y-8 max-w-7xl">
        
        {insight && (
          <div className="grid gap-6 md:grid-cols-[1fr]">
            <Card className="bg-gradient-to-r from-indigo-950/40 to-slate-900/40 border-indigo-500/30 shadow-lg rounded-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-indigo-400 flex items-center gap-2 text-lg">
                  ✨ Análise de IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium text-slate-200 leading-relaxed">{insight}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* --- GRID CONTAINER --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
            {/* Coluna 1: Monitoramento */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1 h-[36px]">
                    <h2 className="text-2xl font-semibold tracking-tight text-white">Monitoramento</h2>
                    <a href="http://localhost:3000/api/weather/export/csv" download>
                        <Button variant="outline" size="sm" className="bg-slate-900 border-slate-700 text-slate-300 hover:bg-indigo-950 hover:text-indigo-300 hover:border-indigo-800 transition-all rounded-xl">
                        📥 Exportar CSV
                        </Button>
                    </a>
                </div>
                
                <Card className="bg-slate-900/50 border-slate-800 shadow-xl rounded-2xl overflow-hidden">
                    <div className="h-[400px] overflow-y-auto custom-scrollbar relative">
                        <Table>
                            <TableHeader className="bg-slate-900 sticky top-0 z-10 shadow-sm shadow-slate-950/50">
                                <TableRow className="border-slate-800 hover:bg-transparent">
                                    <TableHead className="text-slate-400 font-medium pl-6">Temperatura</TableHead>
                                    <TableHead className="text-slate-400 font-medium">Humidade</TableHead>
                                    <TableHead className="text-slate-400 font-medium text-right pr-6">Registro</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {datas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center text-slate-500">Sem dados registrados.</TableCell>
                                </TableRow>
                            ) : (
                                datas.map((item) => (
                                    <TableRow key={item._id} className="border-slate-800 hover:bg-indigo-950/20 transition-colors">
                                        <TableCell className="font-semibold text-slate-200 pl-6 text-base">
                                            <span className={item.temperature_2m > 30 ? "text-orange-400" : "text-cyan-400"}>
                                                {item.temperature_2m}°C
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500" style={{ width: `${item.relative_humidity_2m}%` }}></div>
                                                </div>
                                                {item.relative_humidity_2m}%
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-400 text-right pr-6 font-mono text-sm">{formatDate(item.createdAt)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </section>

            {/* Coluna 2: Pokémons */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1 h-[36px]">
                    <h2 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
                        <span className="text-yellow-500">⚡</span> Integrações Externas
                    </h2>
                </div>

                <Card className="bg-slate-900/50 border-slate-800 shadow-lg rounded-2xl overflow-hidden">
                    <div className="h-[400px] overflow-y-auto custom-scrollbar relative">
                        <Table>
                            <TableHeader className="bg-slate-900 sticky top-0 z-10 shadow-sm shadow-slate-950/50">
                                <TableRow className="border-slate-800 hover:bg-transparent">
                                    <TableHead className="text-slate-400 font-medium pl-6">Lista de Pokémons</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pokemons.map((poke: any, index) => (
                                    <TableRow key={poke.name} className="border-slate-800/50 hover:bg-slate-800/50">
                                        <TableCell className="pl-6 font-medium text-slate-300">
                                            <div className="flex items-center gap-3">
                                                <span className="text-slate-600 text-xs font-mono w-6">#{index + 1}</span>
                                                
                                                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center overflow-hidden border border-slate-700/50">
                                                    <img 
                                                        src={getPokemonImage(index)} 
                                                        alt={poke.name}
                                                        className="w-8 h-8 object-contain"
                                                        loading="lazy"
                                                    />
                                                </div>

                                                <span className="capitalize text-slate-200 text-lg">{poke.name}</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </section>

        </div>
      </main>
    </div>
  )
}

export default App