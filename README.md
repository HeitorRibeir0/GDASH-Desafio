# 🌦️ GDash Desafio Full Stack

> Sistema de monitoramento climático distribuído baseado em microsserviços, com coleta em tempo real, processamento assíncrono e dashboard interativo.

![Status](https://img.shields.io/badge/Status-Concluído-success)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)


---

## Sobre o Projeto

Este projeto foi desenvolvido como parte de um desafio técnico Full Stack. O objetivo é demonstrar a integração entre múltiplas linguagens de programação e serviços, orquestrados via Docker.

O sistema coleta dados meteorológicos de uma API externa (Open-Meteo), processa-os através de uma fila de mensagens e os disponibiliza em um Dashboard seguro com insights gerados automaticamente.

### Arquitetura

O fluxo de dados segue o seguinte pipeline:

`[Python Coletor]` ➔ *(RabbitMQ)* ➔ `[Go Worker]` ➔ *(HTTP)* ➔ `[NestJS API]` ➔ *(MongoDB)* ➔ `[React Dashboard]`

## Link de apresentação:
[Acessar Apresentação](https://youtu.be/0N0tOhQtLWw)

---

##  Tecnologias Utilizadas

###  Coleta & Processamento
* **Python 3.9:** Script de coleta automática (loop infinito a cada 30s).
* **RabbitMQ:** Message Broker para desacoplar a coleta do processamento.
* **Go (Golang) 1.23:** Worker de alta performance para consumo da fila e envio para a API.

###  Backend (API)
* **NestJS (Node.js):** Framework principal da API.
* **MongoDB:** Banco de dados NoSQL para histórico de logs e usuários.
* **Mongoose:** ODM para modelagem de dados.
* **JWT (JSON Web Token):** Autenticação e proteção de rotas.
* **Bcrypt:** Criptografia de senhas.

###  Frontend (Dashboard)
* **React + Vite:** Single Page Application rápida e moderna.
* **Tailwind CSS:** Estilização utilitária.
* **Shadcn/ui:** Componentes visuais profissionais (Cards, Tabelas, Inputs).
* **Lucide React:** Ícones.

###  Infraestrutura
* **Docker & Docker Compose:** Orquestração de todos os 6 serviços (App + Banco + Fila).

---

##  Funcionalidades

* **Monitoramento em Tempo Real:** O Dashboard atualiza automaticamente a cada 30 segundos.
* **Autenticação Segura:** Login obrigatório para acessar os dados (Guards + JWT).
* **Insights Inteligentes:** Análise automática dos dados para sugerir o "clima do dia".
* **Histórico Completo:** Tabela com todos os registros salvos no banco.
* **Exportação de Dados:** Download do histórico em formato **CSV**.
* **Integração Externa:** Página dedicada para listagem de Pokémons (consumindo PokéAPI via Backend).

---

## 🏃 Como Rodar o Projeto

### Pré-requisitos
* [Docker](https://www.docker.com/) e Docker Compose instalados na máquina.

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/gdash-desafio.git](https://github.com/seu-usuario/gdash-desafio.git)
    cd gdash-desafio
    ```

2.  **Suba os containers:**
    Este comando irá construir as imagens (build) e iniciar os serviços em segundo plano.
    ```bash
    docker-compose up -d --build
    ```

3.  **Aguarde a inicialização:**
    O processo pode levar alguns minutos na primeira vez. Verifique se tudo está rodando com:
    ```bash
    docker ps
    ```

---

## 🔐 Configuração Inicial (Primeiro Acesso)

Como o banco de dados inicia vazio no Docker, você precisa criar o primeiro usuário **via terminal** para conseguir logar no sistema.

**Rode este comando no seu terminal (enquanto o Docker estiver rodando):**

**Linux/Mac/Git Bash:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Admin", "email": "admin@teste.com", "senha": "123"}'
```

Windows (PowerShell):
```bash
Invoke-RestMethod -Uri "http://localhost:3000/users" -Method Post -ContentType "application/json" -Body '{"name": "Admin", "email": "admin@teste.com", "senha": "123"}'
```

## Endereços de Acesso:

Após subir o Docker, os serviços estarão disponíveis nestas portas:
```
|Serviço  |	URL |	              | Descrição                |
|------------------------------------------------------------|
|Frontend | http://localhost:5173 | O Dashboard principal.   |
|API      |	http://localhost:3000 |	Backend NestJS.          |
|RabbitMQ |	http://localhost:15672| Painel de gestão da fila.|
```
 
 * Login do Dashboard: admin@teste.com / 123 (ou o que você criou acima).
 * Login do RabbitMQ: admin / admin.


---
```
📂 Estrutura de Pastas
.
├── api/                 # Backend em NestJS
├── frontend/            # Frontend em React + Vite
├── weather_collector/   # Script Python
├── weather_worker/      # Worker em Go
├── mongo_data/          # Persistência do MongoDB (gerado pelo Docker)
└── docker-compose.yml   # Orquestrador

```
