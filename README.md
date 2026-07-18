# Nutrição em Movimento

Blog premium de nutrição, comportamento alimentar, emagrecimento sustentável e Bem-Estar Nutricional.

O projeto foi desenvolvido para criar uma presença digital profissional para uma nutricionista, com foco em conteúdo educativo, autoridade de marca, SEO, monetização ética e gestão de artigos por painel administrativo próprio.

## Objetivo

Construir uma plataforma moderna de conteúdo em nutrição, com visual editorial premium e estrutura preparada para crescimento.

O blog foi pensado para evoluir futuramente para:

* consultas online;
* newsletter;
* e-books;
* cursos;
* área de membros;
* comunidade;
* ferramentas inteligentes;
* aplicativo.

## Funcionalidades atuais

* Home premium responsiva;
* página de artigos;
* página individual de artigo com slug;
* painel administrativo;
* CRUD de artigos;
* categorias;
* perfil da nutricionista editável;
* integração com MySQL;
* Prisma ORM;
* upload de imagem via Cloudinary;
* estrutura preparada para SEO;
* disclaimer nutricional obrigatório;
* layout mobile-first.

## Stack utilizada

* Next.js
* React
* TypeScript
* Tailwind CSS
* Prisma
* MySQL
* Cloudinary
* bcryptjs
* zod
* slugify

## Segurança

Este repositório não inclui arquivos sensíveis.

Variáveis como credenciais de banco, tokens, chaves da Cloudinary e secrets de autenticação devem ser configuradas em um arquivo `.env`, baseado no `.env.example`.

Nunca envie para o GitHub:

* `.env`
* senhas;
* tokens;
* secrets;
* chaves privadas;
* dados reais de produção.

## Instalação local

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/nutricao-em-movimento.git
```

Acesse a pasta:

```bash
cd nutricao-em-movimento
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` com base no `.env.example`.

Gere o Prisma Client:

```bash
npx prisma generate
```

Execute o projeto:

```bash
npm run dev
```

Acesse:

```bash
http://localhost:3000
```

## Banco de dados

O projeto usa MySQL com Prisma.

Para sincronizar o schema com o banco:

```bash
npx prisma db push
```

Para popular dados iniciais:

```bash
npm run seed
```

## Aviso nutricional

As informações publicadas neste site têm caráter educativo e não substituem avaliação individualizada com nutricionista.

## Status do projeto

Em desenvolvimento ativo.

Principais próximas etapas:

* login administrativo completo;
* upload de capa dos artigos;
* métricas de visualização;
* artigo da semana;
* top artigos mais vistos;
* newsletter funcional;
* SEO avançado;
* deploy em produção.
