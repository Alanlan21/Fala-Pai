# 🗣️ FalaPai

> *Um assistente de comunicação inteligente criado com amor*

## 📖 História

Este projeto nasceu de uma necessidade pessoal muito especial. Após meu pai passar por uma cirurgia que envolveu suas cordas vocais, percebi a importância de ter uma ferramenta de comunicação assistiva que fosse simples, eficiente e natural. O FalaPai foi desenvolvido para ajudar pessoas que enfrentam dificuldades de fala a se comunicarem de forma mais fluida e independente.

## 🎯 O que é o FalaPai?

O FalaPai é uma aplicação web progressiva (PWA) de comunicação assistiva que converte texto em fala utilizando síntese de voz de alta qualidade. Projetado especificamente para pessoas com dificuldades de comunicação vocal, oferece uma interface intuitiva e funcionalidades pensadas para o uso cotidiano.

## ✨ Funcionalidades

### 🚀 **Síntese de Voz Avançada**
- Integração com a API ElevenLabs para voz natural em português brasileiro
- Controles intuitivos de reprodução (play/pause/resume)
- Qualidade de voz multilíngue de última geração

### ⚡ **Frases Rápidas**
- Sistema de 10 frases pré-configuradas para comunicação comum
- Reorganização através de drag & drop
- Edição completa: adicionar, editar e excluir frases
- Persistência automática no dispositivo

### 📝 **Frases Longas Salvas**
- Editor dedicado para textos mais extensos
- Sistema de títulos para organização
- Armazenamento local seguro

### 📱 **Progressive Web App (PWA)**
- Instalável como aplicativo nativo no celular/desktop
- Funciona offline após a primeira instalação
- Interface responsiva e moderna
- Tema personalizado em gradientes roxo/índigo

## 🛠️ Stack Tecnológica

```
Frontend:    React 19.1.0 + Vite 7.0.0
Estilização: Tailwind CSS 3.4.3 + Google Fonts (Inter)
PWA:         vite-plugin-pwa
Drag & Drop: @hello-pangea/dnd
Síntese:     ElevenLabs API
Build:       Vite com otimizações para produção
```

## 🚀 Como usar

### Pré-requisitos
- Node.js 18+ instalado
- Chave de API da ElevenLabs (opcional, para síntese de voz premium)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Alanlan21/Fala-Pai.git
   cd Fala-Pai
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure a API (opcional)**
   - Obtenha sua chave da API em [ElevenLabs](https://elevenlabs.io/)
   - Configure a chave no código ou variável de ambiente

4. **Execute o projeto**
   ```bash
   # Desenvolvimento
   npm run dev

   # Build para produção
   npm run build

   # Preview do build
   npm run preview
   ```

5. **Instale como PWA**
   - Abra o aplicativo no navegador
   - Procure pelo ícone de "Instalar app" na barra de endereços
   - Ou use "Adicionar à tela inicial" no menu do navegador


## 👨‍💻 Autor

**Alan Regis** - [Alanlan21](https://github.com/Alanlan21)

---

<div align="center">
  

**⭐ Se este projeto te ajudou, considere dar uma estrela!**

</div>
