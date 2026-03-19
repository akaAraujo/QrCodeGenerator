# 📌 QR Code Generator

Gerador de QR Code desenvolvido com **frontend em React + Vite** e **backend em .NET**, permitindo a criação de códigos QR de forma simples, rápida e eficiente.

---

## 🚀 Demonstração

🔗 https://qr-code-generator-git-main-akaaraujos-projects.vercel.app/

---

## 🧱 Arquitetura do Projeto

O projeto está dividido em duas partes principais:

- **Frontend:** React + Vite (Vercel)
- **Backend:** API REST em .NET (Railway)

---

## ⚙️ Tecnologias Utilizadas

### 🔹 Frontend
- React
- Vite
- Axios
- CSS / Tailwind (se aplicável)

### 🔹 Backend
- .NET (ASP.NET Core Web API)
- Biblioteca de geração de QR Code

---

## ✨ Funcionalidades

- ✅ Gerar QR Code a partir de texto ou URL  
- ✅ Download do QR Code (imagem)  
- ✅ Integração frontend ↔ backend via REST API  
- ✅ Interface simples e intuitiva  

---

## 🌐 Deploy

O projeto está hospedado utilizando:

- **Frontend:** Vercel  
- **Backend:** Railway  

---

## 🔗 Integração

O frontend consome a API através de requisições HTTP (REST), enviando o conteúdo a ser convertido em QR Code e recebendo a imagem gerada como resposta.

---

## 📌 Endpoints da API
Criar QR Code
- `POST /api/qrcode`
