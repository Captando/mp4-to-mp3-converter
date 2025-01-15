# 🎵 MP4 to MP3 Converter

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat)
[![GitHub](https://img.shields.io/badge/GitHub-Captando-blue?style=flat&logo=github)](https://github.com/Captando)

Uma API simples e eficiente para converter seus arquivos MP4 para MP3.

[Instalação](#-instalação) •
[Como Usar](#-como-usar) •
[Endpoints](#-endpoints) •
[Contribuição](#-contribuição)

</div>

## 📋 Sobre

API desenvolvida em Node.js para converter arquivos MP4 para MP3. Oferece uma solução simples e eficiente para extrair o áudio dos seus vídeos, com gerenciamento automático de arquivos temporários.

## 🚀 Tecnologias Utilizadas

- `Node.js` - Ambiente de execução
- `Express` - Framework web
- `FFmpeg` - Processamento de mídia
- `Multer` - Upload de arquivos

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Captando/mp4-to-mp3-converter.git
cd mp4-to-mp3-converter
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor:
```bash
npm start
```

Para desenvolvimento:
```bash
npm run dev
```

## 🎯 Como Usar

### Endpoint Principal

\`\`\`
POST http://localhost:3000/convert
\`\`\`

### Exemplos de Uso

#### 1. cURL
```bash
curl -X POST -F "video=@video.mp4" http://localhost:3000/convert -o audio.mp3
```

#### 2. HTML Form
```html
<form action="http://localhost:3000/convert" method="post" enctype="multipart/form-data">
    <input type="file" name="video" accept="video/mp4" required>
    <button type="submit">Converter para MP3</button>
</form>
```

#### 3. JavaScript (Fetch API)
```javascript
async function convertVideo(videoFile) {
    const formData = new FormData();
    formData.append('video', videoFile);

    const response = await fetch('http://localhost:3000/convert', {
        method: 'POST',
        body: formData
    });

    const blob = await response.blob();
    return blob;
}
```

## 🛠 Endpoints

| Endpoint | Método | Descrição |
|----------|---------|------------|
| `/convert` | POST | Converte arquivo MP4 para MP3 |
| `/health` | GET | Verifica status da API |

## 📝 Respostas da API

| Status | Descrição |
|--------|-----------|
| `200` | Sucesso - Retorna o arquivo MP3 convertido |
| `400` | Erro - Nenhum arquivo enviado |
| `500` | Erro - Falha na conversão |

## 👨‍💻 Desenvolvimento

1. Fork o repositório
2. Crie uma branch para sua feature
   ```bash
   git checkout -b feature/NovaFeature
   ```
3. Commit suas mudanças
   ```bash
   git commit -m 'Add: nova feature'
   ```
4. Push para a branch
   ```bash
   git push origin feature/NovaFeature
   ```
5. Abra um Pull Request

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

- 🐛 Reportar bugs
- 💡 Sugerir novas features
- 📖 Melhorar documentação

## ⭐ Autor

[GitHub - Captando](https://github.com/Captando)

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<div align="center">
Made with ❤️ by <a href="https://github.com/Captando">Captando</a>
</div>
